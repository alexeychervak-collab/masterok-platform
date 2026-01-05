import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yodo/core/models/order.dart';
import 'package:yodo/core/services/orders_service.dart';

// My orders list
final myOrdersProvider = FutureProvider.autoDispose<List<Order>>((ref) async {
  final service = ref.read(ordersServiceProvider);
  return service.getMyOrders();
});

// Filtered orders
final filteredOrdersProvider = FutureProvider.autoDispose.family<List<Order>, String?>((ref, status) async {
  final service = ref.read(ordersServiceProvider);
  return service.getMyOrders(status: status);
});

// Order detail
final orderDetailProvider = FutureProvider.autoDispose.family<Order, int>((ref, id) async {
  final service = ref.read(ordersServiceProvider);
  return service.getOrderById(id);
});

// Orders notifier for mutations
final ordersNotifierProvider = StateNotifierProvider<OrdersNotifier, AsyncValue<void>>((ref) {
  return OrdersNotifier(ref);
});

class OrdersNotifier extends StateNotifier<AsyncValue<void>> {
  final Ref _ref;

  OrdersNotifier(this._ref) : super(const AsyncValue.data(null));

  Future<Order> createOrder({
    required String title,
    required String description,
    required double price,
    required int categoryId,
    DateTime? deadline,
  }) async {
    state = const AsyncValue.loading();
    try {
      final service = _ref.read(ordersServiceProvider);
      final order = await service.createOrder(
        title: title,
        description: description,
        price: price,
        categoryId: categoryId,
        deadline: deadline,
      );
      state = const AsyncValue.data(null);
      // Invalidate orders list to refresh
      _ref.invalidate(myOrdersProvider);
      return order;
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  Future<void> updateOrderStatus(int orderId, String status) async {
    state = const AsyncValue.loading();
    try {
      final service = _ref.read(ordersServiceProvider);
      await service.updateOrderStatus(orderId, status);
      state = const AsyncValue.data(null);
      // Invalidate to refresh
      _ref.invalidate(myOrdersProvider);
      _ref.invalidate(orderDetailProvider(orderId));
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  Future<void> cancelOrder(int orderId) async {
    state = const AsyncValue.loading();
    try {
      final service = _ref.read(ordersServiceProvider);
      await service.cancelOrder(orderId);
      state = const AsyncValue.data(null);
      // Invalidate to refresh
      _ref.invalidate(myOrdersProvider);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }
}

