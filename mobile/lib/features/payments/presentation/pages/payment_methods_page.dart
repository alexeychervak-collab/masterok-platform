import 'package:flutter/material.dart';
import 'package:masterok/core/theme/app_colors.dart';

class PaymentMethodsPage extends StatefulWidget {
  const PaymentMethodsPage({super.key});

  @override
  State<PaymentMethodsPage> createState() => _PaymentMethodsPageState();
}

class _PaymentMethodsPageState extends State<PaymentMethodsPage> {
  final List<_Card> _cards = [
    const _Card(masked: '•••• 1234', brand: 'МИР'),
  ];

  void _addDemoCard() {
    setState(() {
      _cards.add(_Card(masked: '•••• ${1000 + _cards.length}', brand: 'VISA'));
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Карта добавлена (демо)')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Способы оплаты')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _addDemoCard,
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add),
        label: const Text('Добавить карту'),
      ),
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
            child: Text(
              'Сохранённые способы оплаты (демо). Для настоящих платежей подключается эквайринг/токенизация.',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary),
            ),
          ),
          const SizedBox(height: 12),
          ..._cards.map((c) => _CardTile(card: c, onDelete: () {
                setState(() => _cards.remove(c));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Карта удалена')),
                );
              })),
          const SizedBox(height: 80),
        ],
      ),
    );
  }
}

class _Card {
  final String masked;
  final String brand;
  const _Card({required this.masked, required this.brand});
}

class _CardTile extends StatelessWidget {
  final _Card card;
  final VoidCallback onDelete;
  const _CardTile({required this.card, required this.onDelete});

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
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            gradient: AppColors.primaryGradient,
            borderRadius: BorderRadius.circular(14),
          ),
          child: const Icon(Icons.credit_card, color: Colors.white),
        ),
        title: Text('${card.brand} ${card.masked}', style: const TextStyle(fontWeight: FontWeight.w700)),
        subtitle: const Text('По умолчанию'),
        trailing: IconButton(
          icon: const Icon(Icons.delete_outline),
          onPressed: onDelete,
        ),
      ),
    );
  }
}




