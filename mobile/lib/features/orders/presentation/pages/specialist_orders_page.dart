import 'package:flutter/material.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/core/theme/app_text_styles.dart';

class _AvailableOrder {
  final int id;
  final String title;
  final String description;
  final int budget;
  final String deadline;
  final String category;
  final String categoryIcon;
  final String clientName;
  final String clientAvatar;
  final String createdAgo;

  const _AvailableOrder({
    required this.id,
    required this.title,
    required this.description,
    required this.budget,
    required this.deadline,
    required this.category,
    required this.categoryIcon,
    required this.clientName,
    required this.clientAvatar,
    required this.createdAgo,
  });
}

class SpecialistOrdersPage extends StatefulWidget {
  const SpecialistOrdersPage({super.key});

  @override
  State<SpecialistOrdersPage> createState() => _SpecialistOrdersPageState();
}

class _SpecialistOrdersPageState extends State<SpecialistOrdersPage> {
  String _selectedFilter = 'all';
  bool _isLoading = true;

  final List<_AvailableOrder> _orders = const [
    _AvailableOrder(
      id: 1,
      title: 'Замена розеток в квартире',
      description: 'Необходимо заменить 8 розеток и 4 выключателя в трёхкомнатной квартире. Проводка новая, штробить не нужно. Материалы заказчика.',
      budget: 3500,
      deadline: '3 дня',
      category: 'Электрика',
      categoryIcon: 'flash_on',
      clientName: 'Андрей М.',
      clientAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd9c?w=100&h=100&fit=crop&crop=face',
      createdAgo: '15 мин назад',
    ),
    _AvailableOrder(
      id: 2,
      title: 'Сборка кухонного гарнитура IKEA',
      description: 'Кухня МЕТОД, 12 модулей. Все коробки на месте. Нужна аккуратная сборка и навеска на стену верхних шкафов.',
      budget: 8000,
      deadline: '2 дня',
      category: 'Сборка мебели',
      categoryIcon: 'handyman',
      clientName: 'Ольга К.',
      clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      createdAgo: '1 час назад',
    ),
    _AvailableOrder(
      id: 3,
      title: 'Установка смесителя и унитаза',
      description: 'Заменить смеситель в ванной и установить новый подвесной унитаз. Инсталляция уже стоит.',
      budget: 5000,
      deadline: '1 день',
      category: 'Сантехника',
      categoryIcon: 'plumbing',
      clientName: 'Виктор С.',
      clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      createdAgo: '2 часа назад',
    ),
    _AvailableOrder(
      id: 4,
      title: 'Поклейка обоев в спальне',
      description: 'Комната 18 м\u00B2, стены подготовлены. Обои виниловые, уже куплены. Нужна аккуратная поклейка.',
      budget: 6000,
      deadline: '5 дней',
      category: 'Отделка',
      categoryIcon: 'format_paint',
      clientName: 'Наталья Р.',
      clientAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
      createdAgo: '3 часа назад',
    ),
    _AvailableOrder(
      id: 5,
      title: 'Генеральная уборка после ремонта',
      description: 'Двушка 65 м\u00B2. После косметического ремонта нужно убрать строительную пыль, помыть окна и полы.',
      budget: 5500,
      deadline: '2 дня',
      category: 'Уборка',
      categoryIcon: 'cleaning_services',
      clientName: 'Мария Д.',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      createdAgo: '5 часов назад',
    ),
    _AvailableOrder(
      id: 6,
      title: 'Установка кондиционера',
      description: 'Монтаж сплит-системы в комнату 20 м\u00B2. Кондиционер куплен, нужен монтаж с прокладкой трассы (3 м).',
      budget: 12000,
      deadline: '4 дня',
      category: 'Кондиционеры',
      categoryIcon: 'ac_unit',
      clientName: 'Дмитрий Л.',
      clientAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      createdAgo: '1 день назад',
    ),
  ];

