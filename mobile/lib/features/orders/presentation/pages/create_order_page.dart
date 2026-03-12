import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/core/theme/app_colors.dart';
import 'package:masterok/features/orders/data/orders_provider.dart';

class CreateOrderPage extends ConsumerStatefulWidget {
  const CreateOrderPage({super.key});

  @override
  ConsumerState<CreateOrderPage> createState() => _CreateOrderPageState();
}

class _CreateOrderPageState extends ConsumerState<CreateOrderPage> {
  final PageController _pageController = PageController();
  int _currentStep = 0;
  bool _publishing = false;
  
  // Form data
  String? _selectedCategory;
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  String _budgetType = 'fixed';
  final _budgetController = TextEditingController();
  DateTime? _deadline;
  bool _isRemote = false;
  final _addressController = TextEditingController();
  final List<String> _selectedImages = [];
  final List<String> _requirements = [];

  final List<String> _categories = [
    'Ремонт',
    'Электрика',
    'Сантехника',
    'Уборка',
    'Дизайн',
    'Строительство',
    'Отделка',
    'Мебель',
    'Техника',
    'Другое',
  ];

  @override
  void dispose() {
    _pageController.dispose();
    _titleController.dispose();
    _descriptionController.dispose();
    _budgetController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < 5) {
      setState(() => _currentStep++);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _publishOrder() {
    final title = _titleController.text.trim();
    final desc = _descriptionController.text.trim();
    final category = _selectedCategory;
    final price = double.tryParse(_budgetController.text.replaceAll(',', '.').trim()) ?? 0;

    if (category == null || category.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Выберите категорию')));
      return;
    }
    if (title.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Введите заголовок')));
      return;
    }
    if (desc.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Введите описание')));
      return;
    }
    if (price <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Укажите бюджет')));
      return;
    }

    final categoryId = switch (category) {
      'Ремонт' => 1,
      'Электрика' => 2,
      'Сантехника' => 3,
      'Отделка' => 4,
      'Уборка' => 5,
      'Мебель' => 6,
      _ => 1,
    };

    setState(() => _publishing = true);
    ref
        .read(ordersNotifierProvider.notifier)
        .createOrder(
          title: title,
          description: desc,
          price: price,
          categoryId: categoryId,
          deadline: _deadline,
        )
        .then((order) {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Заказ опубликован')),
          );
          context.go('/orders/${order.id}');
        })
        .catchError((e) {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
        })
        .whenComplete(() {
          if (!mounted) return;
          setState(() => _publishing = false);
        });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Создание заказа'),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/orders');
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () {
              // Save as draft
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Сохранено в черновики')),
              );
            },
            child: const Text('Сохранить'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Progress indicator
          _buildProgressIndicator(),
          
          // Form steps
          Expanded(
            child: PageView(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildStep1Category(),
                _buildStep2Description(),
                _buildStep3Budget(),
                _buildStep4Deadline(),
                _buildStep5Location(),
                _buildStep6Review(),
              ],
            ),
          ),
          
          // Navigation buttons
          _buildNavigationButtons(),
        ],
      ),
    );
  }

  Widget _buildProgressIndicator() {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Row(
        children: List.generate(6, (index) {
          final isActive = index == _currentStep;
          final isCompleted = index < _currentStep;
          
          return Expanded(
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    height: 4,
                    decoration: BoxDecoration(
                      color: isCompleted || isActive
                          ? AppColors.primary
                          : Colors.grey[300],
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                if (index < 5) const SizedBox(width: 4),
              ],
            ),
          );
        }),
      ),
    );
  }

  Widget _buildStep1Category() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Выберите категорию',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Это поможет найти подходящих специалистов',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 24),
          
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: _categories.map((category) {
              final isSelected = _selectedCategory == category;
              
              return GestureDetector(
                onTap: () => setState(() => _selectedCategory = category),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    gradient: isSelected ? AppColors.primaryGradient : null,
                    color: isSelected ? null : Colors.grey[100],
                    borderRadius: BorderRadius.circular(25),
                    border: Border.all(
                      color: isSelected ? Colors.transparent : Colors.grey[300]!,
                    ),
                  ),
                  child: Text(
                    category,
                    style: TextStyle(
                      color: isSelected ? Colors.white : Colors.black87,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildStep2Description() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Опишите задачу',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Чем подробнее, тем лучше',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 24),
          
          TextField(
            controller: _titleController,
            decoration: InputDecoration(
              labelText: 'Название заказа',
              hintText: 'Например: Ремонт квартиры 50 м²',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              filled: true,
              fillColor: Colors.grey[50],
            ),
            maxLength: 100,
          ),
          
          const SizedBox(height: 16),
          
          TextField(
            controller: _descriptionController,
            decoration: InputDecoration(
              labelText: 'Подробное описание',
              hintText: 'Опишите, что нужно сделать...',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              filled: true,
              fillColor: Colors.grey[50],
              alignLabelWithHint: true,
            ),
            maxLines: 6,
            maxLength: 1000,
          ),
          
          const SizedBox(height: 16),
          
          // Add photos button
          OutlinedButton.icon(
            onPressed: () {
              _showAddPhotoDialog();
            },
            icon: const Icon(Icons.add_photo_alternate),
            label: const Text('Добавить фото'),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.all(16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          
          if (_selectedImages.isNotEmpty) ...[
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _selectedImages.map((image) {
                return Stack(
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.image, size: 40),
                    ),
                    Positioned(
                      top: 4,
                      right: 4,
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedImages.remove(image)),
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: const BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.close,
                            size: 16,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStep3Budget() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Укажите бюджет',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Это поможет найти подходящих специалистов',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 24),
          
          // Budget type selector
          Container(
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                RadioListTile<String>(
                  value: 'fixed',
                  groupValue: _budgetType,
                  onChanged: (value) => setState(() => _budgetType = value!),
                  title: const Text('Фиксированная цена'),
                  subtitle: const Text('Общая стоимость за весь проект'),
                ),
                RadioListTile<String>(
                  value: 'hourly',
                  groupValue: _budgetType,
                  onChanged: (value) => setState(() => _budgetType = value!),
                  title: const Text('Почасовая оплата'),
                  subtitle: const Text('Оплата за каждый час работы'),
                ),
                RadioListTile<String>(
                  value: 'negotiable',
                  groupValue: _budgetType,
                  onChanged: (value) => setState(() => _budgetType = value!),
                  title: const Text('Договорная'),
                  subtitle: const Text('Обсудим с исполнителем'),
                ),
              ],
            ),
          ),
          
          if (_budgetType != 'negotiable') ...[
            const SizedBox(height: 24),
            TextField(
              controller: _budgetController,
              decoration: InputDecoration(
                labelText: _budgetType == 'hourly' ? 'Ставка в час (₽)' : 'Бюджет (₽)',
                hintText: '0',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[50],
                prefixIcon: const Icon(Icons.payments_outlined),
                suffixText: '₽',
              ),
              keyboardType: TextInputType.number,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStep4Deadline() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Когда нужно выполнить?',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Укажите желаемую дату завершения',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 24),
          
          // Quick options
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _buildQuickDeadlineChip('Сегодня', Duration.zero),
              _buildQuickDeadlineChip('Завтра', const Duration(days: 1)),
              _buildQuickDeadlineChip('Через 3 дня', const Duration(days: 3)),
              _buildQuickDeadlineChip('Через неделю', const Duration(days: 7)),
              _buildQuickDeadlineChip('Через месяц', const Duration(days: 30)),
            ],
          ),
          
          const SizedBox(height: 24),
          
          // Custom date picker
          OutlinedButton.icon(
            onPressed: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: DateTime.now().add(const Duration(days: 7)),
                firstDate: DateTime.now(),
                lastDate: DateTime.now().add(const Duration(days: 365)),
              );
              if (date != null) {
                setState(() => _deadline = date);
              }
            },
            icon: const Icon(Icons.calendar_today),
            label: Text(
              _deadline == null
                  ? 'Выбрать другую дату'
                  : 'Выбрано: ${_deadline!.day}.${_deadline!.month}.${_deadline!.year}',
            ),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.all(16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickDeadlineChip(String label, Duration duration) {
    final date = DateTime.now().add(duration);
    final isSelected = _deadline?.day == date.day && 
                      _deadline?.month == date.month && 
                      _deadline?.year == date.year;
    
    return GestureDetector(
      onTap: () => setState(() => _deadline = date),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          gradient: isSelected ? AppColors.primaryGradient : null,
          color: isSelected ? null : Colors.grey[100],
          borderRadius: BorderRadius.circular(25),
          border: Border.all(
            color: isSelected ? Colors.transparent : Colors.grey[300]!,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.black87,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildStep5Location() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Где выполнять работу?',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Укажите адрес или выберите удалённо',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 24),
          
          SwitchListTile(
            value: _isRemote,
            onChanged: (value) => setState(() => _isRemote = value),
            title: const Text('Удалённая работа'),
            subtitle: const Text('Работа будет выполнена онлайн'),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            tileColor: Colors.grey[50],
          ),
          
          if (!_isRemote) ...[
            const SizedBox(height: 24),
            TextField(
              controller: _addressController,
              decoration: InputDecoration(
                labelText: 'Адрес',
                hintText: 'Город, улица, дом',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: Colors.grey[50],
                prefixIcon: const Icon(Icons.location_on),
              ),
              maxLines: 2,
            ),
            
            const SizedBox(height: 16),
            
            OutlinedButton.icon(
              onPressed: () {
                _showPickLocationDialog();
              },
              icon: const Icon(Icons.map),
              label: const Text('Выбрать на карте'),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.all(16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Future<void> _showAddPhotoDialog() async {
    final controller = TextEditingController();
    final picked = await showModalBottomSheet<String>(
      context: context,
      showDragHandle: true,
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Добавить фото', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                decoration: const InputDecoration(
                  labelText: 'URL фото (необязательно)',
                  hintText: 'https://...',
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context, 'demo'),
                      child: const Text('Демо фото'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context, controller.text.trim()),
                      child: const Text('Добавить'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
            ],
          ),
        );
      },
    );
    controller.dispose();

    if (!mounted) return;
    if (picked == null) return;

    final url = picked == 'demo'
        ? 'https://picsum.photos/seed/order_${DateTime.now().millisecondsSinceEpoch}/240/240'
        : picked;
    if (url.isEmpty) return;

    setState(() => _selectedImages.add(url));
  }

  Future<void> _showPickLocationDialog() async {
    final selected = await showDialog<String>(
      context: context,
      builder: (context) => SimpleDialog(
        title: const Text('Выберите локацию'),
        children: [
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'Москва, ул. Тверская, 1'),
            child: const Text('Москва'),
          ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'Санкт‑Петербург, Невский пр., 10'),
            child: const Text('Санкт‑Петербург'),
          ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'Казань, ул. Баумана, 5'),
            child: const Text('Казань'),
          ),
          SimpleDialogOption(
            onPressed: () => Navigator.pop(context, 'Екатеринбург, пр. Ленина, 12'),
            child: const Text('Екатеринбург'),
          ),
        ],
      ),
    );

    if (!mounted) return;
    if (selected == null || selected.isEmpty) return;
    setState(() => _addressController.text = selected);
    HapticFeedback.lightImpact();
  }

  Widget _buildStep6Review() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Проверьте заказ',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Убедитесь, что всё правильно',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 24),
          
          _buildReviewItem(
            'Категория',
            _selectedCategory ?? 'Не выбрано',
            Icons.category,
          ),
          
          _buildReviewItem(
            'Название',
            _titleController.text.isEmpty ? 'Не указано' : _titleController.text,
            Icons.title,
          ),
          
          _buildReviewItem(
            'Бюджет',
            _budgetType == 'negotiable'
                ? 'Договорная'
                : '${_budgetController.text} ₽ ${_budgetType == 'hourly' ? '/час' : ''}',
            Icons.payments,
          ),
          
          _buildReviewItem(
            'Срок',
            _deadline == null
                ? 'Не указан'
                : '${_deadline!.day}.${_deadline!.month}.${_deadline!.year}',
            Icons.calendar_today,
          ),
          
          _buildReviewItem(
            'Локация',
            _isRemote ? 'Удалённо' : _addressController.text,
            Icons.location_on,
          ),
          
          if (_selectedImages.isNotEmpty)
            _buildReviewItem(
              'Фото',
              '${_selectedImages.length} шт.',
              Icons.image,
            ),
        ],
      ),
    );
  }

  Widget _buildReviewItem(String label, String value, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavigationButtons() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          if (_currentStep > 0)
            Expanded(
              child: OutlinedButton(
                onPressed: _publishing ? null : _previousStep,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.all(16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text('Назад'),
              ),
            ),
          
          if (_currentStep > 0) const SizedBox(width: 12),
          
          Expanded(
            flex: 2,
            child: ElevatedButton(
              onPressed: _publishing ? null : (_currentStep == 5 ? _publishOrder : _nextStep),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.all(16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
              ),
              child: _publishing
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    )
                  : Text(
                      _currentStep == 5 ? 'Опубликовать заказ' : 'Далее',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                        color: Colors.white,
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}




