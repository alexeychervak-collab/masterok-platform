import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/features/orders/data/orders_provider.dart';

class SbpPaymentPage extends ConsumerWidget {
  final int orderId;
  final double amount;

  const SbpPaymentPage({
    super.key,
    required this.orderId,
    required this.amount,
  });

  String _buildPayLink() {
    // Рабочий “плейсхолдер” для СБП: QR открывает ссылку оплаты.
    // Реальную интеграцию (банк/эквайринг) можно подключить позже.
    final rub = amount.toStringAsFixed(0);
    return 'https://pay.masterok.ru/sbp?order=$orderId&amount=$rub';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final link = _buildPayLink();
    final mutation = ref.watch(ordersNotifierProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('СБП')),
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
                const SizedBox(height: 6),
                Text(
                  'Сумма: ${amount.toStringAsFixed(0)} ₽',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Откройте банковское приложение и отсканируйте QR-код.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Center(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: QrImageView(
                data: link,
                version: QrVersions.auto,
                size: 240,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () async {
                    await Clipboard.setData(ClipboardData(text: link));
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Ссылка СБП скопирована')),
                    );
                  },
                  child: const Text('Скопировать ссылку'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: mutation.isLoading
                      ? null
                      : () async {
                          try {
                            await ref
                                .read(ordersNotifierProvider.notifier)
                                .updateOrderStatus(orderId, 'accepted');
                            if (!context.mounted) return;
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Оплата подтверждена')),
                            );
                            Navigator.of(context).pop();
                          } catch (e) {
                            if (!context.mounted) return;
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(e.toString())),
                            );
                          }
                        },
                  child: mutation.isLoading
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Я оплатил'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            'Если банк не открылся по QR — используйте “Скопировать ссылку” и вставьте её в банковское приложение/браузер.',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}


