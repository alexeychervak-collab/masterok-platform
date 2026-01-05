import 'package:yookassa_payments_flutter/yookassa_payments_flutter.dart';
import 'package:flutter/material.dart';
import 'dart:developer' as developer;

/// YooKassa Payment Service для STROYKA
/// Интеграция безопасных платежей с эскроу
class YooKassaService {
  static const String _clientApplicationKey = 'test_YOUR_CLIENT_KEY'; // Заменить на реальный
  static const String _shopId = 'YOUR_SHOP_ID'; // Заменить на реальный
  static const String _returnUrl = 'stroyka://payment/success';

  /// Инициализация YooKassa SDK
  Future<void> initialize() async {
    try {
      developer.log('YooKassa initialized', name: 'YooKassaService');
    } catch (e) {
      developer.log('YooKassa init error: $e', name: 'YooKassaService');
    }
  }

  /// Обработка платежа
  /// 
  /// [orderId] - ID заказа
  /// [amount] - Сумма в рублях
  /// [description] - Описание платежа
  /// 
  /// Возвращает payment_token для отправки на backend
  Future<String?> processPayment({
    required int orderId,
    required double amount,
    required String description,
    String? customerEmail,
    String? customerPhone,
  }) async {
    try {
      // Настройки токенизации
      final tokenizationSettings = TokenizationSettings(
        clientApplicationKey: _clientApplicationKey,
        shopId: _shopId,
        purchaseDescription: description,
        amount: Amount(value: amount, currency: Currency.rub),
        savePaymentMethod: SavePaymentMethod.userSelects,
        // Способы оплаты
        paymentMethodTypes: PaymentMethodTypes(
          bankCard: true,
          sberbank: true,
          yooMoney: true,
        ),
        // Данные клиента
        customerId: customerEmail ?? customerPhone,
        // Google Pay (опционально)
        googlePayParameters: GooglePayParameters(
          currencyCode: 'RUB',
          countryCode: 'RU',
        ),
        // Тестовые параметры
        testModeSettings: TestModeSettings(
          charge: Amount(value: amount, currency: Currency.rub),
          enableTestMode: true, // false в production
        ),
      );

      // Запускаем процесс токенизации
      final result = await YookassaPaymentsFlutter.tokenization(
        tokenizationSettings,
      );

      if (result is TokenizationResult) {
        // Успешная токенизация
        final paymentToken = result.token;
        
        developer.log(
          'Payment token received: ${paymentToken.substring(0, 10)}...',
          name: 'YooKassaService',
        );
        
        return paymentToken;
      } else {
        // Отмена пользователем
        developer.log('Payment cancelled by user', name: 'YooKassaService');
        return null;
      }
    } catch (e) {
      developer.log('Payment error: $e', name: 'YooKassaService');
      rethrow;
    }
  }

  /// Обработка 3DS подтверждения
  /// 
  /// [confirmationUrl] - URL для подтверждения из YooKassa
  /// 
  /// Возвращает результат подтверждения
  Future<bool> handle3DSConfirmation(String confirmationUrl) async {
    try {
      final result = await YookassaPaymentsFlutter.confirmation(
        confirmationUrl: confirmationUrl,
        paymentMethodType: PaymentMethodType.bankCard,
      );

      if (result is ConfirmationResult) {
        developer.log('3DS confirmation success', name: 'YooKassaService');
        return true;
      } else {
        developer.log('3DS confirmation cancelled', name: 'YooKassaService');
        return false;
      }
    } catch (e) {
      developer.log('3DS confirmation error: $e', name: 'YooKassaService');
      return false;
    }
  }

  /// Показать диалог оплаты с полным flow
  /// 
  /// Включает токенизацию → отправку на backend → обработку 3DS
  Future<PaymentResult> showPaymentDialog({
    required BuildContext context,
    required int orderId,
    required double amount,
    required String description,
    String? customerEmail,
    String? customerPhone,
    required Future<Map<String, dynamic>> Function(String token) onTokenReceived,
  }) async {
    try {
      // Шаг 1: Получение payment token
      final paymentToken = await processPayment(
        orderId: orderId,
        amount: amount,
        description: description,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
      );

      if (paymentToken == null) {
        return PaymentResult.cancelled();
      }

      // Шаг 2: Отправка токена на backend
      if (context.mounted) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => const Center(
            child: CircularProgressIndicator(),
          ),
        );
      }

      final response = await onTokenReceived(paymentToken);

      if (context.mounted) {
        Navigator.of(context).pop(); // Закрыть loading
      }

      // Шаг 3: Обработка 3DS (если требуется)
      final confirmationUrl = response['confirmation_url'] as String?;
      if (confirmationUrl != null) {
        final confirmed = await handle3DSConfirmation(confirmationUrl);
        if (!confirmed) {
          return PaymentResult.failed('3DS подтверждение отменено');
        }
      }

      // Успех
      return PaymentResult.success(
        paymentId: response['payment_id'] as String,
        status: response['status'] as String,
      );
    } catch (e) {
      developer.log('Payment dialog error: $e', name: 'YooKassaService');
      return PaymentResult.failed(e.toString());
    }
  }
}

/// Результат платежа
class PaymentResult {
  final PaymentStatus status;
  final String? paymentId;
  final String? errorMessage;

  PaymentResult._({
    required this.status,
    this.paymentId,
    this.errorMessage,
  });

  factory PaymentResult.success({
    required String paymentId,
    required String status,
  }) {
    return PaymentResult._(
      status: PaymentStatus.success,
      paymentId: paymentId,
    );
  }

  factory PaymentResult.cancelled() {
    return PaymentResult._(
      status: PaymentStatus.cancelled,
    );
  }

  factory PaymentResult.failed(String error) {
    return PaymentResult._(
      status: PaymentStatus.failed,
      errorMessage: error,
    );
  }

  bool get isSuccess => status == PaymentStatus.success;
  bool get isCancelled => status == PaymentStatus.cancelled;
  bool get isFailed => status == PaymentStatus.failed;
}

enum PaymentStatus {
  success,
  cancelled,
  failed,
}

