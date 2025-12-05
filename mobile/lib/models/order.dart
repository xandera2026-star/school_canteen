class OrderItemModel {
  const OrderItemModel({
    required this.menuItemId,
    required this.name,
    required this.quantity,
    required this.unitPrice,
    this.preferences = const [],
  });

  final String menuItemId;
  final String name;
  final int quantity;
  final double unitPrice;
  final List<String> preferences;

  Map<String, dynamic> toJson() => {
        'menu_item_id': menuItemId,
        'name': name,
        'quantity': quantity,
        'unit_price': unitPrice,
        'preferences': preferences,
      };

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    return OrderItemModel(
      menuItemId: json['menu_item_id'] as String,
      name: json['name'] as String,
      quantity: (json['quantity'] as num).toInt(),
      unitPrice: (json['unit_price'] as num).toDouble(),
      preferences: (json['preferences'] as List<dynamic>? ?? []).cast<String>(),
    );
  }
}

class OrderModel {
  const OrderModel({
    required this.id,
    required this.studentId,
    required this.status,
    required this.paymentStatus,
    required this.serviceDate,
    required this.totalAmount,
    required this.currency,
    required this.items,
  });

  final String id;
  final String studentId;
  final String status;
  final String paymentStatus;
  final String serviceDate;
  final double totalAmount;
  final String currency;
  final List<OrderItemModel> items;

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    final itemsJson = (json['items'] as List<dynamic>? ?? [])
        .cast<Map<String, dynamic>>();
    return OrderModel(
      id: json['order_id'] as String,
      studentId: json['student_id'] as String,
      status: json['status'] as String,
      paymentStatus: json['payment_status'] as String,
      serviceDate: json['service_date'] as String,
      totalAmount: (json['total_amount'] as num).toDouble(),
      currency: json['currency'] as String? ?? 'INR',
      items: itemsJson.map(OrderItemModel.fromJson).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'order_id': id,
        'student_id': studentId,
        'status': status,
        'payment_status': paymentStatus,
        'service_date': serviceDate,
        'total_amount': totalAmount,
        'currency': currency,
        'items': items.map((item) => item.toJson()).toList(),
      };
}
