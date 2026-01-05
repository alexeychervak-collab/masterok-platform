import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yodo/core/models/category.dart';
import 'package:yodo/core/services/categories_service.dart';

// All categories
final categoriesListProvider = FutureProvider.autoDispose<List<Category>>((ref) async {
  final service = ref.read(categoriesServiceProvider);
  return service.getCategories();
});

// Popular categories (first 8)
final popularCategoriesProvider = FutureProvider.autoDispose<List<Category>>((ref) async {
  final service = ref.read(categoriesServiceProvider);
  final categories = await service.getCategories(limit: 8);
  return categories;
});

// Category detail
final categoryDetailProvider = FutureProvider.autoDispose.family<Category, int>((ref, id) async {
  final service = ref.read(categoriesServiceProvider);
  return service.getCategoryById(id);
});

