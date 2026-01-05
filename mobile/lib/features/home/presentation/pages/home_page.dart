import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:yodo/core/theme/app_colors.dart';
import 'package:yodo/features/home/presentation/widgets/category_card.dart';
import 'package:yodo/features/home/presentation/widgets/specialist_card.dart';
import 'package:yodo/features/home/presentation/widgets/promo_banner.dart';
import 'package:yodo/features/home/presentation/widgets/search_bar_widget.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with TickerProviderStateMixin {
  late AnimationController _animationController;
  final ScrollController _scrollController = ScrollController();
  bool _isScrolled = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..forward();
    
    _scrollController.addListener(() {
      setState(() {
        _isScrolled = _scrollController.offset > 50;
      });
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark,
      child: Scaffold(
        body: CustomScrollView(
          controller: _scrollController,
          slivers: [
            // Premium App Bar
            SliverAppBar(
              expandedHeight: 120,
              floating: true,
              pinned: true,
              elevation: 0,
              backgroundColor: _isScrolled ? Colors.white : Colors.transparent,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
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
                ),
              ),
              title: AnimatedOpacity(
                opacity: _isScrolled ? 1 : 0,
                duration: const Duration(milliseconds: 200),
                child: _buildLogo(),
              ),
              actions: [
                IconButton(
                  icon: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: Badge(
                      label: const Text('3'),
                      child: const Icon(Icons.notifications_outlined, size: 22),
                    ),
                  ),
                  onPressed: () {},
                ),
                const SizedBox(width: 8),
              ],
            ),

            // Content
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header with Logo (when not scrolled)
                  AnimatedBuilder(
                    animation: _animationController,
                    builder: (context, child) {
                      return FadeTransition(
                        opacity: CurvedAnimation(
                          parent: _animationController,
                          curve: const Interval(0, 0.5, curve: Curves.easeOut),
                        ),
                        child: SlideTransition(
                          position: Tween<Offset>(
                            begin: const Offset(0, 0.3),
                            end: Offset.zero,
                          ).animate(CurvedAnimation(
                            parent: _animationController,
                            curve: const Interval(0, 0.5, curve: Curves.easeOut),
                          )),
                          child: child,
                        ),
                      );
                    },
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                      child: Row(
                        children: [
                          _buildLogo(),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              gradient: AppColors.primaryGradient,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Colors.greenAccent,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                const Text(
                                  '2,847 онлайн',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Search Bar
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: SearchBarWidget(),
                  ),

                  const SizedBox(height: 24),

                  // Promo Banner
                  const PromoBanner(),

                  const SizedBox(height: 28),

                  // Categories
                  _buildSectionHeader(
                    title: 'Категории',
                    onSeeAll: () => context.go('/specialists'),
                  ),

                  SizedBox(
                    height: 110,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      children: const [
                        CategoryCard(
                          icon: Icons.build_outlined,
                          title: 'Ремонт',
                          gradient: LinearGradient(
                            colors: [Color(0xFFFF6B6B), Color(0xFFFF8E53)],
                          ),
                          count: '2.3K',
                        ),
                        CategoryCard(
                          icon: Icons.electrical_services_outlined,
                          title: 'Электрика',
                          gradient: LinearGradient(
                            colors: [Color(0xFFFFD93D), Color(0xFFFF9F43)],
                          ),
                          count: '1.8K',
                        ),
                        CategoryCard(
                          icon: Icons.plumbing_outlined,
                          title: 'Сантехника',
                          gradient: LinearGradient(
                            colors: [Color(0xFF4ECDC4), Color(0xFF44A08D)],
                          ),
                          count: '1.5K',
                        ),
                        CategoryCard(
                          icon: Icons.cleaning_services_outlined,
                          title: 'Уборка',
                          gradient: LinearGradient(
                            colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                          ),
                          count: '1.7K',
                        ),
                        CategoryCard(
                          icon: Icons.school_outlined,
                          title: 'Репетиторы',
                          gradient: LinearGradient(
                            colors: [Color(0xFFA8E6CF), Color(0xFF88D8B0)],
                          ),
                          count: '3.2K',
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Top Specialists
                  _buildSectionHeader(
                    title: 'Топ специалисты',
                    subtitle: 'Рейтинг 4.9+',
                    onSeeAll: () => context.go('/specialists'),
                  ),

                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: 4,
                    itemBuilder: (context, index) {
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
                          'online': false,
                        },
                        {
                          'name': 'Дмитрий Смирнов',
                          'title': 'Сантехник',
                          'rating': 4.8,
                          'reviews': 203,
                          'price': 'от 1 500 ₽',
                          'badge': 'fast',
                          'online': true,
                        },
                        {
                          'name': 'Елена Козлова',
                          'title': 'Репетитор английского',
                          'rating': 4.9,
                          'reviews': 156,
                          'price': 'от 1 200 ₽/час',
                          'badge': null,
                          'online': false,
                        },
                      ];
                      
                      final s = specialists[index];
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
                  ),

                  const SizedBox(height: 120),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            gradient: AppColors.primaryGradient,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withOpacity(0.3),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: const Icon(
            Icons.auto_awesome,
            color: Colors.white,
            size: 20,
          ),
        ),
        const SizedBox(width: 10),
        ShaderMask(
          shaderCallback: (bounds) => AppColors.primaryGradient.createShader(bounds),
          child: const Text(
            'YODO',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: 1,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader({
    required String title,
    String? subtitle,
    required VoidCallback onSeeAll,
  }) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              if (subtitle != null)
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                  ),
                ),
            ],
          ),
          const Spacer(),
          TextButton(
            onPressed: onSeeAll,
            style: TextButton.styleFrom(
              foregroundColor: AppColors.primary,
            ),
            child: const Row(
              children: [
                Text('Все'),
                SizedBox(width: 4),
                Icon(Icons.arrow_forward_ios, size: 12),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
