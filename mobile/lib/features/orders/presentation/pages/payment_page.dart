import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/features/orders/data/orders_provider.dart';
import 'package:masterok/features/orders/presentation/pages/sbp_payment_page.dart';

class PaymentPage extends ConsumerWidget {
  final int orderId;

  const PaymentPage({super.key, required this.orderId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orderAsync = ref.watch(orderDetailProvider(orderId));
    return Scaffold(
      appBar: AppBar(title: const Text('Оплата')),
      body: ListView(
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
                Text('Заказ #$orderId', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                Text(
                  'Выберите способ оплаты. СБП работает через QR-код.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          _MethodTile(
            title: 'Банковская карта',
            subtitle: 'Visa / Mastercard / МИР',
            icon: Icons.credit_card,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Оплата картой: демо-режим (подключим эквайринг позже)')),
              );
            },
          ),
          _MethodTile(
            title: 'СБП',
            subtitle: 'Оплата по QR-коду',
            icon: Icons.qr_code_2,
            onTap: () {
              final amount = orderAsync.valueOrNull?.price ?? 0;
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => SbpPaymentPage(orderId: orderId, amount: amount),
                ),
              );
            },
          ),
          _MethodTile(
            title: 'Наличными исполнителю',
            subtitle: 'После выполнения работ',
            icon: Icons.payments_outlined,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Способ оплаты выбран: наличными')),
              );
              context.pop();
            },
          ),
        ],
      ),
    );
  }
}

class _MethodTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;

  const _MethodTile({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppColors.primary),
        title: Text(title, style: Theme.of(context).textTheme.titleSmall),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}


