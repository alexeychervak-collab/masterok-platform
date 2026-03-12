import 'package:equatable/equatable.dart';

class Category extends Equatable {
  final int id;
  final String name;
  final String slug;
  final String? description;
  final String? icon;
  final int servicesCount;

  const Category({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.icon,
    this.servicesCount = 0,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] as int,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String?,
      icon: json['icon'] as String?,
      servicesCount: json['services_count'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'description': description,
      'icon': icon,
      'services_count': servicesCount,
    };
  }

  @override
  List<Object?> get props => [id, name, slug, description, icon, servicesCount];
}



