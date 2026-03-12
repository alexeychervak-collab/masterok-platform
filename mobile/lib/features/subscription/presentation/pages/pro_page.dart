import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/core/theme/app_text_styles.dart';
import 'package:masterok/features/auth/data/auth_provider.dart';
import 'package:masterok/core/services/auth_service.dart';

class ProPage extends ConsumerStatefulWidget {
  const ProPage({super.key});

  @override
  ConsumerState<ProPage> createState() => _ProPageState();
}

class _ProPageState extends ConsumerState<ProPage> {
  bool _isPro = false;
  DateTime? _proUntil;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadProStatus());
  }

  Future<void> _loadProStatus() async {
    final user = ref.read(currentUserProvider).valueOrNull;
    if (user != null) {
      try {
        final auth = ref.read(authServiceProvider);
        final isPro = await auth.isPro(user.id);
        final until = await auth.proUntil(user.id);
        if (mounted) {
          setState(() {
            _isPro = isPro;
            _proUntil = until;
            _isLoading = false;
          });
        }
      } catch (_) {
        if (mounted) setState(() => _isLoading = false);
      }
    } else {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final userAsync = ref.watch(currentUserProvider);
    final user = userAsync.valueOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: user == null
          ? _buildNotLoggedIn()
          : _isLoading
              ? const Center(child: CircularProgressIndicator())
              : CustomScrollView(
                  slivers: [
                    _buildSliverAppBar(),
                    SliverToBoxAdapter(child: _buildBody(context)),
                  ],
                ),
    );
  }

  Widget _buildNotLoggedIn() {
    return Scaffold(
      appBar: AppBar(title: const Text('PRO подписка')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.lock_outline, size: 40, color: AppColors.primary),
              ),
              const SizedBox(height: 16),
              Text(
                'Войдите, чтобы управлять подпиской',
                style: AppTextStyles.headlineSmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: const Text('Назад', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 220,
      pinned: true,
      elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF1E40AF),
                Color(0xFF2563EB),
                Color(0xFF06B6D4),
              ],
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 60, 24, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(
                          Icons.workspace_premium,
                          color: Colors.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'MasterOK PRO',
                            style: AppTextStyles.displaySmall.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          Text(
                            _isPro ? 'Подписка активна' : 'Премиум возможности',
                            style: AppTextStyles.bodyMedium.copyWith(
                              color: Colors.white.withOpacity(0.85),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const Spacer(),
                  if (_isPro && _proUntil != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.verified, color: Colors.white, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            'Активна до ${_formatDate(_proUntil!)}',
                            style: AppTextStyles.labelLarge.copyWith(color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // PRO badge if active
          if (_isPro) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.success.withOpacity(0.08),
                    AppColors.success.withOpacity(0.03),
                  ],
                ),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.success.withOpacity(0.2)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: const BoxDecoration(
                      color: AppColors.success,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.check, color: Colors.white, size: 20),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'PRO подписка активна',
                          style: AppTextStyles.titleSmall.copyWith(
                            fontWeight: FontWeight.w700,
                            color: AppColors.successDark,
                          ),
                        ),
                        Text(
                          'Спасибо! У вас открыт полный доступ ко всем возможностям.',
                          style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],

          // Feature comparison
          Text(
            'Сравнение тарифов',
            style: AppTextStyles.headlineSmall,
          ),
          const SizedBox(height: 14),

          _buildComparisonTable(),

          const SizedBox(height: 24),

          // PRO features
          Text(
            'Что дает PRO',
            style: AppTextStyles.headlineSmall,
          ),
          const SizedBox(height: 14),

          _buildFeatureCard(
            icon: Icons.trending_up,
            title: 'Приоритет в поиске',
            description: 'Ваш профиль будет показываться выше в результатах поиска',
            color: AppColors.primary,
          ),
          _buildFeatureCard(
            icon: Icons.money_off,
            title: 'Без комиссии',
            description: 'Никаких комиссий с заказов. Вся сумма -- ваша',
            color: AppColors.success,
          ),
          _buildFeatureCard(
            icon: Icons.workspace_premium,
            title: 'VIP значок',
            description: 'Золотой значок PRO повышает доверие клиентов',
            color: AppColors.warning,
          ),
          _buildFeatureCard(
            icon: Icons.analytics_outlined,
            title: 'Расширенная аналитика',
            description: 'Статистика просмотров профиля, конверсии откликов и доходов',
            color: AppColors.accent,
          ),
          _buildFeatureCard(
            icon: Icons.support_agent,
            title: 'Приоритетная поддержка',
            description: 'Быстрый ответ службы поддержки в течение 30 минут',
            color: AppColors.info,
          ),

          const SizedBox(height: 24),

          // Pricing
          if (!_isPro) ...[
            Container(
              width: double.infinity,
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
                children: [
                  Text(
                    'от 990 \u20BD/мес',
                    style: AppTextStyles.priceLarge.copyWith(color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'или 9 900 \u20BD/год (экономия 17%)',
                    style: AppTextStyles.bodySmall.copyWith(color: Colors.white.withOpacity(0.8)),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _startFreeTrial,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Попробовать бесплатно 7 дней',
                        style: AppTextStyles.button.copyWith(color: AppColors.primary),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Отменить можно в любой момент',
                    style: AppTextStyles.caption.copyWith(color: Colors.white.withOpacity(0.7)),
                  ),
                ],
              ),
            ),
          ],

          // Demo activate button
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () async {
                final user = ref.read(currentUserProvider).valueOrNull;
                if (user == null) return;
                final auth = ref.read(authServiceProvider);
                await auth.activatePro(user.id, duration: const Duration(days: 30));
                ref.read(currentUserProvider.notifier).refresh();
                await _loadProStatus();
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('PRO активирована на 30 дней (демо)'),
                    backgroundColor: AppColors.success,
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                );
              },
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                side: const BorderSide(color: AppColors.border),
              ),
              child: Text(
                _isPro ? 'Продлить PRO (демо)' : 'Активировать PRO (демо)',
                style: AppTextStyles.labelLarge.copyWith(color: AppColors.textSecondary),
              ),
            ),
          ),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildComparisonTable() {
    final features = [
      {'feature': 'Создание заказов', 'free': true, 'pro': true},
      {'feature': 'Отклики на заказы', 'free': true, 'pro': true},
      {'feature': 'Чат с исполнителем', 'free': true, 'pro': true},
      {'feature': 'Приоритет в поиске', 'free': false, 'pro': true},
      {'feature': 'Без комиссии', 'free': false, 'pro': true},
      {'feature': 'VIP значок', 'free': false, 'pro': true},
      {'feature': 'Расширенная аналитика', 'free': false, 'pro': true},
      {'feature': 'Приоритетная поддержка', 'free': false, 'pro': true},
    ];

    return Container(
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
        children: [
          // Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.neutral50,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Row(
              children: [
                Expanded(
                  flex: 3,
                  child: Text(
                    'Возможность',
                    style: AppTextStyles.labelMedium.copyWith(
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                Expanded(
                  child: Center(
                    child: Text(
                      'Free',
                      style: AppTextStyles.labelMedium.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryGradient,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        'PRO',
                        style: AppTextStyles.labelMedium.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Rows
          ...features.asMap().entries.map((entry) {
            final index = entry.key;
            final f = entry.value;
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
              decoration: BoxDecoration(
                border: index < features.length - 1
                    ? const Border(bottom: BorderSide(color: AppColors.border, width: 0.5))
                    : null,
              ),
              child: Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: Text(
                      f['feature'] as String,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Center(
                      child: Icon(
                        (f['free'] as bool) ? Icons.check_circle : Icons.cancel,
                        size: 20,
                        color: (f['free'] as bool) ? AppColors.success : AppColors.neutral400,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Center(
                      child: Icon(
                        (f['pro'] as bool) ? Icons.check_circle : Icons.cancel,
                        size: 20,
                        color: (f['pro'] as bool) ? AppColors.primary : AppColors.neutral400,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildFeatureCard({
    required IconData icon,
    required String title,
    required String description,
    required Color color,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
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
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTextStyles.titleSmall.copyWith(fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 2),
                Text(
                  description,
                  style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _startFreeTrial() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Оформление пробного периода (в разработке)'),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }
}
