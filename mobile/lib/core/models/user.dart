import 'package:equatable/equatable.dart';

class User extends Equatable {
  final int id;
  final String email;
  final String? phone;
  final String? firstName;
  final String? lastName;
  final String? avatar;
  final String role; // client, specialist, admin
  final DateTime createdAt;

  const User({
    required this.id,
    required this.email,
    this.phone,
    this.firstName,
    this.lastName,
    this.avatar,
    required this.role,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      email: json['email'] as String,
      phone: json['phone'] as String?,
      firstName: json['first_name'] as String?,
      lastName: json['last_name'] as String?,
      avatar: json['avatar'] as String?,
      role: json['role'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'phone': phone,
      'first_name': firstName,
      'last_name': lastName,
      'avatar': avatar,
      'role': role,
      'created_at': createdAt.toIso8601String(),
    };
  }

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();

  @override
  List<Object?> get props => [id, email, phone, firstName, lastName, avatar, role, createdAt];
}

