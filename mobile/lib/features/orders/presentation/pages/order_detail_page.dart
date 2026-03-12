import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/core/models/order.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/features/orders/data/orders_provider.dart';

class OrderDetailPage extends ConsumerWidget {
  final int orderId;

  const OrderDetailPage({super.key, required this.orderId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orderAsync = ref.watch(orderDetailProvider(orderId));
    final mutation = ref.watch(ordersNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Заказ'),
        actions: [
          IconButton(
            tooltip: 'Отклики',
            onPressed: () => context.push('/orders/$orderId/responses'),
            icon: const Icon(Icons.forum_outlined),
          ),
          IconButton(
            tooltip: 'Трекинг',
            onPressed: () => context.push('/orders/$orderId/track'),
            icon: const Icon(Icons.track_changes_outlined),
          ),
        ],
      ),
      body: orderAsync.when(
        data: (order) => _Body(order: order, isLoading: mutation.isLoading),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => _ErrorState(
          message: e.toString(),
          onRetry: () => ref.invalidate(orderDetailProvider(orderId)),
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 16),
          child: orderAsync.when(
            data: (order) => Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: mutation.isLoading
                        ? null
                        : () async {
                            try {
                              await ref.read(ordersNotifierProvider.notifier).cancelOrder(order.id);
                              if (context.mounted) context.pop();
                            } catch (e) {
                              if (!context.mounted) return;
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text(e.toString())),
                              );
                            }
                          },
                    child: const Text('Отменить'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => context.push('/orders/$orderId/track'),
                    child: const Text('Отследить'),
                  ),
                ),
              ],
            ),
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
          ),
        ),
      ),
    );
  }
}

class _Body extends StatelessWidget {
  final Order order;
  final bool isLoading;

  const _Body({required this.order, required this.isLoading});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(order.title, style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              Text(order.description, style: Theme.of(context).textTheme.bodyMedium),
              const SizedBox(height: 12),
              Row(
                children: [
                  _Chip(label: order.categoryName),
                  const SizedBox(width: 8),
                  _Chip(label: order.status.displayName),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                '${order.price.toStringAsFixed(0)} ₽',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w800,
                    ),
              ),
              if (order.deadline != null) ...[
                const SizedBox(height: 8),
                Text(
                  'Срок: ${order.deadline}',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Действия', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.forum_outlined),
                title: const Text('Отклики исполнителей'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => context.push('/orders/${order.id}/responses'),
              ),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.payment_outlined),
                title: const Text('Оплата'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => context.push('/orders/${order.id}/payment'),
              ),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.track_changes_outlined),
                title: const Text('Трекинг заказа'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => context.push('/orders/${order.id}/track'),
              ),
            ],
          ),
        ),
        if (isLoading) ...[
          const SizedBox(height: 12),
          const Center(child: CircularProgressIndicator()),
        ],
      ],
    );
  }
}

class _Chip extends StatelessWidget {
  final String label;

  const _Chip({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: AppColors.primary.withOpacity(0.15)),
      ),
      child: Text(
        label,
        style: Theme.of(context).textTheme.labelMedium?.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.w700,
            ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const _ErrorState({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 40, color: AppColors.error),
            const SizedBox(height: 12),
            Text('Не удалось загрузить заказ', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 6),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 12),
            ElevatedButton(onPressed: onRetry, child: const Text('Повторить')),
          ],
        ),
      ),
    );
  }
}


