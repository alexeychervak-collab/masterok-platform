import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:masterok/core/models/category.dart';
import 'package:masterok/core/services/categories_service.dart';
import 'package:masterok/core/data/mock_data.dart';

// All categories (with fallback to mock data)
final categoriesListProvider = FutureProvider.autoDispose<List<Category>>((ref) async {
  try {
    final service = ref.read(categoriesServiceProvider);
    return await service.getCategories();
  } catch (e) {
    // Fallback to mock data if API is unavailable
    return MockData.categories;
  }
});

// Popular categories (first 8, with fallback to mock data)
final popularCategoriesProvider = FutureProvider.autoDispose<List<Category>>((ref) async {
  try {
    final service = ref.read(categoriesServiceProvider);
    final categories = await service.getCategories(limit: 8);
    return categories;
  } catch (e) {
    // Fallback to mock data
    return MockData.categories.take(8).toList();
  }
});

// Category detail (with fallback to mock data)
final categoryDetailProvider = FutureProvider.autoDispose.family<Category, int>((ref, id) async {
  try {
    final service = ref.read(categoriesServiceProvider);
    return await service.getCategoryById(id);
  } catch (e) {
    // Fallback to mock data
    return MockData.categories.firstWhere((c) => c.id == id);
  }
});





