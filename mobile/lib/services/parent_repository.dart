import 'package:dio/dio.dart';

import '../models/menu.dart';
import '../models/order.dart';
import '../models/student.dart';
import 'api_client.dart';
import 'offline_cache.dart';

class ParentRepository {
  ParentRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<List<StudentModel>> fetchStudents() async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>('/parent/students');
      final payload = (response.data?['data'] as List<dynamic>? ?? [])
          .cast<Map<String, dynamic>>();
      await OfflineCache.cacheStudents(payload);
      return payload.map(StudentModel.fromJson).toList();
    } on DioException {
      final cached = OfflineCache.getCachedStudents();
      if (cached != null) {
        return cached.map(StudentModel.fromJson).toList();
      }
      rethrow;
    }
  }

  Future<List<MenuCategoryModel>> fetchMenu(String schoolId, String serviceDate) async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        '/parent/menu',
        query: {'school_id': schoolId, 'service_date': serviceDate},
      );
      final payload = (response.data?['data'] as List<dynamic>? ?? [])
          .cast<Map<String, dynamic>>();
      await OfflineCache.cacheMenu(payload);
      return payload.map(MenuCategoryModel.fromJson).toList();
    } on DioException {
      final cached = OfflineCache.getCachedMenu();
      if (cached != null) {
        return cached.map(MenuCategoryModel.fromJson).toList();
      }
      rethrow;
    }
  }

  Future<OrderModel> upsertOrder({
    required String studentId,
    required String serviceDate,
    required List<OrderItemModel> items,
    String? orderId,
    String? notes,
  }) async {
    final response = await _apiClient.post<Map<String, dynamic>>(
      '/parent/orders',
      headers: {'Idempotency-Key': DateTime.now().millisecondsSinceEpoch.toString()},
      data: {
        if (orderId != null) 'order_id': orderId,
        'student_id': studentId,
        'service_date': serviceDate,
        if (notes != null && notes.isNotEmpty) 'special_instructions': notes,
        'items': items
            .map((item) => {
                  'menu_item_id': item.menuItemId,
                  'quantity': item.quantity,
                  if (item.preferences.isNotEmpty) 'preferences': item.preferences,
                })
            .toList(),
      },
    );
    final order = OrderModel.fromJson(response.data!['data'] as Map<String, dynamic>);
    return order;
  }

  Future<List<OrderModel>> fetchOrders({String? month}) async {
    try {
      final response = await _apiClient.get<Map<String, dynamic>>(
        '/parent/orders',
        query: {if (month != null) 'month': month},
      );
      final payload = (response.data?['data'] as List<dynamic>? ?? [])
          .cast<Map<String, dynamic>>();
      await OfflineCache.cacheOrders(payload);
      return payload.map(OrderModel.fromJson).toList();
    } on DioException {
      final cached = OfflineCache.getCachedOrders();
      if (cached != null) {
        return cached.map(OrderModel.fromJson).toList();
      }
      rethrow;
    }
  }

  Future<void> recordPayment({
    required String orderId,
    required String method,
    String? transactionRef,
  }) async {
    await _apiClient.post('/parent/payments', data: {
      'order_id': orderId,
      'method': method,
      if (transactionRef != null) 'transaction_ref': transactionRef,
      'status': method == 'cash' ? 'pending' : 'paid',
    });
  }
}
