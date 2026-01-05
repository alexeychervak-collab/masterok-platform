import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/foundation.dart';
import 'dart:developer' as developer;

/// Firebase Service для STROYKA
/// Push-уведомления, Analytics, Crashlytics
class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();
  factory FirebaseService() => _instance;
  FirebaseService._internal();

  FirebaseMessaging? _messaging;
  FirebaseAnalytics? _analytics;
  FirebaseCrashlytics? _crashlytics;

  String? _fcmToken;
  String? get fcmToken => _fcmToken;

  /// Инициализация Firebase
  Future<void> initialize() async {
    try {
      // Инициализация Firebase Core
      await Firebase.initializeApp();
      
      _messaging = FirebaseMessaging.instance;
      _analytics = FirebaseAnalytics.instance;
      _crashlytics = FirebaseCrashlytics.instance;

      developer.log('Firebase initialized', name: 'FirebaseService');

      // Настройка Crashlytics
      await _setupCrashlytics();

      // Настройка Push-уведомлений
      await _setupPushNotifications();

      // Настройка Analytics
      await _setupAnalytics();
    } catch (e) {
      developer.log('Firebase init error: $e', name: 'FirebaseService');
    }
  }

  /// Настройка Crashlytics
  Future<void> _setupCrashlytics() async {
    if (_crashlytics == null) return;

    // Включаем автоматическую отправку крашей
    await _crashlytics!.setCrashlyticsCollectionEnabled(!kDebugMode);

    // Передаём Flutter ошибки в Crashlytics
    FlutterError.onError = _crashlytics!.recordFlutterFatalError;

    // Передаём асинхронные ошибки
    PlatformDispatcher.instance.onError = (error, stack) {
      _crashlytics!.recordError(error, stack, fatal: true);
      return true;
    };

    developer.log('Crashlytics configured', name: 'FirebaseService');
  }

  /// Настройка Push-уведомлений
  Future<void> _setupPushNotifications() async {
    if (_messaging == null) return;

    // Запрос разрешений
    final settings = await _messaging!.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      developer.log('Push permissions granted', name: 'FirebaseService');
    } else {
      developer.log('Push permissions denied', name: 'FirebaseService');
      return;
    }

    // Получить FCM токен
    _fcmToken = await _messaging!.getToken();
    developer.log('FCM Token: $_fcmToken', name: 'FirebaseService');

    // Слушать обновления токена
    _messaging!.onTokenRefresh.listen((newToken) {
      _fcmToken = newToken;
      developer.log('FCM Token refreshed', name: 'FirebaseService');
      // TODO: Отправить новый токен на backend
    });

    // Обработка foreground сообщений
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // Обработка background сообщений
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // Обработка нажатия на уведомление
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);

    // Проверка, было ли приложение открыто из уведомления
    final initialMessage = await _messaging!.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage);
    }

    developer.log('Push notifications configured', name: 'FirebaseService');
  }

  /// Обработка сообщения в foreground
  void _handleForegroundMessage(RemoteMessage message) {
    developer.log(
      'Foreground message: ${message.notification?.title}',
      name: 'FirebaseService',
    );

    // TODO: Показать локальное уведомление
    // Используйте flutter_local_notifications
  }

  /// Обработка нажатия на уведомление
  void _handleNotificationTap(RemoteMessage message) {
    final data = message.data;
    developer.log(
      'Notification tapped: ${data['type']}',
      name: 'FirebaseService',
    );

    // TODO: Навигация по типу уведомления
    // Примеры:
    // if (data['type'] == 'new_order') {
    //   navigatorKey.currentState?.pushNamed('/orders/${data['order_id']}');
    // } else if (data['type'] == 'new_message') {
    //   navigatorKey.currentState?.pushNamed('/chat/${data['chat_id']}');
    // }
  }

  /// Настройка Analytics
  Future<void> _setupAnalytics() async {
    if (_analytics == null) return;

    await _analytics!.setAnalyticsCollectionEnabled(!kDebugMode);
    developer.log('Analytics configured', name: 'FirebaseService');
  }

  /// Отправить FCM токен на backend
  Future<void> sendTokenToBackend(String token, {required String userId}) async {
    // TODO: Реализовать отправку на backend
    developer.log(
      'Sending FCM token to backend for user $userId',
      name: 'FirebaseService',
    );
  }

  /// Log событие в Analytics
  Future<void> logEvent(String name, {Map<String, dynamic>? parameters}) async {
    if (_analytics == null) return;
    
    await _analytics!.logEvent(
      name: name,
      parameters: parameters,
    );
  }

  /// Log ошибку в Crashlytics
  Future<void> logError(dynamic exception, StackTrace? stackTrace) async {
    if (_crashlytics == null) return;
    
    await _crashlytics!.recordError(exception, stackTrace);
  }

  /// Установить user ID для аналитики
  Future<void> setUserId(String userId) async {
    await _analytics?.setUserId(id: userId);
    await _crashlytics?.setUserIdentifier(userId);
  }

  /// Очистить user ID при выходе
  Future<void> clearUserId() async {
    await _analytics?.setUserId(id: null);
    await _crashlytics?.setUserIdentifier('');
  }
}

/// Background handler для push-уведомлений
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  
  developer.log(
    'Background message: ${message.notification?.title}',
    name: 'FirebaseService',
  );
  
  // TODO: Обработка background уведомлений
}

