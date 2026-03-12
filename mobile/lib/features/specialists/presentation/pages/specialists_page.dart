import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/core/data/mock_data.dart';
import 'package:masterok/core/models/specialist.dart';
import 'package:masterok/features/home/presentation/widgets/specialist_card.dart';
import 'package:masterok/features/specialists/data/specialists_provider.dart';

class SpecialistsPage extends ConsumerStatefulWidget {
  final String? initialCategory;
  final String? initialSearch;
  final bool focusSearch;

  const SpecialistsPage({super.key, this.initialCategory, this.initialSearch, this.focusSearch = false});

  @override
  ConsumerState<SpecialistsPage> createState() => _SpecialistsPageState();
}

class _SpecialistsPageState extends ConsumerState<SpecialistsPage> {
  final _searchController = TextEditingController();
  final _searchFocusNode = FocusNode();
  String _selectedCategory = 'Все';
  String _sortBy = 'rating';
  bool _showFilters = false;
  Timer? _debounce;
  String _searchQuery = '';
  
  late final List<String> _categories;

  final _sortOptions = [
    {'value': 'rating', 'label': 'По рейтингу'},
    {'value': 'reviews', 'label': 'По отзывам'},
    {'value': 'price_low', 'label': 'Сначала дешевле'},
    {'value': 'price_high', 'label': 'Сначала дороже'},
  ];

