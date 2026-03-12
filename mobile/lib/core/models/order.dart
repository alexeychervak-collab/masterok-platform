import 'package:equatable/equatable.dart';
import 'package:masterok/core/models/specialist.dart';

enum OrderStatus {
  pending,
  accepted,
  inProgress,
  completed,
  cancelled,
  disputed;

  String get displayName {
    switch (this) {
      case OrderStatus.pending:
        return 'Ожидает';
      case OrderStatus.accepted:
        return 'Принят';
      case OrderStatus.inProgress:
        return 'В работе';
      case OrderStatus.completed:
        return 'Завершен';
      case OrderStatus.cancelled:
        return 'Отменен';
      case OrderStatus.disputed:
        return 'Спор';
    }
  }
}

class Order extends Equatable {
  final int id;
  final String title;
  final String description;
  final OrderStatus status;
  final double price;
  final DateTime createdAt;
  final DateTime? deadline;
  final Specialist? specialist;
  final String categoryName;
  final int clientId;

  const Order({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.price,
    required this.createdAt,
    this.deadline,
    this.specialist,
    required this.categoryName,
    required this.clientId,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    OrderStatus status;
    final rawStatus = (json['status'] as String?) ?? 'pending';
    switch (rawStatus) {
      case 'accepted':
        status = OrderStatus.accepted;
        break;
      case 'in_progress':
      case 'inProgress':
        status = OrderStatus.inProgress;
        break;
      case 'completed':
        status = OrderStatus.completed;
        break;
      case 'cancelled':
        status = OrderStatus.cancelled;
        break;
      case 'disputed':
        status = OrderStatus.disputed;
        break;
      default:
        status = OrderStatus.pending;
    }

    return Order(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      status: status,
      price: (json['price'] as num).toDouble(),
      createdAt: DateTime.parse(json['created_at'] as String),
      deadline: json['deadline'] != null ? DateTime.parse(json['deadline'] as String) : null,
      specialist: json['specialist'] != null ? Specialist.fromJson(json['specialist'] as Map<String, dynamic>) : null,
      categoryName: json['category_name'] as String? ?? 'Без категории',
      clientId: json['client_id'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    final statusValue = switch (status) {
      OrderStatus.pending => 'pending',
      OrderStatus.accepted => 'accepted',
      OrderStatus.inProgress => 'in_progress',
      OrderStatus.completed => 'completed',
      OrderStatus.cancelled => 'cancelled',
      OrderStatus.disputed => 'disputed',
    };
    return {
      'id': id,
      'title': title,
      'description': description,
      'status': statusValue,
      'price': price,
      'created_at': createdAt.toIso8601String(),
      'deadline': deadline?.toIso8601String(),
      'specialist': specialist?.toJson(),
      'category_name': categoryName,
      'client_id': clientId,
    };
  }

  @override
  List<Object?> get props => [
        id,
        title,
        description,
        status,
        price,
        createdAt,
        deadline,
        specialist,
        categoryName,
        clientId,
      ];
}




