import 'package:equatable/equatable.dart';

enum TicketPriority {
  low,
  medium,
  high,
  urgent,
}

enum TicketStatus {
  open,
  inProgress,
  waitingForCustomer,
  resolved,
  closed,
}

enum TicketCategory {
  technical,      // Технические проблемы
  payment,        // Проблемы с оплатой
  account,        // Проблемы с аккаунтом
  order,          // Проблемы с заказом
  dispute,        // Споры
  suggestion,     // Предложения
  other,          // Другое
}

class SupportTicketModel extends Equatable {
  final String id;
  final String userId;
  final String? orderId;
  final TicketCategory category;
  final TicketPriority priority;
  final TicketStatus status;
  final String subject;
  final String description;
  final List<String> attachments;
  final String? assignedToAdminId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? resolvedAt;
  final int messagesCount;

  const SupportTicketModel({
    required this.id,
    required this.userId,
    this.orderId,
    required this.category,
    this.priority = TicketPriority.medium,
    this.status = TicketStatus.open,
    required this.subject,
    required this.description,
    this.attachments = const [],
    this.assignedToAdminId,
    required this.createdAt,
    required this.updatedAt,
    this.resolvedAt,
    this.messagesCount = 0,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        orderId,
        category,
        priority,
        status,
        subject,
        description,
        attachments,
        assignedToAdminId,
        createdAt,
        updatedAt,
        resolvedAt,
        messagesCount,
      ];
}

class SupportMessageModel extends Equatable {
  final String id;
  final String ticketId;
  final String senderId;
  final bool isAdmin;
  final String message;
  final List<String> attachments;
  final DateTime createdAt;

  const SupportMessageModel({
    required this.id,
    required this.ticketId,
    required this.senderId,
    required this.isAdmin,
    required this.message,
    this.attachments = const [],
    required this.createdAt,
  });

  @override
  List<Object?> get props => [
        id,
        ticketId,
        senderId,
        isAdmin,
        message,
        attachments,
        createdAt,
      ];
}