  @override
  void initState() {
    super.initState();
    _categories = [
      'Все',
      ...MockData.categories.map((c) => c.name).toSet(),
      // Несколько "витринных" категорий, даже если их нет в списке категорий.
      'Сборка мебели',
      'Плитка',
      'Потолки',
      'Сварка',
      'Грузчики',
      'Переезд',
    ];
    final c = widget.initialCategory;
    if (c != null && c.trim().isNotEmpty) {
      _selectedCategory = c;
    }
    final s = widget.initialSearch;
    if (s != null && s.trim().isNotEmpty) {
      final trimmed = s.trim();
      _searchController.text = trimmed;
      _searchQuery = trimmed;
    }
    if (widget.focusSearch) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _searchFocusNode.requestFocus();
      });
    }
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 250), () {
      if (!mounted) return;
      setState(() {
        _searchQuery = value.trim();
      });
    });
  }

  List<Specialist> _fallbackFiltered(SpecialistsFilter filter, List<Specialist> local) {
    // В fallback берём максимально "наполненный" список:
    // - локально зарегистрированные специалисты
    // - витринные mock специалисты
    var specialists = [...local, ...MockData.specialists];

    if (filter.category != null && filter.category!.trim().isNotEmpty) {
      final catLower = filter.category!.toLowerCase();
      specialists = specialists
          .where((s) =>
              s.skills.any((skill) => skill.toLowerCase().contains(catLower)) ||
              s.title.toLowerCase().contains(catLower))
          .toList();
    }

    if (filter.search != null && filter.search!.trim().isNotEmpty) {
      final searchLower = filter.search!.toLowerCase();
      specialists = specialists
          .where((s) =>
              s.firstName.toLowerCase().contains(searchLower) ||
              s.lastName.toLowerCase().contains(searchLower) ||
              s.title.toLowerCase().contains(searchLower) ||
              (s.bio ?? '').toLowerCase().contains(searchLower))
          .toList();
    }

    if (filter.minRating != null) {
      specialists = specialists.where((s) => s.rating >= filter.minRating!).toList();
    }

    return specialists;
  }

  @override
  Widget build(BuildContext context) {
    final filter = SpecialistsFilter(
      category: _selectedCategory == 'Все' ? null : _selectedCategory,
      search: _searchQuery.isEmpty ? null : _searchQuery,
      minRating: null,
    );
    final localSpecialistsAsync = ref.watch(localSpecialistsProvider);
    final localSpecialists = localSpecialistsAsync.valueOrNull ?? const <Specialist>[];
    final specialistsAsync = ref.watch(filteredSpecialistsProvider(filter));

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
                              specialistsAsync.when(
                                data: (items) => Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    '${items.length}',
                                    style: TextStyle(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                loading: () => Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 6,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(strokeWidth: 2),
                                  ),
                                ),
                                error: (_, __) => const SizedBox.shrink(),
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
                                    focusNode: _searchFocusNode,
                                    onChanged: _onSearchChanged,
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
                    specialistsAsync.when(
                      data: (items) => Text(
                        '${items.length} специалистов',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      loading: () => const Text(
                        'загрузка...',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      error: (_, __) => const Text(
                        'ошибка',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Results List
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: specialistsAsync.when(
                data: (items) {
                  if (items.isEmpty) {
                    return SliverToBoxAdapter(
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Text(
                          'По вашему запросу ничего не найдено',
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    );
                  }
                  final sorted = [...items];
                  switch (_sortBy) {
                    case 'rating':
                      sorted.sort((a, b) => b.rating.compareTo(a.rating));
                      break;
                    case 'reviews':
                      sorted.sort((a, b) => b.reviewsCount.compareTo(a.reviewsCount));
                      break;
                    case 'price_low':
                      sorted.sort((a, b) => (a.hourlyRate ?? double.infinity).compareTo(b.hourlyRate ?? double.infinity));
                      break;
                    case 'price_high':
                      sorted.sort((a, b) => (b.hourlyRate ?? -1).compareTo(a.hourlyRate ?? -1));
                      break;
                  }
                  return SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final s = sorted[index];
                        final price = s.hourlyRate != null
                            ? 'от ${s.hourlyRate!.toStringAsFixed(0)} ₽/час'
                            : 'Цена по договорённости';
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: SpecialistCard(
                            name: s.fullName,
                            title: s.title,
                            rating: s.rating,
                            reviews: s.reviewsCount,
                            price: price,
                            imageUrl: s.avatar,
                            badge: s.isVerified ? 'top' : null,
                            isOnline: s.isOnline,
                            onTap: () => context.push('/specialist/${s.id}'),
                          ),
                        );
                      },
                      childCount: sorted.length,
                    ),
                  );
                },
                loading: () {
                  // Важно для UX/скорости: пока идёт запрос — показываем заполненный список из mock,
                  // чтобы экран не выглядел "пустым" и не казался зависшим.
                  final items = _fallbackFiltered(filter, localSpecialists);
                  final sorted = [...items];
                  switch (_sortBy) {
                    case 'rating':
                      sorted.sort((a, b) => b.rating.compareTo(a.rating));
                      break;
                    case 'reviews':
                      sorted.sort((a, b) => b.reviewsCount.compareTo(a.reviewsCount));
                      break;
                    case 'price_low':
                      sorted.sort((a, b) => (a.hourlyRate ?? double.infinity).compareTo(b.hourlyRate ?? double.infinity));
                      break;
                    case 'price_high':
                      sorted.sort((a, b) => (b.hourlyRate ?? -1).compareTo(a.hourlyRate ?? -1));
                      break;
                  }
                  return SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final s = sorted[index];
                        final price = s.hourlyRate != null
                            ? 'от ${s.hourlyRate!.toStringAsFixed(0)} ₽/час'
                            : 'Цена по договорённости';
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: Stack(
                            children: [
                              SpecialistCard(
                                name: s.fullName,
                                title: s.title,
                                rating: s.rating,
                                reviews: s.reviewsCount,
                                price: price,
                                imageUrl: s.avatar,
                                badge: s.isVerified ? 'top' : null,
                                isOnline: s.isOnline,
                                onTap: () => context.push('/specialist/${s.id}'),
                              ),
                              Positioned(
                                right: 12,
                                top: 12,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary.withOpacity(0.10),
                                    borderRadius: BorderRadius.circular(999),
                                    border: Border.all(color: AppColors.primary.withOpacity(0.20)),
                                  ),
                                  child: const Text(
                                    'Обновляем…',
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.primary,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                      childCount: sorted.length.clamp(0, 20),
                    ),
                  );
                },
                error: (e, _) => SliverToBoxAdapter(
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Text(
                      'Не удалось загрузить специалистов: $e',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
