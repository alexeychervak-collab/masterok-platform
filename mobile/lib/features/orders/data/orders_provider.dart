import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:masterok/core/models/order.dart';
import 'package:masterok/core/services/orders_service.dart';
import 'package:masterok/core/services/local_orders_storage.dart';
import 'package:masterok/core/data/mock_data.dart';
import 'package:masterok/features/auth/data/auth_provider.dart';

final localOrdersStorageProvider = Provider<LocalOrdersStorage>((ref) {
  return LocalOrdersStorage();
});

final localOrdersProvider = FutureProvider.autoDispose<List<Order>>((ref) async {
  final storage = ref.read(localOrdersStorageProvider);
  final user = ref.watch(currentUserProvider).valueOrNull;
  final userId = user?.id ?? 0;
  return storage.loadForUser(userId);
});

// My orders list
final myOrdersProvider = FutureProvider.autoDispose<List<Order>>((ref) async {
  final service = ref.read(ordersServiceProvider);
  final local = await ref.watch(localOrdersProvider.future);
  try {
    final remote = await service.getMyOrders();
    final merged = [...local, ...remote];
    merged.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return merged;
  } catch (_) {
    final userAsync = ref.read(currentUserProvider);
    final user = userAsync.valueOrNull;
    final demoEmails = {'user@test.ru', 'pro@test.ru'};
    final sample = (user != null && demoEmails.contains(user.email.toLowerCase()))
        ? MockData.getSampleOrders(user.id, user.role)
        : <Order>[];
    final merged = [...local, ...sample];
    merged.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return merged;
  }
});

// Filtered orders
final filteredOrdersProvider = FutureProvider.autoDispose.family<List<Order>, String?>((ref, status) async {
  final service = ref.read(ordersServiceProvider);
  final local = await ref.watch(localOrdersProvider.future);
  try {
    final remote = await service.getMyOrders(status: status);
    final merged = [...local, ...remote];
    merged.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return merged;
  } catch (_) {
    final userAsync = ref.read(currentUserProvider);
    final user = userAsync.valueOrNull;
    final demoEmails = {'user@test.ru', 'pro@test.ru'};
    var sample = (user != null && demoEmails.contains(user.email.toLowerCase()))
        ? MockData.getSampleOrders(user.id, user.role)
        : <Order>[];
    if (status != null && status.isNotEmpty) {
      sample = sample.where((o) => o.status.name == status).toList();
    }
    final merged = [...local, ...sample];
    merged.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return merged;
  }
});

// Order detail
final orderDetailProvider = FutureProvider.autoDispose.family<Order, int>((ref, id) async {
  final service = ref.read(ordersServiceProvider);
  final local = await ref.watch(localOrdersProvider.future);
  try {
    return await service.getOrderById(id);
  } catch (_) {
    final fromLocal = local.where((o) => o.id == id).toList();
    if (fromLocal.isNotEmpty) return fromLocal.first;
    final userAsync = ref.read(currentUserProvider);
    final user = userAsync.valueOrNull;
    final demoEmails = {'user@test.ru', 'pro@test.ru'};
    final sample = (user != null && demoEmails.contains(user.email.toLowerCase()))
        ? MockData.getSampleOrders(user.id, user.role)
        : <Order>[];
    return sample.firstWhere((o) => o.id == id);
  }
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
      _ref.invalidate(localOrdersProvider);
      return order;
    } catch (e, stack) {
      // Fallback: сохраняем заказ локально, чтобы функционал работал даже без backend
      try {
        final userAsync = _ref.read(currentUserProvider);
        final user = userAsync.valueOrNull;
        final userId = user?.id ?? 0;
        final storage = _ref.read(localOrdersStorageProvider);
        final existing = await storage.loadForUser(userId);
        final maxId = existing.isEmpty ? 1000 : existing.map((o) => o.id).reduce((a, b) => a > b ? a : b);

        final categoryName = switch (categoryId) {
          1 => 'Ремонт',
          2 => 'Электрика',
          3 => 'Сантехника',
          4 => 'Отделка',
          5 => 'Уборка',
          6 => 'Мебель',
          7 => 'Окна и двери',
          8 => 'Кондиционеры',
          _ => 'Другое',
        };

        final localOrder = Order(
          id: maxId + 1,
          title: title,
          description: description,
          status: OrderStatus.pending,
          price: price,
          createdAt: DateTime.now(),
          deadline: deadline,
          specialist: null,
          categoryName: categoryName,
          clientId: user?.id ?? 1,
        );

        await storage.addForUser(userId, localOrder);
        state = const AsyncValue.data(null);
        _ref.invalidate(myOrdersProvider);
        _ref.invalidate(localOrdersProvider);
        return localOrder;
      } catch (_) {
        state = AsyncValue.error(e, stack);
        rethrow;
      }
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
      _ref.invalidate(localOrdersProvider);
    } catch (e, stack) {
      // Fallback: локальное обновление статуса
      try {
        final storage = _ref.read(localOrdersStorageProvider);
        final user = _ref.read(currentUserProvider).valueOrNull;
        final userId = user?.id ?? 0;
        final current = await storage.loadForUser(userId);
        final idx = current.indexWhere((o) => o.id == orderId);
        if (idx != -1) {
          final order = current[idx];
          final newStatus = switch (status) {
            'accepted' => OrderStatus.accepted,
            'in_progress' => OrderStatus.inProgress,
            'completed' => OrderStatus.completed,
            'cancelled' => OrderStatus.cancelled,
            'disputed' => OrderStatus.disputed,
            _ => OrderStatus.pending,
          };
          await storage.upsertForUser(
            userId,
            Order(
              id: order.id,
              title: order.title,
              description: order.description,
              status: newStatus,
              price: order.price,
              createdAt: order.createdAt,
              deadline: order.deadline,
              specialist: order.specialist,
              categoryName: order.categoryName,
              clientId: order.clientId,
            ),
          );
        }
        state = const AsyncValue.data(null);
        _ref.invalidate(myOrdersProvider);
        _ref.invalidate(orderDetailProvider(orderId));
        _ref.invalidate(localOrdersProvider);
      } catch (_) {
        state = AsyncValue.error(e, stack);
        rethrow;
      }
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
      _ref.invalidate(localOrdersProvider);
    } catch (e, stack) {
      // Fallback: удаляем локально
      try {
        final storage = _ref.read(localOrdersStorageProvider);
        final user = _ref.read(currentUserProvider).valueOrNull;
        final userId = user?.id ?? 0;
        await storage.removeForUser(userId, orderId);
        state = const AsyncValue.data(null);
        _ref.invalidate(myOrdersProvider);
        _ref.invalidate(localOrdersProvider);
      } catch (_) {
        state = AsyncValue.error(e, stack);
        rethrow;
      }
    }
  }
}




