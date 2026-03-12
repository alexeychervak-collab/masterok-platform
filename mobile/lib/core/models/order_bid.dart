import 'package:equatable/equatable.dart';

enum BidStatus { pending, accepted, rejected }

class OrderBid extends Equatable {
  final String id;
  final String orderId;
  final String specialistId;
  final String specialistName;
  final String? specialistAvatar;
  final double? specialistRating;
  final int? specialistReviewsCount;
  final double price;
  final String? timeline;
  final String? message;
  final BidStatus status;
  final DateTime createdAt;

  const OrderBid({
    required this.id,
    required this.orderId,
    required this.specialistId,
    required this.specialistName,
    this.specialistAvatar,
    this.specialistRating,
    this.specialistReviewsCount,
    required this.price,
    this.timeline,
    this.message,
    this.status = BidStatus.pending,
    required this.createdAt,
  });

  factory OrderBid.fromJson(Map<String, dynamic> json) {
    final specialist = json['specialist'] as Map<String, dynamic>?;
    return OrderBid(
      id: json['id'] as String,
      orderId: json['order_id'] as String,
      specialistId: json['specialist_id'] as String,
      specialistName: specialist?['name'] as String? ?? 'Специалист',
      specialistAvatar: specialist?['avatar'] as String?,
      specialistRating: (specialist?['rating'] as num?)?.toDouble(),
      specialistReviewsCount: specialist?['review_count'] as int?,
      price: (json['price'] as num).toDouble(),
      timeline: json['timeline'] as String?,
      message: json['message'] as String?,
      status: BidStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => BidStatus.pending,
      ),
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'order_id': orderId,
    'specialist_id': specialistId,
    'price': price,
    'timeline': timeline,
    'message': message,
    'status': status.name,
  };

  @override
  List<Object?> get props => [id, orderId, specialistId, price, status];
}
