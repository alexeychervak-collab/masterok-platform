import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:masterok/core/theme/app_colors.dart';

class OrdersListPage extends StatefulWidget {
  const OrdersListPage({super.key});

  @override
  State<OrdersListPage> createState() => _OrdersListPageState();
}

class _OrdersListPageState extends State<OrdersListPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  // Mock orders
  final List<Map<String, dynamic>> _activeOrders = [
    {
      'id': '12345',
      'title': 'Ремонт квартиры 50 м²',
      'category': 'Ремонт',
      'status': 'inProgress',
      'price': 15000,
      'responses': 0,
      'specialist': {
        'name': 'Алексей Петров',
        'avatar': '👨‍🔧',
      },
      'deadline': DateTime.now().add(const Duration(days: 3)),
      'createdAt': DateTime.now().subtract(const Duration(days: 2)),
    },
    {
      'id': '12346',
      'title': 'Установка кондиционера',
      'category': 'Техника',
      'status': 'published',
      'price': 5000,
      'responses': 7,
      'specialist': null,
      'deadline': DateTime.now().add(const Duration(days: 1)),
      'createdAt': DateTime.now().subtract(const Duration(hours: 6)),
    },
  ];

  final List<Map<String, dynamic>> _completedOrders = [
    {
      'id': '12340',
      'title': 'Сантехнические работы',
      'category': 'Сантехника',
      'status': 'completed',
      'price': 8000,
      'specialist': {
        'name': 'Дмитрий Смирнов',
        'avatar': '👨‍🔧',
      },
      'completedAt': DateTime.now().subtract(const Duration(days: 5)),
      'hasReview': true,
    },
    {
      'id': '12341',
      'title': 'Электрика в гараже',
      'category': 'Электрика',
      'status': 'completed',
      'price': 12000,
      'specialist': {
        'name': 'Иван Петров',
        'avatar': '⚡',
      },
      'completedAt': DateTime.now().subtract(const Duration(days: 15)),
      'hasReview': false,
    },
  ];

  final List<Map<String, dynamic>> _draftOrders = [
    {
      'id': 'draft1',
      'title': 'Покраска стен',
      'category': 'Отделка',
      'status': 'draft',
      'updatedAt': DateTime.now().subtract(const Duration(hours: 3)),
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Мои заказы'),
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primary,
          labelColor: AppColors.primary,
          unselectedLabelColor: Colors.grey,
          tabs: [
            Tab(
              text: 'Активные (${_activeOrders.length})',
            ),
            Tab(
              text: 'Завершённые (${_completedOrders.length})',
            ),
            Tab(
              text: 'Черновики (${_draftOrders.length})',
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildOrdersList(_activeOrders, 'active'),
          _buildOrdersList(_completedOrders, 'completed'),
          _buildOrdersList(_draftOrders, 'draft'),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/orders/create'),
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add),
        label: const Text('Создать заказ'),
      ),
    );
  }

  Widget _buildOrdersList(List<Map<String, dynamic>> orders, String type) {
    if (orders.isEmpty) {
      return _buildEmptyState(type);
    }
    
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      itemBuilder: (context, index) {
        final order = orders[index];
        return _buildOrderCard(order, type);
      },
    );
  }

  Widget _buildOrderCard(Map<String, dynamic> order, String type) {
    return GestureDetector(
      onTap: () {
        if (type == 'draft') {
          context.push('/orders/create?draftId=${order['id']}');
        } else {
          context.push('/orders/${order['id']}');
        }
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 15,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.primary.withOpacity(0.1),
                    AppColors.secondary.withOpacity(0.05),
                  ],
                ),
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      order['category'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  
                  const Spacer(),
                  
                  _buildStatusBadge(order['status']),
                ],
              ),
            ),
            
            // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    order['title'],
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  
                  const SizedBox(height: 12),
                  
                  if (type == 'active') ...[
                    if (order['specialist'] != null)
                      _buildSpecialistRow(order['specialist'])
                    else
                      _buildResponsesRow(order['responses']),
                    
                    const SizedBox(height: 12),
                  ],
                  
                  if (type == 'completed') ...[
                    _buildSpecialistRow(order['specialist']),
                    const SizedBox(height: 12),
                  ],
                  
                  Row(
                    children: [
                      Icon(
                        Icons.payments,
                        size: 20,
                        color: AppColors.primary,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${order['price']} ₽',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                      
                      const Spacer(),
                      
                      if (type == 'active' && order['deadline'] != null) ...[
                        Icon(
                          Icons.access_time,
                          size: 16,
                          color: Colors.grey[600],
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _formatDeadline(order['deadline']),
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                      
                      if (type == 'completed') ...[
                        Icon(
                          Icons.check_circle,
                          size: 16,
                          color: Colors.green,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _formatDate(order['completedAt']),
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                      
                      if (type == 'draft') ...[
                        Icon(
                          Icons.edit,
                          size: 16,
                          color: Colors.grey[600],
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _formatDate(order['updatedAt']),
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
            
            // Actions
            if (type == 'active')
              Container(
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(color: Colors.grey[200]!),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextButton.icon(
                        onPressed: () {
                          context.push('/orders/${order['id']}');
                        },
                        icon: const Icon(Icons.visibility_outlined),
                        label: const Text('Подробнее'),
                      ),
                    ),
                    
                    Container(width: 1, height: 40, color: Colors.grey[200]),
                    
                    if (order['specialist'] != null)
                      Expanded(
                        child: TextButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Открыть чат')),
                            );
                          },
                          icon: const Icon(Icons.chat_bubble_outline),
                          label: const Text('Чат'),
                        ),
                      )
                    else
                      Expanded(
                        child: TextButton.icon(
                          onPressed: () {
                            context.push('/orders/${order['id']}/responses');
                          },
                          icon: const Icon(Icons.people_outline),
                          label: Text('Отклики (${order['responses']})'),
                        ),
                      ),
                  ],
                ),
              ),
            
            if (type == 'completed')
              Container(
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(color: Colors.grey[200]!),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextButton.icon(
                        onPressed: () {
                          context.push('/orders/${order['id']}');
                        },
                        icon: const Icon(Icons.visibility_outlined),
                        label: const Text('Подробнее'),
                      ),
                    ),
                    
                    Container(width: 1, height: 40, color: Colors.grey[200]),
                    
                    Expanded(
                      child: TextButton.icon(
                        onPressed: () {
                          if (!order['hasReview']) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Форма отзыва')),
                            );
                          }
                        },
                        icon: Icon(
                          order['hasReview'] ? Icons.star : Icons.star_outline,
                        ),
                        label: Text(order['hasReview'] ? 'Отзыв' : 'Оценить'),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    String label;
    Color color;
    
    switch (status) {
      case 'published':
        label = 'Опубликован';
        color = Colors.blue;
        break;
      case 'inProgress':
        label = 'В работе';
        color = Colors.orange;
        break;
      case 'completed':
        label = 'Завершён';
        color = Colors.green;
        break;
      case 'draft':
        label = 'Черновик';
        color = Colors.grey;
        break;
      default:
        label = status;
        color = Colors.grey;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildSpecialistRow(Map<String, dynamic> specialist) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            gradient: AppColors.primaryGradient,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              specialist['avatar'],
              style: const TextStyle(fontSize: 16),
            ),
          ),
        ),
        
        const SizedBox(width: 8),
        
        Text(
          specialist['name'],
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildResponsesRow(int count) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.people,
            size: 16,
            color: AppColors.primary,
          ),
        ),
        
        const SizedBox(width: 8),
        
        Text(
          count > 0 ? '$count откликов' : 'Нет откликов',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: count > 0 ? AppColors.primary : Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(String type) {
    String title;
    String subtitle;
    IconData icon;
    
    switch (type) {
      case 'active':
        title = 'Нет активных заказов';
        subtitle = 'Создайте первый заказ';
        icon = Icons.work_outline;
        break;
      case 'completed':
        title = 'Нет завершённых заказов';
        subtitle = 'История появится после выполнения';
        icon = Icons.history;
        break;
      case 'draft':
        title = 'Нет черновиков';
        subtitle = 'Сохранённые заказы появятся здесь';
        icon = Icons.drafts_outlined;
        break;
      default:
        title = 'Пусто';
        subtitle = '';
        icon = Icons.inbox_outlined;
    }
    
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 80,
            color: Colors.grey[300],
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: TextStyle(
              color: Colors.grey[500],
            ),
          ),
          
          if (type == 'active') ...[
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => context.push('/orders/create'),
              icon: const Icon(Icons.add),
              label: const Text('Создать заказ'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  String _formatDeadline(DateTime date) {
    final now = DateTime.now();
    final difference = date.difference(now);
    
    if (difference.inDays == 0) {
      return 'Сегодня';
    } else if (difference.inDays == 1) {
      return 'Завтра';
    } else {
      return 'Через ${difference.inDays} дн.';
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inHours < 24) {
      return '${difference.inHours} ч. назад';
    } else if (difference.inDays < 30) {
      return '${difference.inDays} дн. назад';
    } else {
      return '${date.day}.${date.month}.${date.year}';
    }
  }
}

