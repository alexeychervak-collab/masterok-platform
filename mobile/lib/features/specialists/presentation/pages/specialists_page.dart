import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:yodo/core/theme/app_colors.dart';
import 'package:yodo/features/home/presentation/widgets/specialist_card.dart';

class SpecialistsPage extends StatefulWidget {
  const SpecialistsPage({super.key});

  @override
  State<SpecialistsPage> createState() => _SpecialistsPageState();
}

class _SpecialistsPageState extends State<SpecialistsPage> {
  final _searchController = TextEditingController();
  String _selectedCategory = 'Все';
  String _sortBy = 'rating';
  bool _showFilters = false;
  
  final _categories = [
    'Все',
    'Ремонт',
    'Электрика',
    'Сантехника',
    'Уборка',
    'Репетиторы',
    'Дизайн',
    'IT',
  ];

  final _sortOptions = [
    {'value': 'rating', 'label': 'По рейтингу'},
    {'value': 'reviews', 'label': 'По отзывам'},
    {'value': 'price_low', 'label': 'Сначала дешевле'},
    {'value': 'price_high', 'label': 'Сначала дороже'},
  ];

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark,
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: CustomScrollView(
          slivers: [
            // App Bar
            SliverAppBar(
              floating: true,
              pinned: true,
              elevation: 0,
              backgroundColor: Colors.white,
              expandedHeight: 180,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.03),
                        blurRadius: 10,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Title
                          Row(
                            children: [
                              const Text(
                                'Специалисты',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const Spacer(),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.primary.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Text(
                                  '15 234',
                                  style: TextStyle(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          
                          // Search Bar
                          Row(
                            children: [
                              Expanded(
                                child: Container(
                                  height: 52,
                                  decoration: BoxDecoration(
                                    color: AppColors.background,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: AppColors.border),
                                  ),
                                  child: TextField(
                                    controller: _searchController,
                                    decoration: InputDecoration(
                                      hintText: 'Поиск специалиста...',
                                      hintStyle: TextStyle(color: AppColors.textSecondary),
                                      prefixIcon: Icon(
                                        Icons.search,
                                        color: AppColors.textSecondary,
                                      ),
                                      border: InputBorder.none,
                                      contentPadding: const EdgeInsets.symmetric(
                                        horizontal: 16,
                                        vertical: 14,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    _showFilters = !_showFilters;
                                  });
                                },
                                child: Container(
                                  width: 52,
                                  height: 52,
                                  decoration: BoxDecoration(
                                    gradient: _showFilters
                                        ? AppColors.primaryGradient
                                        : null,
                                    color: _showFilters
                                        ? null
                                        : AppColors.background,
                                    borderRadius: BorderRadius.circular(16),
                                    border: _showFilters
                                        ? null
                                        : Border.all(color: AppColors.border),
                                  ),
                                  child: Icon(
                                    Icons.tune,
                                    color: _showFilters
                                        ? Colors.white
                                        : AppColors.textSecondary,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Categories
            SliverToBoxAdapter(
              child: Column(
                children: [
                  // Filters Panel
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    height: _showFilters ? 120 : 0,
                    child: SingleChildScrollView(
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        color: Colors.white,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Сортировка',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: _sortOptions.map((option) {
                                final isSelected = _sortBy == option['value'];
                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _sortBy = option['value']!;
                                    });
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 14,
                                      vertical: 8,
                                    ),
                                    decoration: BoxDecoration(
                                      gradient: isSelected
                                          ? AppColors.primaryGradient
                                          : null,
                                      color: isSelected ? null : Colors.grey.shade100,
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      option['label']!,
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w500,
                                        color: isSelected
                                            ? Colors.white
                                            : AppColors.textSecondary,
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  
                  // Categories Scroll
                  Container(
                    height: 50,
                    color: Colors.white,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: _categories.length,
                      itemBuilder: (context, index) {
                        final category = _categories[index];
                        final isSelected = category == _selectedCategory;

                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedCategory = category;
                              });
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 18,
                                vertical: 10,
                              ),
                              decoration: BoxDecoration(
                                gradient: isSelected
                                    ? AppColors.primaryGradient
                                    : null,
                                color: isSelected ? null : Colors.grey.shade100,
                                borderRadius: BorderRadius.circular(25),
                                boxShadow: isSelected
                                    ? [
                                        BoxShadow(
                                          color: AppColors.primary.withOpacity(0.3),
                                          blurRadius: 8,
                                          offset: const Offset(0, 4),
                                        ),
                                      ]
                                    : null,
                              ),
                              child: Text(
                                category,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: isSelected
                                      ? Colors.white
                                      : AppColors.textSecondary,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            ),

            // Results count
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                child: Row(
                  children: [
                    Text(
                      'Найдено: ',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    Text(
                      '1 234 специалиста',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Results List
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final specialists = [
                      {
                        'name': 'Алексей Петров',
                        'title': 'Электрик',
                        'rating': 4.9,
                        'reviews': 128,
                        'price': 'от 2 000 ₽',
                        'badge': 'top',
                        'online': true,
                      },
                      {
                        'name': 'Мария Иванова',
                        'title': 'Дизайнер интерьеров',
                        'rating': 5.0,
                        'reviews': 89,
                        'price': 'от 15 000 ₽',
                        'badge': null,
                        'online': true,
                      },
                      {
                        'name': 'Дмитрий Смирнов',
                        'title': 'Сантехник',
                        'rating': 4.8,
                        'reviews': 203,
                        'price': 'от 1 500 ₽',
                        'badge': 'fast',
                        'online': false,
                      },
                      {
                        'name': 'Елена Козлова',
                        'title': 'Репетитор английского',
                        'rating': 4.9,
                        'reviews': 156,
                        'price': 'от 1 200 ₽/час',
                        'badge': null,
                        'online': true,
                      },
                      {
                        'name': 'Андрей Николаев',
                        'title': 'Мастер по ремонту',
                        'rating': 4.7,
                        'reviews': 312,
                        'price': 'от 3 000 ₽',
                        'badge': 'top',
                        'online': false,
                      },
                    ];
                    
                    final s = specialists[index % specialists.length];
                    
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: SpecialistCard(
                        name: s['name'] as String,
                        title: s['title'] as String,
                        rating: s['rating'] as double,
                        reviews: s['reviews'] as int,
                        price: s['price'] as String,
                        badge: s['badge'] as String?,
                        isOnline: s['online'] as bool,
                        onTap: () => context.push('/specialist/$index'),
                      ),
                    );
                  },
                  childCount: 10,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
