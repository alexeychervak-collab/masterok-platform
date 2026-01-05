import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:yodo/core/network/api_client.dart';
import 'package:yodo/core/models/user.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.read(dioProvider));
});

class AuthService {
  final Dio _dio;
  final _storage = const FlutterSecureStorage();

  AuthService(this._dio);

  Future<User> login(String email, String password) async {
    try {
      final response = await _dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      final token = response.data['access_token'] as String;
      await _storage.write(key: 'access_token', value: token);

      return User.fromJson(response.data['user'] as Map<String, dynamic>);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<User> register({
    required String email,
    required String password,
    required String role,
    String? firstName,
    String? lastName,
    String? phone,
  }) async {
    try {
      final response = await _dio.post('/auth/register', data: {
        'email': email,
        'password': password,
        'role': role,
        'first_name': firstName,
        'last_name': lastName,
        'phone': phone,
      });

      final token = response.data['access_token'] as String;
      await _storage.write(key: 'access_token', value: token);

      return User.fromJson(response.data['user'] as Map<String, dynamic>);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<User?> getCurrentUser() async {
    try {
      final token = await _storage.read(key: 'access_token');
      if (token == null) return null;

      final response = await _dio.get('/auth/me');
      return User.fromJson(response.data as Map<String, dynamic>);
    } catch (e) {
      return null;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'access_token');
  }

  String _handleError(dynamic error) {
    if (error is DioException) {
      if (error.response?.statusCode == 400) {
        return error.response?.data['detail'] ?? 'Неверные данные';
      } else if (error.response?.statusCode == 401) {
        return 'Неверный email или пароль';
      } else if (error.response?.statusCode == 422) {
        return 'Проверьте правильность введенных данных';
      }
    }
    return 'Произошла ошибка. Попробуйте позже';
  }
}

