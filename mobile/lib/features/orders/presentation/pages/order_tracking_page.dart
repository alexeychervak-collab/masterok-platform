import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/core/theme/app_text_styles.dart';

enum OrderStatusType {
  created,
  paid,
  inProgress,
  completed,
}

class OrderTrackingPage extends StatefulWidget {
  final String orderId;

  const OrderTrackingPage({
    super.key,
    required this.orderId,
  });

  @override
  State<OrderTrackingPage> createState() => _OrderTrackingPageState();
}

class _OrderTrackingPageState extends State<OrderTrackingPage> {
  OrderStatusType _currentStatus = OrderStatusType.inProgress;
  bool _isLoading = true;

  final Map<String, dynamic> _order = {
    'id': '12345',
    'title': 'Ремонт квартиры 50 м\u00B2',
    'category': 'Ремонт',
    'price': 15000,
    'deadline': DateTime.now().add(const Duration(days: 3)),
    'createdAt': DateTime.now().subtract(const Duration(days: 2)),
    'paidAt': DateTime.now().subtract(const Duration(days: 1, hours: 18)),
    'specialist': {
      'name': 'Алексей Петров',
      'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'rating': 4.9,
      'phone': '+7 (999) 123-45-67',
      'completedOrders': 95,
    },
    'escrow': {
      'status': 'held',
      'amount': 15000,
      'heldAt': DateTime.now().subtract(const Duration(hours: 12)),
      'autoReleaseDate': DateTime.now().add(const Duration(days: 5)),
    },
  };

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 600), () {
      if (mounted) setState(() => _isLoading = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text('Заказ #${_order['id']}'),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: _showOrderMenu,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildOrderHeader(),
                  const SizedBox(height: 8),
                  _buildStatusTimeline(),
                  const SizedBox(height: 8),
                  _buildSpecialistCard(),
                  const SizedBox(height: 8),
                  _buildEscrowCard(),
                  const SizedBox(height: 8),
                  _buildOrderDetails(),
                  const SizedBox(height: 8),
                  _buildActionButtons(),
                  const SizedBox(height: 32),
                ],
              ),
            ),
    );
  }

  Widget _buildOrderHeader() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF2563EB), Color(0xFF06B6D4)],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              _order['category'],
              style: AppTextStyles.labelMedium.copyWith(color: Colors.white),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            _order['title'],
            style: AppTextStyles.headlineMedium.copyWith(color: Colors.white),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.payments, size: 18, color: Colors.white),
                    const SizedBox(width: 6),
                    Text(
                      '${_order['price']} \u20BD',
                      style: AppTextStyles.priceMedium.copyWith(color: Colors.white),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.schedule, size: 18, color: Colors.white),
                    const SizedBox(width: 6),
                    Text(
                      'До ${_formatDate(_order['deadline'])}',
                      style: AppTextStyles.labelLarge.copyWith(color: Colors.white),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusTimeline() {
    final statuses = [
      {
        'type': OrderStatusType.created,
        'title': 'Создан',
        'subtitle': _formatDateTime(_order['createdAt']),
        'icon': Icons.description_outlined,
      },
      {
        'type': OrderStatusType.paid,
        'title': 'Оплачен',
        'subtitle': _formatDateTime(_order['paidAt']),
        'icon': Icons.payment_outlined,
      },
      {
        'type': OrderStatusType.inProgress,
        'title': 'В работе',
        'subtitle': 'Исполнитель работает',
        'icon': Icons.construction_outlined,
      },
      {
        'type': OrderStatusType.completed,
        'title': 'Завершён',
        'subtitle': 'Работа выполнена',
        'icon': Icons.check_circle_outline,
      },
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Статус заказа',
            style: AppTextStyles.headlineSmall,
          ),
          const SizedBox(height: 20),
          ...statuses.asMap().entries.map((entry) {
            final index = entry.key;
            final status = entry.value;
            final statusType = status['type'] as OrderStatusType;
            final currentIndex = _currentStatus.index;
            final isCompleted = statusType.index < currentIndex;
            final isCurrent = statusType == _currentStatus;
            final isPending = statusType.index > currentIndex;
            final isLast = index == statuses.length - 1;

            return _buildTimelineItem(
              status['title'] as String,
              status['subtitle'] as String,
              status['icon'] as IconData,
              isCompleted: isCompleted,
              isCurrent: isCurrent,
              isPending: isPending,
              isLast: isLast,
            );
          }),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(
    String title,
    String subtitle,
    IconData icon, {
    required bool isCompleted,
    required bool isCurrent,
    required bool isPending,
    required bool isLast,
  }) {
    final Color dotColor;
    final Color lineColor;

    if (isCompleted) {
      dotColor = AppColors.success;
      lineColor = AppColors.success;
    } else if (isCurrent) {
      dotColor = AppColors.primary;
      lineColor = AppColors.neutral300;
    } else {
      dotColor = AppColors.neutral300;
      lineColor = AppColors.neutral300;
    }

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: isPending ? AppColors.neutral100 : dotColor,
                  shape: BoxShape.circle,
                  border: isCurrent
                      ? Border.all(color: AppColors.primary.withOpacity(0.3), width: 3)
                      : null,
                  boxShadow: isCurrent
                      ? [
                          BoxShadow(
                            color: AppColors.primary.withOpacity(0.3),
                            blurRadius: 12,
                            spreadRadius: 2,
                          ),
                        ]
                      : null,
                ),
                child: Icon(
                  isCompleted ? Icons.check : icon,
                  color: isPending ? AppColors.neutral500 : Colors.white,
                  size: 20,
                ),
              ),
              if (!isLast)
                Container(
                  width: 2,
                  height: 32,
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  color: isCompleted ? AppColors.success : lineColor,
                ),
            ],
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 8),
                  Text(
                    title,
                    style: AppTextStyles.titleSmall.copyWith(
                      fontWeight: isCurrent ? FontWeight.w800 : FontWeight.w600,
                      color: isPending ? AppColors.textSecondary : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                  ),
                  if (isCurrent) ...[
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'Текущий этап',
                        style: AppTextStyles.badge.copyWith(color: AppColors.primary),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecialistCard() {
    final specialist = _order['specialist'] as Map<String, dynamic>;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Исполнитель', style: AppTextStyles.headlineSmall),
          const SizedBox(height: 14),
          Row(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundImage: NetworkImage(specialist['avatar']),
                backgroundColor: AppColors.neutral200,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      specialist['name'],
                      style: AppTextStyles.titleMedium.copyWith(fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.star_rounded, color: AppColors.warning, size: 16),
                        const SizedBox(width: 3),
                        Text(
                          '${specialist['rating']}',
                          style: AppTextStyles.labelLarge.copyWith(fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(width: 10),
                        Icon(Icons.check_circle_outline, color: AppColors.success, size: 14),
                        const SizedBox(width: 3),
                        Text(
                          '${specialist['completedOrders']} заказов',
                          style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Chat button
              Container(
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: IconButton(
                  onPressed: () {
                    context.push('/chat/1?name=${Uri.encodeComponent(specialist['name'])}');
                  },
                  icon: const Icon(Icons.chat_bubble, color: Colors.white, size: 20),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEscrowCard() {
    final escrow = _order['escrow'] as Map<String, dynamic>;
    final isHeld = escrow['status'] == 'held';

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border(
              left: BorderSide(
                color: isHeld ? AppColors.success : AppColors.primary,
                width: 4,
              ),
            ),
          ),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text('Эскроу-счёт', style: AppTextStyles.headlineSmall),
                  const SizedBox(width: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: isHeld ? AppColors.success.withOpacity(0.1) : AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      isHeld ? 'Деньги заморожены' : 'Деньги переведены',
                      style: AppTextStyles.badge.copyWith(
                        color: isHeld ? AppColors.success : AppColors.primary,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      (isHeld ? AppColors.success : AppColors.primary).withOpacity(0.06),
                      (isHeld ? AppColors.success : AppColors.primary).withOpacity(0.02),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: (isHeld ? AppColors.success : AppColors.primary).withOpacity(0.15),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isHeld ? AppColors.success : AppColors.primary,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isHeld ? Icons.lock_outline : Icons.lock_open,
                        color: Colors.white,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${escrow['amount']} \u20BD',
                            style: AppTextStyles.priceMedium.copyWith(
                              color: isHeld ? AppColors.success : AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            isHeld
                                ? 'Деньги заморожены на эскроу'
                                : 'Деньги переведены исполнителю',
                            style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.info_outline, size: 15, color: AppColors.textSecondary),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Средства будут переведены исполнителю после подтверждения выполнения',
                      style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.schedule_outlined, size: 15, color: AppColors.warning),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Автоматическое высвобождение: ${_formatDate(escrow['autoReleaseDate'])}',
                      style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOrderDetails() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Детали заказа', style: AppTextStyles.headlineSmall),
          const SizedBox(height: 14),
          _buildDetailRow('ID заказа', '#${_order['id']}'),
          _buildDetailRow('Категория', _order['category']),
          _buildDetailRow('Создан', _formatDateTime(_order['createdAt'])),
          _buildDetailRow('Срок выполнения', _formatDate(_order['deadline'])),
          _buildDetailRow('Стоимость', '${_order['price']} \u20BD'),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
            ),
          ),
          Text(
            value,
            style: AppTextStyles.titleSmall.copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          // Main action button based on status
          if (_currentStatus == OrderStatusType.inProgress)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _confirmCompletion,
                icon: const Icon(Icons.check_circle, color: Colors.white),
                label: const Text(
                  'Подтвердить выполнение',
                  style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 16),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.success,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),

          if (_currentStatus == OrderStatusType.completed)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Форма отзыва')),
                  );
                },
                icon: const Icon(Icons.star_outline, color: Colors.white),
                label: const Text(
                  'Оставить отзыв',
                  style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 16),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),

          const SizedBox(height: 10),

          // Write to specialist button (always visible)
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {
                final specialist = _order['specialist'] as Map<String, dynamic>;
                context.push('/chat/1?name=${Uri.encodeComponent(specialist['name'])}');
              },
              icon: const Icon(Icons.chat_bubble_outline),
              label: const Text(
                'Написать исполнителю',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
              ),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primary,
                side: const BorderSide(color: AppColors.primary),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),

          const SizedBox(height: 10),

          // Dispute button
          TextButton.icon(
            onPressed: _openDispute,
            icon: const Icon(Icons.report_problem_outlined, size: 18),
            label: const Text('Открыть спор'),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.warning,
            ),
          ),
        ],
      ),
    );
  }

  void _showOrderMenu() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 8),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.neutral300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.share_outlined),
              title: const Text('Поделиться'),
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Поделиться заказом')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.report_problem_outlined, color: AppColors.warning),
              title: const Text('Открыть спор'),
              onTap: () {
                Navigator.pop(ctx);
                _openDispute();
              },
            ),
            ListTile(
              leading: const Icon(Icons.cancel_outlined, color: AppColors.error),
              title: Text('Отменить заказ', style: TextStyle(color: AppColors.error)),
              onTap: () {
                Navigator.pop(ctx);
                _cancelOrder();
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _confirmCompletion() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Подтвердить выполнение?'),
        content: const Text(
          'Вы уверены, что работа выполнена качественно?\n\nПосле подтверждения деньги будут переведены исполнителю.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Отмена'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() => _currentStatus = OrderStatusType.completed);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('Заказ завершён! Деньги переведены исполнителю.'),
                  backgroundColor: AppColors.success,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.success,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Подтвердить', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _openDispute() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Открытие спора (в разработке)'),
        backgroundColor: AppColors.warning,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  void _cancelOrder() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Отменить заказ?'),
        content: const Text(
          'Вы уверены, что хотите отменить заказ?\n\nДеньги будут возвращены на вашу карту.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Нет'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('Заказ отменён. Деньги возвращаются.'),
                  backgroundColor: AppColors.error,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Отменить заказ', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
    ];
    return '${date.day} ${months[date.month - 1]}';
  }

  String _formatDateTime(DateTime date) {
    final months = [
      'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
      'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
    ];
    return '${date.day} ${months[date.month - 1]}, ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}
