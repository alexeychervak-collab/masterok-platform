import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:developer' as developer;
import 'package:masterok/core/constants/app_constants.dart';

/// API URL
///
/// Можно переопределить при сборке:
/// flutter build apk --release --dart-define=API_BASE_URL=https://your-host/api/v1
const String baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: '${AppConstants.baseUrl}/api/v1',
);

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      // Быстрее “падаем” в fallback, чтобы UI не висел на плохом интернете/без backend
      connectTimeout: const Duration(seconds: 8),
      receiveTimeout: const Duration(seconds: 8),
      sendTimeout: const Duration(seconds: 8),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: (status) {
        // Считаем успешными только 2xx, остальное уходит в DioException
        return status != null && status >= 200 && status < 300;
      },
    ),
  );
  
  dio.interceptors.add(AuthInterceptor(ref));
  dio.interceptors.add(ErrorInterceptor());
  
  // Логирование только в debug режиме (в release сильно тормозит)
  if (kDebugMode) {
    dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      logPrint: (obj) => developer.log(obj.toString(), name: 'API'),
    ));
  }
  
  return dio;
});

class AuthInterceptor extends Interceptor {
  final Ref ref;
  final _storage = const FlutterSecureStorage();

  AuthInterceptor(this.ref);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    try {
      final token = await _storage.read(key: 'access_token');
      if (token != null) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    } catch (e) {
      developer.log('Error reading token: $e', name: 'AuthInterceptor');
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Handle token expiration
      _storage.delete(key: 'access_token');
      developer.log('Token expired, cleared', name: 'AuthInterceptor');
    }
    handler.next(err);
  }
}

/// Улучшенный обработчик ошибок API
class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    String errorMessage = 'Произошла ошибка';
    
    if (err.type == DioExceptionType.connectionTimeout ||
        err.type == DioExceptionType.sendTimeout ||
        err.type == DioExceptionType.receiveTimeout) {
      errorMessage = 'Превышено время ожидания. Проверьте подключение к интернету';
    } else if (err.type == DioExceptionType.connectionError) {
      errorMessage = 'Ошибка подключения. Проверьте интернет';
    } else if (err.response != null) {
      final statusCode = err.response!.statusCode;
      switch (statusCode) {
        case 400:
          errorMessage = 'Неверный запрос';
          break;
        case 401:
          errorMessage = 'Необходима авторизация';
          break;
        case 403:
          errorMessage = 'Доступ запрещен';
          break;
        case 404:
          errorMessage = 'Данные не найдены';
          break;
        case 500:
          errorMessage = 'Ошибка сервера';
          break;
        case 503:
          errorMessage = 'Сервис временно недоступен';
          break;
      }
    }
    
    developer.log(
      'API Error: $errorMessage',
      name: 'ErrorInterceptor',
      error: err,
    );
    
    handler.next(err);
  }
}




