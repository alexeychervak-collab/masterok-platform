import 'package:flutter/material.dart';
import 'package:masterok/core/theme/app_colors.dart';

class SupportFaqPage extends StatelessWidget {
  const SupportFaqPage({super.key});

  @override
  Widget build(BuildContext context) {
    final items = const [
      ('Как создать заказ?', 'Откройте раздел “Заказы” → “Создать заказ” и заполните шаги.'),
      ('Как выбрать специалиста?', 'Откройте “Отклики” у заказа и нажмите “Принять”.'),
      ('Как работает СБП?', 'В оплате выберите “СБП”, отсканируйте QR и нажмите “Я оплатил”.'),
      ('Регистрация не работает?', 'Если сервер недоступен, включается демо-режим и всё продолжает работать.'),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('FAQ')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        itemBuilder: (context, i) {
          final (q, a) = items[i];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: ExpansionTile(
              title: Text(q),
              childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              children: [
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(a, style: TextStyle(color: AppColors.textSecondary)),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}


