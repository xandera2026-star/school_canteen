import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../models/menu.dart';
import '../models/order.dart';
import '../models/student.dart';
import '../services/parent_repository.dart';

class DashboardController extends ChangeNotifier {
  DashboardController(this._repository);

  final ParentRepository _repository;

  List<StudentModel> _students = [];
  List<MenuCategoryModel> _menu = [];
  List<OrderModel> _orders = [];
  bool _isLoading = false;
  String? _activeStudentId;
  DateTime _selectedDate = DateTime.now();

  List<StudentModel> get students => _students;
  List<MenuCategoryModel> get menu => _menu;
  List<OrderModel> get orders => _orders;
  bool get isLoading => _isLoading;
  String? get activeStudentId => _activeStudentId;
  String get serviceDate => DateFormat('yyyy-MM-dd').format(_selectedDate);

  void selectStudent(String studentId) {
    _activeStudentId = studentId;
    notifyListeners();
  }

  void setServiceDate(DateTime date) {
    _selectedDate = date;
    notifyListeners();
  }

  Future<void> refreshMenu(String schoolId) async {
    _menu = await _repository.fetchMenu(schoolId, serviceDate);
    notifyListeners();
  }

  Future<void> loadAll({required String schoolId}) async {
    _isLoading = true;
    notifyListeners();
    try {
      _students = await _repository.fetchStudents();
      if (_students.isNotEmpty && _activeStudentId == null) {
        _activeStudentId = _students.first.id;
      }
      _menu = await _repository.fetchMenu(schoolId, serviceDate);
      _orders = await _repository.fetchOrders();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<OrderModel> placeOrder({
    required String studentId,
    required List<OrderItemModel> items,
    String? notes,
  }) async {
    final order = await _repository.upsertOrder(
      studentId: studentId,
      serviceDate: serviceDate,
      items: items,
      notes: notes,
    );
    await refreshOrders();
    return order;
  }

  Future<void> refreshOrders() async {
    _orders = await _repository.fetchOrders();
    notifyListeners();
  }

  Future<void> recordPayment({required String orderId, required bool useGpay}) async {
    await _repository.recordPayment(
      orderId: orderId,
      method: useGpay ? 'gpay_upi' : 'cash',
      transactionRef: useGpay ? 'UPI-${DateTime.now().millisecondsSinceEpoch}' : null,
    );
    await refreshOrders();
  }
}
