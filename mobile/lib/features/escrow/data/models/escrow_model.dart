import 'package:equatable/equatable.dart';

enum EscrowStatus {
  created,          // Создан
  fundsHeld,        // Средства заморожены
  workInProgress,   // Работа в процессе
  workCompleted,    // Работа завершена
  disputeOpened,    // Открыт спор
  fundsReleased,    // Средства переведены
  fundsRefunded,    // Возврат средств
}

class EscrowModel extends Equatable {
  final String id;
  final String orderId;
  final String clientId;
  final String specialistId;
  final double amount;
  final double platformFee;
  final double specialistAmount; // amount - platformFee
  final EscrowStatus status;
  final String? paymentId; // ID платежа в ЮKassa
  final DateTime createdAt;
  final DateTime? fundsHeldAt;
  final DateTime? fundsReleasedAt;
  final DateTime? disputeOpenedAt;
  final String? disputeReason;
  final bool autoReleaseEnabled;
  final DateTime? autoReleaseDate;

  const EscrowModel({
    required this.id,
    required this.orderId,
    required this.clientId,
    required this.specialistId,
    required this.amount,
    required this.platformFee,
    required this.specialistAmount,
    required this.status,
    this.paymentId,
    required this.createdAt,
    this.fundsHeldAt,
    this.fundsReleasedAt,
    this.disputeOpenedAt,
    this.disputeReason,
    this.autoReleaseEnabled = true,
    this.autoReleaseDate,
  });

  @override
  List<Object?> get props => [
        id,
        orderId,
        clientId,
        specialistId,
        amount,
        platformFee,
        specialistAmount,
        status,
        paymentId,
        createdAt,
        fundsHeldAt,
        fundsReleasedAt,
        disputeOpenedAt,
        disputeReason,
        autoReleaseEnabled,
        autoReleaseDate,
      ];
}

class DisputeModel extends Equatable {
  final String id;
  final String escrowId;
  final String orderId;
  final String initiatorId;
  final String respondentId;
  final String reason;
  final String description;
  final List<String> evidence; // URLs to evidence files
  final String? resolution;
  final String? adminId;
  final DateTime createdAt;
  final DateTime? resolvedAt;
  final bool isResolved;

  const DisputeModel({
    required this.id,
    required this.escrowId,
    required this.orderId,
    required this.initiatorId,
    required this.respondentId,
    required this.reason,
    required this.description,
    this.evidence = const [],
    this.resolution,
    this.adminId,
    required this.createdAt,
    this.resolvedAt,
    this.isResolved = false,
  });

  @override
  List<Object?> get props => [
        id,
        escrowId,
        orderId,
        initiatorId,
        respondentId,
        reason,
        description,
        evidence,
        resolution,
        adminId,
        createdAt,
        resolvedAt,
        isResolved,
      ];
}




