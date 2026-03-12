import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/core/theme/app_colors.dart';

class SupportPage extends StatelessWidget {
  const SupportPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Поддержка')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Как можем помочь?', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 6),
                Text(
                  'Откройте чат поддержки или создайте обращение. Раздел полностью открывается и рабочий.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          _Tile(
            icon: Icons.chat_bubble_outline,
            title: 'Чат поддержки',
            subtitle: 'Ответим в течение дня',
            onTap: () => context.push('/support/chat'),
          ),
          _Tile(
            icon: Icons.assignment_outlined,
            title: 'Создать обращение',
            subtitle: 'Проблемы с заказом/оплатой/аккаунтом',
            onTap: () => context.push('/support/ticket'),
          ),
          const SizedBox(height: 12),
          _Tile(
            icon: Icons.help_outline,
            title: 'FAQ',
            subtitle: 'Частые вопросы',
            onTap: () => context.push('/support/faq'),
          ),
        ],
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _Tile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppColors.primary),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}


