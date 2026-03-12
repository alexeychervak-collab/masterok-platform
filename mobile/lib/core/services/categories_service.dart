import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:masterok/core/network/api_client.dart';
import 'package:masterok/core/models/category.dart';

final categoriesServiceProvider = Provider<CategoriesService>((ref) {
  return CategoriesService(ref.read(dioProvider));
});

class CategoriesService {
  final Dio _dio;

  CategoriesService(this._dio);

  Future<List<Category>> getCategories({int skip = 0, int limit = 50}) async {
    try {
      final response = await _dio.get('/categories', queryParameters: {
        'skip': skip,
        'limit': limit,
      });
      
      final List<dynamic> data = response.data as List<dynamic>;
      return data.map((json) => Category.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Category> getCategoryById(int id) async {
    try {
      final response = await _dio.get('/categories/$id');
      return Category.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      throw _handleError(e);
    }
  }

  String _handleError(dynamic error) {
    if (error is DioException) {
      if (error.response?.statusCode == 404) {
        return 'Категория не найдена';
      }
    }
    return 'Произошла ошибка при загрузке категорий';
  }
}




