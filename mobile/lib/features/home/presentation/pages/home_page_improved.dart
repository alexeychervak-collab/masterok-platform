import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/glass_card.dart';
import '../../../../core/widgets/animated_card.dart';
import '../../../../core/widgets/shimmer_widget.dart';
import '../../../specialists/data/specialists_provider.dart';

/// Улучшенная главная страница МастерОК
/// С Glassmorphism, анимациями и современным дизайном
class HomePageImproved extends ConsumerStatefulWidget {
  const HomePageImproved({super.key});

  @override
  ConsumerState<HomePageImproved> createState() => _HomePageImprovedState();
}

class _HomePageImprovedState extends ConsumerState<HomePageImproved> 
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _slideController;
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _scrollController.addListener(() {
      if (mounted) {
        setState(() {
          _isScrolled = _scrollController.offset > 50;
        });
      }
    });

    // Быстрый старт: без искусственных задержек
    Future.microtask(() {
      if (!mounted) return;
      setState(() => _isLoading = false);
      _fadeController.forward();
      _slideController.forward();
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _slideController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        extendBodyBehindAppBar: true,
        appBar: _buildGlassAppBar(),
        body: _isLoading ? _buildLoadingState() : _buildContent(),
        floatingActionButton: _buildFAB(),
      ),
    );
  }

  PreferredSizeWidget _buildGlassAppBar() {
    return PreferredSize(
      preferredSize: const Size.fromHeight(kToolbarHeight),
      child: ClipRRect(
        child: BackdropFilter(
          filter: ImageFilter.blur(
            sigmaX: _isScrolled ? 10 : 0,
            sigmaY: _isScrolled ? 10 : 0,
          ),
          child: AppBar(
            backgroundColor: _isScrolled
                ? Colors.white.withOpacity(0.8)
                : Colors.transparent,
            elevation: 0,
            title: AnimatedOpacity(
              opacity: _isScrolled ? 1 : 0,
              duration: const Duration(milliseconds: 200),
              child: Row(
                children: [
                  Icon(
                    Icons.construction,
                    color: AppColors.primary,
                    size: 28,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'МастерОК',
                    style: AppTextStyles.h4.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              // Уведомления
              Padding(
                padding: const EdgeInsets.only(right: 8),
                child: GestureDetector(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    context.push('/notifications');
                  },
                  child: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Badge(
                      label: const Text('5'),
                      backgroundColor: AppColors.error,
                      child: Icon(
                        Icons.notifications_outlined,
                        color: AppColors.primary,
                        size: 22,
                      ),
                    ),
                  ),
                ),
              ),
              // Профиль
              Padding(
                padding: const EdgeInsets.only(right: 16),
                child: GestureDetector(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    context.go('/profile');
                  },
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primary.withOpacity(0.3),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Text(
                        'П',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingState() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary.withOpacity(0.1),
            AppColors.secondary.withOpacity(0.05),
          ],
        ),
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              const SizedBox(height: 24),
              // Skeleton для поиска
              SkeletonCard(
                height: 56,
                margin: const EdgeInsets.symmetric(horizontal: 16),
              ),
              const SizedBox(height: 24),
              // Skeleton для категорий
              SizedBox(
                height: 120,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: 5,
                  itemBuilder: (context, index) {
                    return SkeletonCard(
                      width: 100,
                      height: 100,
                      margin: EdgeInsets.only(
                        left: index == 0 ? 16 : 8,
                        right: index == 4 ? 16 : 8,
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
              // Skeleton для специалистов
              ...List.generate(
                5,
                (index) => const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: SkeletonSpecialistCard(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary.withOpacity(0.1),
            AppColors.secondary.withOpacity(0.05),
            Colors.white,
          ],
        ),
      ),
      child: SafeArea(
        child: CustomScrollView(
          controller: _scrollController,
          slivers: [
            // Заголовок и поиск
            SliverToBoxAdapter(
              child: FadeTransition(
                opacity: _fadeController,
                child: _buildHeader(),
              ),
            ),

            // Категории
            SliverToBoxAdapter(
              child: FadeTransition(
                opacity: _fadeController,
                child: _buildCategories(),
              ),
            ),

            // Промо баннер
            SliverToBoxAdapter(
              child: FadeTransition(
                opacity: _fadeController,
                child: _buildPromoBanner(),
              ),
            ),

            // Топ специалистов
            SliverToBoxAdapter(
              child: FadeTransition(
                opacity: _fadeController,
                child: _buildTopSpecialists(),
              ),
            ),

            // Недавние заказы
            SliverToBoxAdapter(
              child: FadeTransition(
                opacity: _fadeController,
                child: _buildRecentOrders(),
              ),
            ),

            // Статистика
            SliverToBoxAdapter(
              child: FadeTransition(
                opacity: _fadeController,
                child: _buildStatistics(),
              ),
            ),

            // Отступ снизу
            const SliverToBoxAdapter(
              child: SizedBox(height: 100),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Приветствие
          Text(
            'Привет! 👋',
            style: AppTextStyles.h2.copyWith(
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Найдём лучших специалистов',
            style: AppTextStyles.body.copyWith(
              color: Colors.black54,
            ),
          ),
          const SizedBox(height: 20),

          // Поиск с Glassmorphism
          GlassCard(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            onTap: () {
              HapticFeedback.lightImpact();
              context.go('/search');
            },
            child: Row(
              children: [
                Icon(Icons.search, color: AppColors.primary, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Искать специалистов...',
                    style: AppTextStyles.body.copyWith(
                      color: Colors.black54,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.tune,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategories() {
    final categories = [
      {'icon': Icons.construction, 'title': 'Ремонт', 'color': AppColors.primary},
      {'icon': Icons.plumbing, 'title': 'Сантехника', 'color': AppColors.info},
      {'icon': Icons.electrical_services, 'title': 'Электрика', 'color': AppColors.warning},
      {'icon': Icons.cleaning_services, 'title': 'Уборка', 'color': AppColors.success},
      {'icon': Icons.carpenter, 'title': 'Мебель', 'color': AppColors.accent},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Категории', style: AppTextStyles.h4),
              TextButton(
                onPressed: () {
                  HapticFeedback.lightImpact();
                  context.go('/categories');
                },
                child: Row(
                  children: [
                    Text('Все', style: TextStyle(color: AppColors.primary)),
                    Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.primary),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 110,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final category = categories[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: AnimatedCard(
                  borderRadius: 16,
                  padding: const EdgeInsets.all(12),
                  onTap: () {
                    HapticFeedback.lightImpact();
                    context.go('/specialists?category=${Uri.encodeComponent(category['title'] as String)}');
                  },
                  child: Container(
                    width: 90,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                (category['color'] as Color).withOpacity(0.8),
                                (category['color'] as Color),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: (category['color'] as Color).withOpacity(0.3),
                                blurRadius: 8,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Icon(
                            category['icon'] as IconData,
                            color: Colors.white,
                            size: 28,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          category['title'] as String,
                          style: AppTextStyles.caption.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPromoBanner() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: GlassCard(
        padding: EdgeInsets.zero,
        child: Container(
          height: 160,
          decoration: BoxDecoration(
            gradient: AppColors.primaryGradient,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Stack(
            children: [
              Positioned(
                right: -20,
                bottom: -20,
                child: Icon(
                  Icons.construction,
                  size: 150,
                  color: Colors.white.withOpacity(0.1),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '🎉 Скидка 20%',
                      style: AppTextStyles.h3.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'на первый заказ!\nНайдите специалиста сегодня',
                      style: AppTextStyles.body.copyWith(
                        color: Colors.white.withOpacity(0.95),
                      ),
                    ),
                    const SizedBox(height: 16),
                    GlassButton(
                      text: 'Создать заказ',
                      onPressed: () {
                        HapticFeedback.mediumImpact();
                        context.go('/orders/create');
                      },
                      color: Colors.white.withOpacity(0.3),
                      icon: Icons.add_circle_outline,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopSpecialists() {
    final featuredAsync = ref.watch(featuredSpecialistsProvider);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Топ специалисты', style: AppTextStyles.h4),
              TextButton(
                onPressed: () {
                  HapticFeedback.lightImpact();
                  context.go('/specialists?focus=1');
                },
                child: Row(
                  children: [
                    Text('Все', style: TextStyle(color: AppColors.primary)),
                    Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.primary),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        featuredAsync.when(
          data: (items) {
            final top = items.take(3).toList();
            return Column(
              children: top
                  .map(
                    (s) => Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      child: _buildSpecialistCard(
                        id: s.id,
                        name: s.fullName,
                        title: s.title,
                        rating: s.rating,
                        reviews: s.reviewsCount,
                        avatar: s.avatar,
                      ),
                    ),
                  )
                  .toList(),
            );
          },
          loading: () => const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: ShimmerWidget(
              child: SizedBox(
                height: 90,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.all(Radius.circular(20)),
                  ),
                ),
              ),
            ),
          ),
          error: (_, __) => const SizedBox.shrink(),
        ),
      ],
    );
  }

  Widget _buildSpecialistCard({
    required int id,
    required String name,
    required String title,
    required double rating,
    required int reviews,
    required String? avatar,
  }) {
    return AnimatedCard(
      onTap: () {
        HapticFeedback.lightImpact();
        context.go('/specialist/$id');
      },
      child: Row(
        children: [
          // Аватар
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withOpacity(0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ClipOval(
              child: avatar == null
                  ? const Center(
                      child: Icon(
                        Icons.person,
                        color: Colors.white,
                        size: 32,
                      ),
                    )
                  : CachedNetworkImage(
                      imageUrl: avatar,
                      fit: BoxFit.cover,
                      placeholder: (_, __) => const Center(
                        child: Icon(Icons.person, color: Colors.white, size: 32),
                      ),
                      errorWidget: (_, __, ___) => const Center(
                        child: Icon(Icons.person, color: Colors.white, size: 32),
                      ),
                    ),
            ),
          ),
          const SizedBox(width: 12),
          // Информация
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: AppTextStyles.subtitle1.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  title,
                  style: AppTextStyles.caption.copyWith(
                    color: Colors.black54,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.star, color: AppColors.warning, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      rating.toStringAsFixed(1),
                      style: AppTextStyles.caption.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '($reviews отзывов)',
                      style: AppTextStyles.caption.copyWith(
                        color: Colors.black54,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Бейдж
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              gradient: AppColors.successGradient,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Icon(Icons.verified, color: Colors.white, size: 14),
                const SizedBox(width: 4),
                Text(
                  'TOP',
                  style: AppTextStyles.badge.copyWith(
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentOrders() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Недавние заказы', style: AppTextStyles.h4),
          const SizedBox(height: 12),
          GlassCard(
            child: Column(
              children: [
                _buildOrderItem(
                  'Ремонт кухни',
                  'В поиске специалиста',
                  AppColors.warning,
                  Icons.search,
                ),
                Divider(color: Colors.grey[200]),
                _buildOrderItem(
                  'Установка розеток',
                  'В работе',
                  AppColors.info,
                  Icons.construction,
                ),
                Divider(color: Colors.grey[200]),
                _buildOrderItem(
                  'Укладка плитки',
                  'Завершено',
                  AppColors.success,
                  Icons.check_circle,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderItem(String title, String status, Color color, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTextStyles.subtitle2),
                Text(
                  status,
                  style: AppTextStyles.caption.copyWith(color: color),
                ),
              ],
            ),
          ),
          Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
        ],
      ),
    );
  }

  Widget _buildStatistics() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Статистика', style: AppTextStyles.h4),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: GlassCard(
                  child: Column(
                    children: [
                      Text(
                        '1,234',
                        style: AppTextStyles.h2.copyWith(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Специалистов',
                        style: AppTextStyles.caption,
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: GlassCard(
                  child: Column(
                    children: [
                      Text(
                        '5,678',
                        style: AppTextStyles.h2.copyWith(
                          color: AppColors.success,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Заказов',
                        style: AppTextStyles.caption,
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFAB() {
    return AnimatedButton(
      text: 'Создать заказ',
      icon: Icons.add,
      onPressed: () {
        HapticFeedback.mediumImpact();
        context.go('/orders/create');
      },
      backgroundColor: AppColors.primary,
      margin: const EdgeInsets.only(bottom: 16),
    );
  }
}




