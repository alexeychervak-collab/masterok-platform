import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:masterok/core/network/api_client.dart';
import 'package:masterok/core/models/user.dart';
import 'dart:convert';
import 'package:masterok/core/services/local_user_db.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref.read(dioProvider), ref.read(localUserDbProvider));
});

class AuthService {
  final Dio _dio;
  final _storage = const FlutterSecureStorage();
  final LocalUserDb _localDb;
  static const _kTokenKey = 'access_token';
  static const _kUserKey = 'current_user_json';

  AuthService(this._dio, this._localDb);

  Future<User> login(String email, String password) async {
    await _localDb.ensureSeeded();
    try {
      final response = await _dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      final token = response.data['access_token'] as String;
      await _storage.write(key: _kTokenKey, value: token);

      final user = User.fromJson(response.data['user'] as Map<String, dynamic>);
      await _storage.write(key: _kUserKey, value: jsonEncode(user.toJson()));
      return user;
    } catch (e) {
      // “Продовый” fallback: логиним через локальную БД (как оффлайн-база).
      final local = await _localDb.login(email: email, password: password);
      if (local != null) {
        await _storage.write(key: _kTokenKey, value: 'local_token');
        await _storage.write(key: _kUserKey, value: jsonEncode(local.toJson()));
        return local;
      }
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
    await _localDb.ensureSeeded();
    try {
      // Сначала создаём пользователя в локальной БД (чтобы “заносило в базу” всегда).
      final localUser = await _localDb.createUser(
        email: email,
        password: password,
        role: role,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      );

      // Пытаемся синхронизировать с backend (если доступен).
      try {
        final response = await _dio.post('/auth/register', data: {
          'email': email,
          'password': password,
          'role': role,
          'first_name': firstName,
          'last_name': lastName,
          'phone': phone,
        });

        final token = response.data['access_token'] as String?;
        if (token != null) {
          await _storage.write(key: _kTokenKey, value: token);
        } else {
          await _storage.write(key: _kTokenKey, value: 'local_token');
        }
      } catch (_) {
        await _storage.write(key: _kTokenKey, value: 'local_token');
      }

      await _storage.write(key: _kUserKey, value: jsonEncode(localUser.toJson()));
      return localUser;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<User?> getCurrentUser() async {
    try {
      await _localDb.ensureSeeded();
      final token = await _storage.read(key: _kTokenKey);
      if (token == null) return null;

      final response = await _dio.get('/auth/me');
      final user = User.fromJson(response.data as Map<String, dynamic>);
      await _storage.write(key: _kUserKey, value: jsonEncode(user.toJson()));
      return user;
    } catch (e) {
      // Если backend недоступен — возвращаем локально сохранённого пользователя.
      return _readStoredUser();
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: _kTokenKey);
    await _storage.delete(key: _kUserKey);
  }

  /// Удаление аккаунта (с безопасным fallback).
  ///
  /// - Пытается удалить аккаунт на backend (если доступен)
  /// - Всегда очищает локальные данные (токен/пользователь)
  Future<void> deleteAccount() async {
    try {
      // Пробуем наиболее вероятные эндпоинты
      try {
        await _dio.delete('/auth/me');
      } catch (_) {
        await _dio.delete('/users/me');
      }
    } catch (_) {
      // Игнорируем сетевые ошибки: локальную очистку делаем в любом случае
    } finally {
      final user = await _readStoredUser();
      if (user != null) {
        try {
          await _localDb.deleteUser(user.id);
        } catch (_) {}
      }
      await logout();
    }
  }

  Future<bool> isPro(int userId) async {
    final until = await _localDb.getProUntil(userId);
    if (until == null) return false;
    return until.isAfter(DateTime.now());
  }

  Future<DateTime?> proUntil(int userId) async {
    return _localDb.getProUntil(userId);
  }

  Future<void> activatePro(int userId, {required Duration duration}) async {
    final until = DateTime.now().add(duration);
    await _localDb.setProUntil(userId, until);
  }

  Future<User?> _readStoredUser() async {
    try {
      final raw = await _storage.read(key: _kUserKey);
      if (raw == null || raw.isEmpty) return null;
      final decoded = jsonDecode(raw);
      if (decoded is! Map<String, dynamic>) return null;
      return User.fromJson(decoded);
    } catch (_) {
      return null;
    }
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




