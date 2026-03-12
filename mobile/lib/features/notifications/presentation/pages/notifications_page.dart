import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/core/theme/app_text_styles.dart';

enum _NotificationType {
  newBid,
  orderUpdate,
  payment,
  message,
  system,
}

class _NotificationItem {
  final int id;
  final _NotificationType type;
  final String title;
  final String description;
  final String time;
  final String group; // 'today', 'yesterday', 'earlier'
  final bool isRead;
  final String? routeTo;

  const _NotificationItem({
    required this.id,
    required this.type,
    required this.title,
    required this.description,
    required this.time,
    required this.group,
    this.isRead = false,
    this.routeTo,
  });

  _NotificationItem copyWith({bool? isRead}) => _NotificationItem(
        id: id,
        type: type,
        title: title,
        description: description,
        time: time,
        group: group,
        isRead: isRead ?? this.isRead,
        routeTo: routeTo,
      );
}

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  bool _isLoading = true;

  List<_NotificationItem> _notifications = [
    // Today
    const _NotificationItem(
      id: 1,
      type: _NotificationType.newBid,
      title: 'Новый отклик на заказ',
      description: 'Мастер Алексей Петров откликнулся на ваш заказ "Замена розеток в квартире". Рейтинг 4.9, 95 выполненных заказов.',
      time: '5 мин назад',
      group: 'today',
      isRead: false,
      routeTo: '/orders/1/responses',
    ),
    const _NotificationItem(
      id: 2,
      type: _NotificationType.message,
      title: 'Новое сообщение',
      description: 'Дмитрий Смирнов: "Материалы закуплены, начинаю работу завтра утром"',
      time: '30 мин назад',
      group: 'today',
      isRead: false,
      routeTo: '/chat/3',
    ),
    const _NotificationItem(
      id: 3,
      type: _NotificationType.payment,
      title: 'Оплата получена',
      description: 'Средства в размере 15 000 \u20BD успешно заблокированы на эскроу-счёте по заказу #12345.',
      time: '1 час назад',
      group: 'today',
      isRead: false,
    ),

    // Yesterday
    const _NotificationItem(
      id: 4,
      type: _NotificationType.orderUpdate,
      title: 'Заказ принят в работу',
      description: 'Исполнитель приступил к работе по заказу "Сборка кухонного гарнитура". Ожидаемый срок: 2 дня.',
      time: 'Вчера, 18:30',
      group: 'yesterday',
      isRead: true,
      routeTo: '/orders/2/track',
    ),
    const _NotificationItem(
      id: 5,
      type: _NotificationType.newBid,
      title: 'Новый отклик',
      description: 'Мария Иванова предложила выполнить ваш заказ за 18 000 \u20BD (срок 2-4 дня).',
      time: 'Вчера, 14:15',
      group: 'yesterday',
      isRead: true,
      routeTo: '/orders/1/responses',
    ),
    const _NotificationItem(
      id: 6,
      type: _NotificationType.system,
      title: 'Скидка 20% активна',
      description: 'Используйте промокод MASTEROK20 на первый заказ. Действует до конца месяца!',
      time: 'Вчера, 10:00',
      group: 'yesterday',
      isRead: true,
      routeTo: '/promo',
    ),

    // Earlier
    const _NotificationItem(
      id: 7,
      type: _NotificationType.orderUpdate,
      title: 'Заказ завершён',
      description: 'Заказ "Генеральная уборка после ремонта" успешно завершён. Не забудьте оставить отзыв!',
      time: '3 дня назад',
      group: 'earlier',
      isRead: true,
    ),
    const _NotificationItem(
      id: 8,
      type: _NotificationType.payment,
      title: 'Средства переведены',
      description: 'Деньги в размере 5 500 \u20BD переведены исполнителю за заказ "Генеральная уборка".',
      time: '3 дня назад',
      group: 'earlier',
      isRead: true,
    ),
    const _NotificationItem(
      id: 9,
      type: _NotificationType.system,
      title: 'Обновление профиля',
      description: 'Добавьте фото и описание -- так вас быстрее находят клиенты и мастера.',
      time: '5 дней назад',
      group: 'earlier',
      isRead: true,
      routeTo: '/profile',
    ),
  ];

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) setState(() => _isLoading = false);
    });
  }

  int get _unreadCount => _notifications.where((n) => !n.isRead).length;

  void _markAllAsRead() {
    setState(() {
      _notifications = _notifications.map((n) => n.copyWith(isRead: true)).toList();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Все уведомления прочитаны'),
        backgroundColor: AppColors.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  IconData _iconForType(_NotificationType type) {
    switch (type) {
      case _NotificationType.newBid:
        return Icons.person_add_outlined;
      case _NotificationType.orderUpdate:
        return Icons.update_outlined;
      case _NotificationType.payment:
        return Icons.payment_outlined;
      case _NotificationType.message:
        return Icons.chat_bubble_outline;
      case _NotificationType.system:
        return Icons.campaign_outlined;
    }
  }

  Color _colorForType(_NotificationType type) {
    switch (type) {
      case _NotificationType.newBid:
        return AppColors.primary;
      case _NotificationType.orderUpdate:
        return AppColors.accent;
      case _NotificationType.payment:
        return AppColors.success;
      case _NotificationType.message:
        return AppColors.info;
      case _NotificationType.system:
        return AppColors.warning;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Уведомления'),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
        actions: [
          if (_unreadCount > 0)
            TextButton.icon(
              onPressed: _markAllAsRead,
              icon: const Icon(Icons.done_all, size: 18),
              label: const Text('Прочитать все'),
              style: TextButton.styleFrom(foregroundColor: AppColors.primary),
            ),
        ],
      ),
      body: _isLoading
          ? _buildShimmerLoading()
          : _notifications.isEmpty
              ? _buildEmptyState()
              : _buildNotificationsList(),
    );
  }

  Widget _buildShimmerLoading() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5,
      itemBuilder: (_, __) => Container(
        margin: const EdgeInsets.only(bottom: 10),
        height: 80,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.08),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.notifications_off_outlined,
                size: 48,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Нет новых уведомлений',
              style: AppTextStyles.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Здесь будут появляться уведомления\nо заказах, сообщениях и акциях',
              style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationsList() {
    final groups = <String, List<_NotificationItem>>{};
    for (final n in _notifications) {
      groups.putIfAbsent(n.group, () => []).add(n);
    }

    final groupLabels = {
      'today': 'Сегодня',
      'yesterday': 'Вчера',
      'earlier': 'Ранее',
    };

    final orderedGroups = ['today', 'yesterday', 'earlier']
        .where((g) => groups.containsKey(g))
        .toList();

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      itemCount: orderedGroups.fold<int>(
        0,
        (sum, group) => sum + 1 + groups[group]!.length,
      ),
      itemBuilder: (context, index) {
        int currentIndex = 0;
        for (final group in orderedGroups) {
          // Group header
          if (index == currentIndex) {
            return Padding(
              padding: EdgeInsets.only(
                top: currentIndex == 0 ? 0 : 16,
                bottom: 8,
                left: 4,
              ),
              child: Text(
                groupLabels[group]!,
                style: AppTextStyles.titleSmall.copyWith(
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w700,
                ),
              ),
            );
          }
          currentIndex++;

          // Items in this group
          final items = groups[group]!;
          if (index < currentIndex + items.length) {
            final item = items[index - currentIndex];
            return _buildNotificationCard(item);
          }
          currentIndex += items.length;
        }
        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildNotificationCard(_NotificationItem notification) {
    final color = _colorForType(notification.type);
    final icon = _iconForType(notification.type);

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: () {
            // Mark as read
            if (!notification.isRead) {
              setState(() {
                final index = _notifications.indexWhere((n) => n.id == notification.id);
                if (index >= 0) {
                  _notifications[index] = notification.copyWith(isRead: true);
                }
              });
            }
            // Navigate if route exists
            if (notification.routeTo != null) {
              context.push(notification.routeTo!);
            }
          },
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: notification.isRead ? AppColors.surface : AppColors.primary.withOpacity(0.04),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: notification.isRead ? AppColors.border : AppColors.primary.withOpacity(0.15),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.03),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Icon
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 22),
                ),

                const SizedBox(width: 12),

                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              notification.title,
                              style: AppTextStyles.titleSmall.copyWith(
                                fontWeight: notification.isRead ? FontWeight.w600 : FontWeight.w700,
                                color: notification.isRead
                                    ? AppColors.textSecondary
                                    : AppColors.textPrimary,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            notification.time,
                            style: AppTextStyles.caption.copyWith(
                              color: AppColors.textSecondary,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        notification.description,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (!notification.isRead) ...[
                        const SizedBox(height: 6),
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
