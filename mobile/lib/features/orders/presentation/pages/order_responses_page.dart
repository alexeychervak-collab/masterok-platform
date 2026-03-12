import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/core/theme/app_text_styles.dart';

class OrderResponsesPage extends StatefulWidget {
  final String orderId;

  const OrderResponsesPage({
    super.key,
    required this.orderId,
  });

  @override
  State<OrderResponsesPage> createState() => _OrderResponsesPageState();
}

class _OrderResponsesPageState extends State<OrderResponsesPage> {
  String _sortBy = 'rating';
  bool _isLoading = true;

  final List<Map<String, dynamic>> _responses = [
    {
      'id': '1',
      'specialistName': 'Алексей Петров',
      'specialistAvatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'rating': 4.9,
      'reviewsCount': 128,
      'completedOrders': 95,
      'price': 15000,
      'timeline': '3-5 дней',
      'message': 'Здравствуйте! Готов выполнить вашу работу качественно и в срок. Имею большой опыт в данной сфере. Все инструменты и расходники свои.',
      'responseDate': '2 часа назад',
      'isOnline': true,
      'badges': ['top', 'verified'],
    },
    {
      'id': '2',
      'specialistName': 'Мария Иванова',
      'specialistAvatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      'rating': 5.0,
      'reviewsCount': 89,
      'completedOrders': 67,
      'price': 18000,
      'timeline': '2-4 дня',
      'message': 'Добрый день! С удовольствием возьмусь за ваш проект. Работаю профессионально, с гарантией качества. Могу начать уже завтра.',
      'responseDate': '5 часов назад',
      'isOnline': false,
      'badges': ['fast'],
    },
    {
      'id': '3',
      'specialistName': 'Дмитрий Смирнов',
      'specialistAvatar': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'rating': 4.8,
      'reviewsCount': 203,
      'completedOrders': 156,
      'price': 12000,
      'timeline': '5-7 дней',
      'message': 'Привет! Могу начать уже завтра. Все материалы и инструменты свои. Гарантия на работу 12 месяцев.',
      'responseDate': '1 день назад',
      'isOnline': true,
      'badges': ['verified'],
    },
    {
      'id': '4',
      'specialistName': 'Елена Козлова',
      'specialistAvatar': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      'rating': 4.7,
      'reviewsCount': 56,
      'completedOrders': 42,
      'price': 14000,
      'timeline': '4-6 дней',
      'message': 'Здравствуйте! Имею опыт выполнения подобных заказов. Готова обсудить детали и приступить к работе в ближайшее время.',
      'responseDate': '1 день назад',
      'isOnline': false,
      'badges': [],
    },
  ];

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) setState(() => _isLoading = false);
    });
  }

  List<Map<String, dynamic>> get _sortedResponses {
    final sorted = List<Map<String, dynamic>>.from(_responses);
    switch (_sortBy) {
      case 'rating':
        sorted.sort((a, b) => (b['rating'] as double).compareTo(a['rating'] as double));
        break;
      case 'price':
        sorted.sort((a, b) => (a['price'] as int).compareTo(b['price'] as int));
        break;
      case 'date':
        break;
    }
    return sorted;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Отклики на заказ'),
        elevation: 0,
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.sort),
            tooltip: 'Сортировка',
            onSelected: (value) => setState(() => _sortBy = value),
            itemBuilder: (context) => [
              _buildSortItem('rating', 'По рейтингу', Icons.star_outline),
              _buildSortItem('price', 'По цене', Icons.payments_outlined),
              _buildSortItem('date', 'По дате', Icons.schedule_outlined),
            ],
          ),
        ],
      ),
      body: _isLoading ? _buildShimmerLoading() : _buildContent(),
    );
  }

  PopupMenuItem<String> _buildSortItem(String value, String label, IconData icon) {
    return PopupMenuItem(
      value: value,
      child: Row(
        children: [
          Icon(icon, size: 20, color: _sortBy == value ? AppColors.primary : AppColors.textSecondary),
          const SizedBox(width: 12),
          Text(
            label,
            style: TextStyle(
              fontWeight: _sortBy == value ? FontWeight.w600 : FontWeight.normal,
              color: _sortBy == value ? AppColors.primary : AppColors.textPrimary,
            ),
          ),
          if (_sortBy == value) ...[
            const Spacer(),
            const Icon(Icons.check, size: 18, color: AppColors.primary),
          ],
        ],
      ),
    );
  }

  Widget _buildShimmerLoading() {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          color: AppColors.surface,
          child: Row(
            children: List.generate(3, (_) => Expanded(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.neutral200,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            )),
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: 3,
            itemBuilder: (_, __) => Container(
              margin: const EdgeInsets.only(bottom: 16),
              height: 240,
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Center(
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildContent() {
    final sorted = _sortedResponses;
    return Column(
      children: [
        // Stats header
        Container(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
          decoration: BoxDecoration(
            color: AppColors.surface,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 10,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              _buildStatCard(
                '${sorted.length}',
                'Откликов',
                Icons.people_outline,
                AppColors.primary,
              ),
              const SizedBox(width: 10),
              _buildStatCard(
                '${sorted.where((r) => (r['rating'] as double) >= 4.8).length}',
                'Рейтинг 4.8+',
                Icons.star_outline,
                AppColors.warning,
              ),
              const SizedBox(width: 10),
              _buildStatCard(
                '${sorted.where((r) => r['isOnline'] == true).length}',
                'Онлайн',
                Icons.circle,
                AppColors.success,
              ),
            ],
          ),
        ),

        // Responses list
        Expanded(
          child: sorted.isEmpty
              ? _buildEmptyState()
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: sorted.length,
                  itemBuilder: (context, index) {
                    return _buildResponseCard(sorted[index]);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildStatCard(String value, String label, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.15)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 22),
            const SizedBox(height: 6),
            Text(
              value,
              style: AppTextStyles.headlineMedium.copyWith(color: color),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResponseCard(Map<String, dynamic> response) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Specialist header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Avatar with online indicator
                Stack(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundImage: NetworkImage(response['specialistAvatar']),
                      backgroundColor: AppColors.neutral200,
                    ),
                    if (response['isOnline'] == true)
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          width: 16,
                          height: 16,
                          decoration: BoxDecoration(
                            color: AppColors.success,
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.surface, width: 2.5),
                          ),
                        ),
                      ),
                  ],
                ),

                const SizedBox(width: 12),

                // Name, rating, stats
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              response['specialistName'],
                              style: AppTextStyles.titleMedium.copyWith(
                                fontWeight: FontWeight.w700,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 6),
                          ...((response['badges'] as List).map((badge) {
                            return Padding(
                              padding: const EdgeInsets.only(left: 4),
                              child: _buildBadge(badge),
                            );
                          })),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.star_rounded, color: AppColors.warning, size: 16),
                          const SizedBox(width: 3),
                          Text(
                            '${response['rating']}',
                            style: AppTextStyles.labelLarge.copyWith(fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '(${response['reviewsCount']} отзывов)',
                            style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                          ),
                          const SizedBox(width: 12),
                          Icon(Icons.check_circle_outline, color: AppColors.success, size: 14),
                          const SizedBox(width: 3),
                          Text(
                            '${response['completedOrders']} заказов',
                            style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Price and timeline row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.06),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.payments_outlined, size: 18, color: AppColors.primary),
                        const SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${response['price']} \u20BD',
                              style: AppTextStyles.priceSmall.copyWith(color: AppColors.primary),
                            ),
                            Text(
                              'Цена',
                              style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary, fontSize: 11),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
                    decoration: BoxDecoration(
                      color: AppColors.accent.withOpacity(0.06),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.schedule_outlined, size: 18, color: AppColors.accentDark),
                        const SizedBox(width: 8),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              response['timeline'],
                              style: AppTextStyles.priceSmall.copyWith(
                                color: AppColors.accentDark,
                                fontSize: 15,
                              ),
                            ),
                            Text(
                              'Срок',
                              style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary, fontSize: 11),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Message
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.neutral50,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    response['message'],
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textPrimary,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    response['responseDate'],
                    style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Action buttons
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Row(
              children: [
                // Reject
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _rejectResponse(response),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.error,
                      side: const BorderSide(color: AppColors.error),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text('Отклонить', style: TextStyle(fontWeight: FontWeight.w600)),
                  ),
                ),

                const SizedBox(width: 8),

                // Chat
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      context.push('/chat/${response['id']}?name=${Uri.encodeComponent(response['specialistName'])}');
                    },
                    icon: const Icon(Icons.chat_bubble_outline, size: 16),
                    label: const Text('Чат', style: TextStyle(fontWeight: FontWeight.w600)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      side: const BorderSide(color: AppColors.primary),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                ),

                const SizedBox(width: 8),

                // Accept
                Expanded(
                  flex: 2,
                  child: ElevatedButton.icon(
                    onPressed: () => _acceptResponse(response),
                    icon: const Icon(Icons.check, size: 18, color: Colors.white),
                    label: const Text(
                      'Принять',
                      style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadge(String type) {
    String label;
    Color color;
    IconData? icon;

    switch (type) {
      case 'top':
        label = 'TOP';
        color = AppColors.badgeTop;
        icon = Icons.emoji_events;
        break;
      case 'verified':
        label = '';
        color = AppColors.badgeVerified;
        icon = Icons.verified;
        break;
      case 'fast':
        label = '';
        color = AppColors.badgeFast;
        icon = Icons.bolt;
        break;
      default:
        return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) Icon(icon, color: color, size: 14),
          if (label.isNotEmpty) ...[
            const SizedBox(width: 2),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 10,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ],
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
                Icons.inbox_outlined,
                size: 48,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Пока нет откликов',
              style: AppTextStyles.headlineSmall.copyWith(color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            Text(
              'Специалисты скоро откликнутся\nна ваш заказ',
              style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  void _acceptResponse(Map<String, dynamic> response) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Принять отклик?'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Вы выбираете ${response['specialistName']} для выполнения заказа.'),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.neutral50,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Цена:', style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary)),
                      Text('${response['price']} \u20BD', style: AppTextStyles.priceSmall),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Срок:', style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary)),
                      Text(response['timeline'], style: AppTextStyles.titleSmall),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Отмена'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              _proceedToPayment(response);
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

  void _rejectResponse(Map<String, dynamic> response) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Отклонить отклик?'),
        content: Text('Отклонить предложение от ${response['specialistName']}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Нет'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() {
                _responses.removeWhere((r) => r['id'] == response['id']);
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Отклик от ${response['specialistName']} отклонён'),
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
            child: const Text('Отклонить', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _proceedToPayment(Map<String, dynamic> response) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Исполнитель выбран: ${response['specialistName']}'),
        backgroundColor: AppColors.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        action: SnackBarAction(
          label: 'Оплатить',
          textColor: Colors.white,
          onPressed: () {
            context.push('/orders/${widget.orderId}/payment');
          },
        ),
      ),
    );
  }
}
