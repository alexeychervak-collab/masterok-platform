import 'package:equatable/equatable.dart';

class ReviewModel extends Equatable {
  final String id;
  final String orderId;
  final String specialistId;
  final String clientId;
  final double rating;
  final String comment;
  final List<String> images;
  final DateTime createdAt;
  final String? specialistResponse;
  final DateTime? responseDate;
  final int likesCount;
  final bool isVerified;
  
  // Оценки по категориям (как на Profi.ru)
  final double? qualityRating;
  final double? timelinessRating;
  final double? communicationRating;
  final double? priceRating;

  const ReviewModel({
    required this.id,
    required this.orderId,
    required this.specialistId,
    required this.clientId,
    required this.rating,
    required this.comment,
    this.images = const [],
    required this.createdAt,
    this.specialistResponse,
    this.responseDate,
    this.likesCount = 0,
    this.isVerified = false,
    this.qualityRating,
    this.timelinessRating,
    this.communicationRating,
    this.priceRating,
  });

  @override
  List<Object?> get props => [
        id,
        orderId,
        specialistId,
        clientId,
        rating,
        comment,
        images,
        createdAt,
        specialistResponse,
        responseDate,
        likesCount,
        isVerified,
        qualityRating,
        timelinessRating,
        communicationRating,
        priceRating,
      ];
}

class ReviewStatistics extends Equatable {
  final int totalReviews;
  final double averageRating;
  final Map<int, int> ratingDistribution; // {5: 150, 4: 80, 3: 20, 2: 5, 1: 2}
  final double averageQuality;
  final double averageTimeliness;
  final double averageCommunication;
  final double averagePrice;
  final int verifiedReviews;

  const ReviewStatistics({
    required this.totalReviews,
    required this.averageRating,
    required this.ratingDistribution,
    required this.averageQuality,
    required this.averageTimeliness,
    required this.averageCommunication,
    required this.averagePrice,
    required this.verifiedReviews,
  });

  @override
  List<Object?> get props => [
        totalReviews,
        averageRating,
        ratingDistribution,
        averageQuality,
        averageTimeliness,
        averageCommunication,
        averagePrice,
        verifiedReviews,
      ];
}




