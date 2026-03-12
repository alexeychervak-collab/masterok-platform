import 'package:equatable/equatable.dart';

enum OrderStatus {
  draft,          // Черновик
  published,      // Опубликован
  inProgress,     // В работе
  awaitingReview, // Ожидает проверки
  completed,      // Завершён
  cancelled,      // Отменён
  disputed,       // Спор
}

enum PaymentStatus {
  pending,    // Ожидает оплаты
  held,       // Деньги заморожены (эскроу)
  released,   // Деньги переведены исполнителю
  refunded,   // Возврат средств
}

class OrderModel extends Equatable {
  final String id;
  final String title;
  final String description;
  final String category;
  final double budget;
  final String? budgetType; // fixed, hourly, negotiable
  final DateTime deadline;
  final String clientId;
  final String? specialistId;
  final OrderStatus status;
  final PaymentStatus paymentStatus;
  final List<String> requirements;
  final List<String> images;
  final String? address;
  final bool isRemote;
  final DateTime createdAt;
  final DateTime updatedAt;
  final int viewsCount;
  final int responsesCount;

  const OrderModel({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.budget,
    this.budgetType = 'fixed',
    required this.deadline,
    required this.clientId,
    this.specialistId,
    required this.status,
    required this.paymentStatus,
    this.requirements = const [],
    this.images = const [],
    this.address,
    this.isRemote = false,
    required this.createdAt,
    required this.updatedAt,
    this.viewsCount = 0,
    this.responsesCount = 0,
  });

  @override
  List<Object?> get props => [
        id,
        title,
        description,
        category,
        budget,
        budgetType,
        deadline,
        clientId,
        specialistId,
        status,
        paymentStatus,
        requirements,
        images,
        address,
        isRemote,
        createdAt,
        updatedAt,
        viewsCount,
        responsesCount,
      ];
}




