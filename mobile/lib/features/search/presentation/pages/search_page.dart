import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/core/data/mock_data.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/core/theme/app_text_styles.dart';

class SearchPage extends StatefulWidget {
  final String? initialSearch;

  const SearchPage({super.key, this.initialSearch});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  late final TextEditingController _searchController;
  final FocusNode _focusNode = FocusNode();
  Timer? _debounce;
  String _query = '';
  bool _hasSearched = false;

  final List<String> _recentSearches = [
    'Электрик',
    'Сантехник',
    'Ремонт ванной',
    'Сборка мебели IKEA',
    'Покраска стен',
  ];

  final List<Map<String, dynamic>> _popularCategories = [
    {'name': 'Электрика', 'icon': Icons.electrical_services, 'color': const Color(0xFFF59E0B)},
    {'name': 'Сантехника', 'icon': Icons.plumbing, 'color': const Color(0xFF06B6D4)},
    {'name': 'Ремонт', 'icon': Icons.home_repair_service, 'color': const Color(0xFF2563EB)},
    {'name': 'Уборка', 'icon': Icons.cleaning_services, 'color': const Color(0xFF22C55E)},
    {'name': 'Отделка', 'icon': Icons.format_paint, 'color': const Color(0xFF8B5CF6)},
    {'name': 'Мебель', 'icon': Icons.chair, 'color': const Color(0xFFEF4444)},
    {'name': 'Кондиционеры', 'icon': Icons.ac_unit, 'color': const Color(0xFF3B82F6)},
    {'name': 'Переезд', 'icon': Icons.local_shipping, 'color': const Color(0xFFEC4899)},
  ];

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController(text: widget.initialSearch ?? '');
    if (widget.initialSearch != null && widget.initialSearch!.isNotEmpty) {
      _query = widget.initialSearch!;
      _hasSearched = true;
    }
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_query.isEmpty) _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _focusNode.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  void _onSearchChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      if (mounted) {
        setState(() {
          _query = value.trim();
          _hasSearched = value.trim().isNotEmpty;
        });
      }
    });
  }

  // Search results from mock data
  List<Map<String, dynamic>> get _specialistResults {
    if (_query.isEmpty) return [];
    final q = _query.toLowerCase();
    return MockData.specialists
        .where((s) =>
            s.fullName.toLowerCase().contains(q) ||
            s.title.toLowerCase().contains(q) ||
            s.skills.any((skill) => skill.toLowerCase().contains(q)))
        .take(5)
        .map((s) => {
              'type': 'specialist',
              'id': s.id,
              'name': s.fullName,
              'title': s.title,
              'rating': s.rating,
              'avatar': s.avatar,
              'reviewsCount': s.reviewsCount,
            })
        .toList();
  }

  List<Map<String, dynamic>> get _categoryResults {
    if (_query.isEmpty) return [];
    final q = _query.toLowerCase();
    return MockData.categories
        .where((c) =>
            c.name.toLowerCase().contains(q) ||
            (c.description?.toLowerCase().contains(q) ?? false))
        .take(4)
        .map((c) => {
              'type': 'category',
              'name': c.name,
              'count': c.servicesCount,
              'slug': c.slug,
            })
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        elevation: 0,
        titleSpacing: 0,
        title: Padding(
          padding: const EdgeInsets.only(right: 16),
          child: TextField(
            controller: _searchController,
            focusNode: _focusNode,
            onChanged: _onSearchChanged,
            onSubmitted: (val) {
              if (val.trim().isNotEmpty) {
                setState(() {
                  _query = val.trim();
                  _hasSearched = true;
                });
              }
            },
            style: AppTextStyles.bodyLarge,
            decoration: InputDecoration(
              hintText: 'Поиск специалистов и услуг...',
              hintStyle: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
              filled: true,
              fillColor: AppColors.background,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.close, size: 20),
                      onPressed: () {
                        _searchController.clear();
                        setState(() {
                          _query = '';
                          _hasSearched = false;
                        });
                        _focusNode.requestFocus();
                      },
                    )
                  : null,
            ),
          ),
        ),
      ),
      body: _hasSearched && _query.isNotEmpty ? _buildSearchResults() : _buildSuggestions(),
    );
  }

  Widget _buildSuggestions() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Popular categories
          Text(
            'Популярные категории',
            style: AppTextStyles.headlineSmall,
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _popularCategories.map((cat) {
              final color = cat['color'] as Color;
              return ActionChip(
                avatar: Icon(cat['icon'] as IconData, size: 18, color: color),
                label: Text(
                  cat['name'] as String,
                  style: AppTextStyles.labelLarge.copyWith(color: AppColors.textPrimary),
                ),
                onPressed: () {
                  _searchController.text = cat['name'] as String;
                  setState(() {
                    _query = cat['name'] as String;
                    _hasSearched = true;
                  });
                },
                backgroundColor: color.withOpacity(0.08),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: color.withOpacity(0.2)),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
              );
            }).toList(),
          ),

          const SizedBox(height: 28),

          // Recent searches
          if (_recentSearches.isNotEmpty) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Недавние запросы', style: AppTextStyles.headlineSmall),
                TextButton(
                  onPressed: () {
                    setState(() => _recentSearches.clear());
                  },
                  child: Text(
                    'Очистить',
                    style: AppTextStyles.labelMedium.copyWith(color: AppColors.textSecondary),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ...List.generate(_recentSearches.length, (index) {
              final search = _recentSearches[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 4),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(10),
                    onTap: () {
                      _searchController.text = search;
                      setState(() {
                        _query = search;
                        _hasSearched = true;
                      });
                    },
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
                      child: Row(
                        children: [
                          const Icon(Icons.history, size: 20, color: AppColors.textSecondary),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              search,
                              style: AppTextStyles.bodyMedium,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.north_west, size: 16, color: AppColors.textSecondary),
                            onPressed: () {
                              _searchController.text = search;
                              _searchController.selection = TextSelection.collapsed(
                                offset: search.length,
                              );
                              _focusNode.requestFocus();
                            },
                            constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                            padding: EdgeInsets.zero,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }),
          ],
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    final specialists = _specialistResults;
    final categories = _categoryResults;
    final hasResults = specialists.isNotEmpty || categories.isNotEmpty;

    if (!hasResults) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.search_off, size: 40, color: AppColors.primary),
              ),
              const SizedBox(height: 16),
              Text(
                'Ничего не найдено',
                style: AppTextStyles.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                'Попробуйте изменить запрос\nили выбрать категорию',
                style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Category results
          if (categories.isNotEmpty) ...[
            Text(
              'Категории',
              style: AppTextStyles.titleMedium.copyWith(
                fontWeight: FontWeight.w700,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 8),
            ...categories.map((cat) => Container(
                  margin: const EdgeInsets.only(bottom: 6),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: ListTile(
                    leading: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.category_outlined, color: AppColors.primary, size: 20),
                    ),
                    title: Text(
                      cat['name'] as String,
                      style: AppTextStyles.titleSmall.copyWith(fontWeight: FontWeight.w600),
                    ),
                    subtitle: Text(
                      '${cat['count']} услуг',
                      style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                    ),
                    trailing: const Icon(Icons.chevron_right, color: AppColors.textSecondary),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    onTap: () {
                      context.push('/specialists?category=${Uri.encodeComponent(cat['name'] as String)}');
                    },
                  ),
                )),
            const SizedBox(height: 20),
          ],

          // Specialist results
          if (specialists.isNotEmpty) ...[
            Text(
              'Специалисты',
              style: AppTextStyles.titleMedium.copyWith(
                fontWeight: FontWeight.w700,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 8),
            ...specialists.map((spec) => Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(14),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(14),
                      onTap: () {
                        context.push('/specialist/${spec['id']}');
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            CircleAvatar(
                              radius: 24,
                              backgroundImage: spec['avatar'] != null
                                  ? NetworkImage(spec['avatar'] as String)
                                  : null,
                              backgroundColor: AppColors.neutral200,
                              child: spec['avatar'] == null
                                  ? Text(
                                      (spec['name'] as String).isNotEmpty
                                          ? (spec['name'] as String)[0]
                                          : '?',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    )
                                  : null,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    spec['name'] as String,
                                    style: AppTextStyles.titleSmall.copyWith(fontWeight: FontWeight.w700),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    spec['title'] as String,
                                    style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
                                  ),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.star_rounded, size: 16, color: AppColors.warning),
                                    const SizedBox(width: 3),
                                    Text(
                                      '${spec['rating']}',
                                      style: AppTextStyles.labelLarge.copyWith(fontWeight: FontWeight.w700),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '${spec['reviewsCount']} отзывов',
                                  style: AppTextStyles.caption.copyWith(color: AppColors.textSecondary),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                )),
          ],
        ],
      ),
    );
  }
}
