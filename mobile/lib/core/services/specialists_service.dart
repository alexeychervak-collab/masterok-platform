import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yodo/core/network/api_client.dart';
import 'package:yodo/core/models/specialist.dart';
import 'package:yodo/core/models/review.dart';

final specialistsServiceProvider = Provider<SpecialistsService>((ref) {
  return SpecialistsService(ref.read(dioProvider));
});

class SpecialistsService {
  final Dio _dio;

  SpecialistsService(this._dio);

  Future<List<Specialist>> getSpecialists({
    String? category,
    String? search,
    int? minRating,
    int skip = 0,
    int limit = 20,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'skip': skip,
        'limit': limit,
      };
      
      if (category != null) queryParams['category'] = category;
      if (search != null) queryParams['search'] = search;
      if (minRating != null) queryParams['min_rating'] = minRating;

      final response = await _dio.get('/specialists', queryParameters: queryParams);
      
      final List<dynamic> data = response.data as List<dynamic>;
      return data.map((json) => Specialist.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Specialist> getSpecialistById(int id) async {
    try {
      final response = await _dio.get('/specialists/$id');
      return Specialist.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Review>> getSpecialistReviews(int specialistId, {int skip = 0, int limit = 20}) async {
    try {
      final response = await _dio.get(
        '/specialists/$specialistId/reviews',
        queryParameters: {'skip': skip, 'limit': limit},
      );
      
      final List<dynamic> data = response.data as List<dynamic>;
      return data.map((json) => Review.fromJson(json as Map<String, dynamic>)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  String _handleError(dynamic error) {
    if (error is DioException) {
      if (error.response?.statusCode == 404) {
        return 'Специалист не найден';
      }
    }
    return 'Произошла ошибка при загрузке данных';
  }
}

