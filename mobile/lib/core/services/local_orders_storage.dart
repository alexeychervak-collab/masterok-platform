import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:masterok/core/models/order.dart';

class LocalOrdersStorage {
  static const _keyPrefix = 'local_orders_v1_';

  String _keyForUser(int userId) => '$_keyPrefix$userId';

  Future<List<Order>> loadForUser(int userId) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyForUser(userId));
    if (raw == null || raw.isEmpty) return [];

    try {
      final list = jsonDecode(raw) as List<dynamic>;
      return list
          .map((e) => Order.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveForUser(int userId, List<Order> orders) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = jsonEncode(orders.map((o) => o.toJson()).toList());
    await prefs.setString(_keyForUser(userId), raw);
  }

  Future<Order> addForUser(int userId, Order order) async {
    final current = await loadForUser(userId);
    final updated = [order, ...current];
    await saveForUser(userId, updated);
    return order;
  }

  Future<void> upsertForUser(int userId, Order order) async {
    final current = await loadForUser(userId);
    final idx = current.indexWhere((o) => o.id == order.id);
    if (idx == -1) {
      await saveForUser(userId, [order, ...current]);
      return;
    }
    current[idx] = order;
    await saveForUser(userId, current);
  }

  Future<void> removeForUser(int userId, int orderId) async {
    final current = await loadForUser(userId);
    current.removeWhere((o) => o.id == orderId);
    await saveForUser(userId, current);
  }
}




