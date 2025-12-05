import 'package:hive_flutter/hive_flutter.dart';

class OfflineCache {
  OfflineCache._();

  static const _boxName = 'offline-cache';
  static const _studentsKey = 'students';
  static const _menuKey = 'menu';
  static const _ordersKey = 'orders';

  static Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox(_boxName);
  }

  static Box get _box => Hive.box(_boxName);

  static Future<void> cacheStudents(List<Map<String, dynamic>> students) async {
    await _box.put(_studentsKey, {
      'timestamp': DateTime.now().toIso8601String(),
      'payload': students,
    });
  }

  static List<Map<String, dynamic>>? getCachedStudents({Duration maxAge = const Duration(hours: 12)}) {
    final data = _box.get(_studentsKey) as Map<dynamic, dynamic>?;
    if (data == null) return null;
    final timestamp = DateTime.tryParse(data['timestamp'] as String? ?? '');
    if (timestamp == null || DateTime.now().difference(timestamp) > maxAge) {
      return null;
    }
    final payload = (data['payload'] as List<dynamic>? ?? [])
        .cast<Map<dynamic, dynamic>>()
        .map((item) => item.cast<String, dynamic>())
        .toList();
    return payload;
  }

  static Future<void> cacheMenu(List<Map<String, dynamic>> categories) async {
    await _box.put(_menuKey, {
      'timestamp': DateTime.now().toIso8601String(),
      'payload': categories,
    });
  }

  static List<Map<String, dynamic>>? getCachedMenu({Duration maxAge = const Duration(hours: 6)}) {
    final data = _box.get(_menuKey) as Map<dynamic, dynamic>?;
    if (data == null) return null;
    final timestamp = DateTime.tryParse(data['timestamp'] as String? ?? '');
    if (timestamp == null || DateTime.now().difference(timestamp) > maxAge) {
      return null;
    }
    final payload = (data['payload'] as List<dynamic>? ?? [])
        .cast<Map<dynamic, dynamic>>()
        .map((item) => item.cast<String, dynamic>())
        .toList();
    return payload;
  }

  static Future<void> cacheOrders(List<Map<String, dynamic>> orders) async {
    await _box.put(_ordersKey, {
      'timestamp': DateTime.now().toIso8601String(),
      'payload': orders,
    });
  }

  static List<Map<String, dynamic>>? getCachedOrders({Duration maxAge = const Duration(hours: 3)}) {
    final data = _box.get(_ordersKey) as Map<dynamic, dynamic>?;
    if (data == null) return null;
    final timestamp = DateTime.tryParse(data['timestamp'] as String? ?? '');
    if (timestamp == null || DateTime.now().difference(timestamp) > maxAge) {
      return null;
    }
    final payload = (data['payload'] as List<dynamic>? ?? [])
        .cast<Map<dynamic, dynamic>>()
        .map((item) => item.cast<String, dynamic>())
        .toList();
    return payload;
  }
}
