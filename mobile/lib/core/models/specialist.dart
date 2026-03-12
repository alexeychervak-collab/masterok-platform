import 'package:equatable/equatable.dart';

class Specialist extends Equatable {
  final int id;
  final String firstName;
  final String lastName;
  final String? avatar;
  final String title;
  final String? bio;
  final double rating;
  final int reviewsCount;
  final int completedOrders;
  final String? city;
  final List<String> skills;
  final List<String> languages;
  final double? hourlyRate;
  final bool isVerified;
  final bool isOnline;
  final DateTime createdAt;

  const Specialist({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.avatar,
    required this.title,
    this.bio,
    required this.rating,
    required this.reviewsCount,
    required this.completedOrders,
    this.city,
    this.skills = const [],
    this.languages = const [],
    this.hourlyRate,
    this.isVerified = false,
    this.isOnline = false,
    required this.createdAt,
  });

  factory Specialist.fromJson(Map<String, dynamic> json) {
    return Specialist(
      id: json['id'] as int,
      firstName: json['first_name'] as String,
      lastName: json['last_name'] as String,
      avatar: json['avatar'] as String?,
      title: json['title'] as String,
      bio: json['bio'] as String?,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewsCount: json['reviews_count'] as int? ?? 0,
      completedOrders: json['completed_orders'] as int? ?? 0,
      city: json['city'] as String?,
      skills: (json['skills'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
      languages: (json['languages'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
      hourlyRate: (json['hourly_rate'] as num?)?.toDouble(),
      isVerified: json['is_verified'] as bool? ?? false,
      isOnline: json['is_online'] as bool? ?? false,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'first_name': firstName,
      'last_name': lastName,
      'avatar': avatar,
      'title': title,
      'bio': bio,
      'rating': rating,
      'reviews_count': reviewsCount,
      'completed_orders': completedOrders,
      'city': city,
      'skills': skills,
      'languages': languages,
      'hourly_rate': hourlyRate,
      'is_verified': isVerified,
      'is_online': isOnline,
      'created_at': createdAt.toIso8601String(),
    };
  }

  String get fullName => '$firstName $lastName';

  @override
  List<Object?> get props => [
        id,
        firstName,
        lastName,
        avatar,
        title,
        bio,
        rating,
        reviewsCount,
        completedOrders,
        city,
        skills,
        languages,
        hourlyRate,
        isVerified,
        isOnline,
        createdAt,
      ];
}



