import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/widgets/glass_card.dart';
import '../../../../core/widgets/animated_button.dart';
import '../../../../core/constants/app_constants.dart';

/// Реферальная программа
class ReferralPage extends StatefulWidget {
  const ReferralPage({super.key});

  @override
  State<ReferralPage> createState() => _ReferralPageState();
}

class _ReferralPageState extends State<ReferralPage> {
  final String referralCode = 'MASTEROK-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
  int totalReferrals = 0;
  double totalEarnings = 0;
  int pendingBonus = 1000;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Реферальная программа'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Заголовок
            Text(
              'Приглашай друзей\nи зарабатывай!',
              style: AppTextStyles.h2.copyWith(
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Получай ${AppConstants.bonusForReferral}₽ за каждого приглашенного друга',
              style: AppTextStyles.body.copyWith(
                color: Colors.black54,
              ),
            ),
            const SizedBox(height: 24),

            // Статистика
            _buildStats(),
            const SizedBox(height: 24),

            // Реферальный код
            _buildReferralCode(),
            const SizedBox(height: 24),

            // Как это работает
            _buildHowItWorks(),
            const SizedBox(height: 24),

            // Преимущества
            _buildBenefits(),
            const SizedBox(height: 24),

            // История рефералов
            _buildReferralHistory(),
          ],
        ),
      ),
    );
  }

  Widget _buildStats() {
    return Row(
      children: [
        Expanded(
          child: GlassCard(
            child: Column(
              children: [
                Icon(
                  Icons.people,
                  color: AppColors.primary,
                  size: 32,
                ),
                const SizedBox(height: 8),
                Text(
                  totalReferrals.toString(),
                  style: AppTextStyles.h2.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Рефералов',
                  style: AppTextStyles.caption.copyWith(
                    color: Colors.black54,
                  ),
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
                Icon(
                  Icons.account_balance_wallet,
                  color: AppColors.success,
                  size: 32,
                ),
                const SizedBox(height: 8),
                Text(
                  '${totalEarnings.toStringAsFixed(0)}₽',
                  style: AppTextStyles.h2.copyWith(
                    color: AppColors.success,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Заработано',
                  style: AppTextStyles.caption.copyWith(
                    color: Colors.black54,
                  ),
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
                Icon(
                  Icons.hourglass_empty,
                  color: AppColors.warning,
                  size: 32,
                ),
                const SizedBox(height: 8),
                Text(
                  '${pendingBonus}₽',
                  style: AppTextStyles.h2.copyWith(
                    color: AppColors.warning,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Ожидает',
                  style: AppTextStyles.caption.copyWith(
                    color: Colors.black54,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildReferralCode() {
    return GlassCard(
      child: Column(
        children: [
          Text(
            'Твой реферальный код',
            style: AppTextStyles.subtitle1.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  referralCode,
                  style: AppTextStyles.h3.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: AnimatedButton(
                  text: 'Копировать',
                  icon: Icons.copy,
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: referralCode));
                    HapticFeedback.mediumImpact();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Код скопирован!'),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  },
                  backgroundColor: AppColors.info,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: AnimatedButton(
                  text: 'Поделиться',
                  icon: Icons.share,
                  onPressed: () {
                    HapticFeedback.mediumImpact();
                    Share.share(
                      'Присоединяйся к МастерОК и получи 500₽ на первый заказ!\n\n'
                      'Используй мой код: $referralCode\n\n'
                      '${AppConstants.webAppUrl}?ref=$referralCode',
                      subject: 'Приглашение в МастерОК',
                    );
                  },
                  backgroundColor: AppColors.success,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHowItWorks() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Как это работает?',
          style: AppTextStyles.h4.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 16),
        _buildStep(
          1,
          'Поделись кодом',
          'Отправь свой реферальный код друзьям',
          Icons.share,
          AppColors.primary,
        ),
        const SizedBox(height: 12),
        _buildStep(
          2,
          'Друг регистрируется',
          'Он использует твой код при регистрации',
          Icons.person_add,
          AppColors.info,
        ),
        const SizedBox(height: 12),
        _buildStep(
          3,
          'Получаешь бонус',
          'Тебе начисляется ${AppConstants.bonusForReferral}₽ после его первого заказа',
          Icons.monetization_on,
          AppColors.success,
        ),
      ],
    );
  }

  Widget _buildStep(int number, String title, String description, IconData icon, Color color) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [color, color.withOpacity(0.7)],
              ),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Center(
              child: Icon(icon, color: Colors.white, size: 24),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        'Шаг $number',
                        style: AppTextStyles.caption.copyWith(
                          color: color,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  title,
                  style: AppTextStyles.subtitle2.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  description,
                  style: AppTextStyles.caption.copyWith(
                    color: Colors.black54,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBenefits() {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Твои преимущества',
            style: AppTextStyles.h5.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          _buildBenefit(
            Icons.monetization_on,
            '${AppConstants.bonusForReferral}₽ за реферала',
            'Получай бонус за каждого приглашенного друга',
            AppColors.success,
          ),
          const SizedBox(height: 12),
          _buildBenefit(
            Icons.card_giftcard,
            'Друг получает ${AppConstants.bonusForFirstOrder}₽',
            'Твой друг также получит бонус на первый заказ',
            AppColors.accent,
          ),
          const SizedBox(height: 12),
          _buildBenefit(
            Icons.all_inclusive,
            'Безлимитно',
            'Приглашай сколько угодно друзей',
            AppColors.info,
          ),
          const SizedBox(height: 12),
          _buildBenefit(
            Icons.speed,
            'Моментальное начисление',
            'Бонус зачисляется сразу после первого заказа',
            AppColors.primary,
          ),
        ],
      ),
    );
  }

  Widget _buildBenefit(IconData icon, String title, String description, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
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
              Text(
                title,
                style: AppTextStyles.subtitle2.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                description,
                style: AppTextStyles.caption.copyWith(
                  color: Colors.black54,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildReferralHistory() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'История рефералов',
          style: AppTextStyles.h4.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 16),
        totalReferrals == 0
            ? GlassCard(
                child: Column(
                  children: [
                    Icon(
                      Icons.people_outline,
                      size: 64,
                      color: Colors.grey[400],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Пока нет рефералов',
                      style: AppTextStyles.subtitle1.copyWith(
                        color: Colors.black54,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Поделись своим кодом с друзьями',
                      style: AppTextStyles.caption.copyWith(
                        color: Colors.black38,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              )
            : ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: 5,
                separatorBuilder: (context, index) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  return GlassCard(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundColor: AppColors.primary.withOpacity(0.1),
                          child: Icon(Icons.person, color: AppColors.primary),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Пользователь ${index + 1}',
                                style: AppTextStyles.subtitle2.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                'Зарегистрировался 5 дней назад',
                                style: AppTextStyles.caption.copyWith(
                                  color: Colors.black54,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.success.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '+${AppConstants.bonusForReferral}₽',
                            style: AppTextStyles.caption.copyWith(
                              color: AppColors.success,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
      ],
    );
  }
}