  final List<Map<String, String>> _filters = const [
    {'id': 'all', 'label': 'Все'},
    {'id': 'category', 'label': 'По категории'},
    {'id': 'budget', 'label': 'По бюджету'},
    {'id': 'date', 'label': 'По дате'},
  ];

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 600), () {
      if (mounted) setState(() => _isLoading = false);
    });
  }

  List<_AvailableOrder> get _filteredOrders {
    final orders = List<_AvailableOrder>.from(_orders);
    switch (_selectedFilter) {
      case 'budget':
        orders.sort((a, b) => b.budget.compareTo(a.budget));
        break;
      case 'category':
        orders.sort((a, b) => a.category.compareTo(b.category));
        break;
      case 'date':
        // Already sorted by date in mock data
        break;
    }
    return orders;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Доступные заказы'),
        elevation: 0,
      ),
      body: Column(
        children: [
          // Filter chips
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            color: AppColors.surface,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _filters.map((f) {
                  final isSelected = _selectedFilter == f['id'];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(
                        f['label']!,
                        style: TextStyle(
                          color: isSelected ? Colors.white : AppColors.textPrimary,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                          fontSize: 13,
                        ),
                      ),
                      selected: isSelected,
                      onSelected: (_) => setState(() => _selectedFilter = f['id']!),
                      backgroundColor: AppColors.neutral100,
                      selectedColor: AppColors.primary,
                      checkmarkColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide(
                          color: isSelected ? AppColors.primary : AppColors.border,
                        ),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // Orders list
          Expanded(
            child: _isLoading
                ? _buildShimmerLoading()
                : _filteredOrders.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _filteredOrders.length,
                        itemBuilder: (context, index) {
                          return _buildOrderCard(_filteredOrders[index]);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildShimmerLoading() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 4,
      itemBuilder: (_, __) => Container(
        margin: const EdgeInsets.only(bottom: 12),
        height: 180,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Center(child: CircularProgressIndicator(strokeWidth: 2)),
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
                Icons.work_off_outlined,
                size: 48,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Нет доступных заказов',
              style: AppTextStyles.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Новые заказы появятся совсем скоро',
              style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderCard(_AvailableOrder order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
            child: Row(
              children: [
                // Category badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    order.category,
                    style: AppTextStyles.labelSmall.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  order.createdAgo,
                  style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),

          // Title
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 0),
            child: Text(
              order.title,
              style: AppTextStyles.titleMedium.copyWith(fontWeight: FontWeight.w700),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),

          // Description
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 6, 16, 0),
            child: Text(
              order.description,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.textSecondary,
                height: 1.4,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),

          const SizedBox(height: 12),

          // Budget, deadline, client
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                // Budget
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.payments_outlined, size: 14, color: AppColors.successDark),
                      const SizedBox(width: 4),
                      Text(
                        '${order.budget} \u20BD',
                        style: AppTextStyles.labelLarge.copyWith(
                          color: AppColors.successDark,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                // Deadline
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.warning.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.schedule_outlined, size: 14, color: AppColors.warningDark),
                      const SizedBox(width: 4),
                      Text(
                        order.deadline,
                        style: AppTextStyles.labelMedium.copyWith(
                          color: AppColors.warningDark,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                // Client avatar
                CircleAvatar(
                  radius: 14,
                  backgroundImage: NetworkImage(order.clientAvatar),
                  backgroundColor: AppColors.neutral200,
                ),
                const SizedBox(width: 6),
                Text(
                  order.clientName,
                  style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),
          const Divider(height: 1),

          // Respond button
          Padding(
            padding: const EdgeInsets.all(12),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _showRespondSheet(order),
                icon: const Icon(Icons.send, size: 18, color: Colors.white),
                label: const Text(
                  'Откликнуться',
                  style: TextStyle(fontWeight: FontWeight.w700, color: Colors.white),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showRespondSheet(_AvailableOrder order) {
    final priceController = TextEditingController();
    final messageController = TextEditingController();
    String selectedTimeline = '1-3 дня';
    final timelines = ['1-3 дня', '3-5 дней', '5-7 дней', '1-2 недели', 'Более 2 недель'];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom,
          ),
          child: SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Handle
                    Center(
                      child: Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: AppColors.neutral300,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    Text(
                      'Откликнуться на заказ',
                      style: AppTextStyles.headlineSmall,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      order.title,
                      style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 20),

                    // Price input
                    Text('Ваша цена', style: AppTextStyles.titleSmall.copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    TextField(
                      controller: priceController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        hintText: 'Укажите стоимость в рублях',
                        prefixIcon: const Icon(Icons.payments_outlined),
                        suffixText: '\u20BD',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.border),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.border),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.primary, width: 2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Timeline dropdown
                    Text('Срок выполнения', style: AppTextStyles.titleSmall.copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.border),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: selectedTimeline,
                          isExpanded: true,
                          icon: const Icon(Icons.keyboard_arrow_down),
                          items: timelines.map((t) => DropdownMenuItem(
                            value: t,
                            child: Text(t),
                          )).toList(),
                          onChanged: (v) {
                            if (v != null) setSheetState(() => selectedTimeline = v);
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Message
                    Text('Сообщение заказчику', style: AppTextStyles.titleSmall.copyWith(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    TextField(
                      controller: messageController,
                      maxLines: 4,
                      decoration: InputDecoration(
                        hintText: 'Расскажите о себе, опыте и подходе к работе...',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.border),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.border),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.primary, width: 2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Submit button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Отклик на "${order.title}" отправлен!'),
                              backgroundColor: AppColors.success,
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Отправить отклик',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 16,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
