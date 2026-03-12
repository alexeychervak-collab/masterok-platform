import 'package:equatable/equatable.dart';

class Review extends Equatable {
  final int id;
  final int specialistId;
  final String clientName;
  final String? clientAvatar;
  final double rating;
  final String comment;
  final DateTime createdAt;

  const Review({
    required this.id,
    required this.specialistId,
    required this.clientName,
    this.clientAvatar,
    required this.rating,
    required this.comment,
    required this.createdAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] as int,
      specialistId: json['specialist_id'] as int,
      clientName: json['client_name'] as String,
      clientAvatar: json['client_avatar'] as String?,
      rating: (json['rating'] as num).toDouble(),
      comment: json['comment'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'specialist_id': specialistId,
      'client_name': clientName,
      'client_avatar': clientAvatar,
      'rating': rating,
      'comment': comment,
      'created_at': createdAt.toIso8601String(),
    };
  }

  @override
  List<Object?> get props => [id, specialistId, clientName, clientAvatar, rating, comment, createdAt];
}



