import 'package:flutter/material.dart';

/// Цветовая палитра приложения МастерОК
class AppColors {
  // Запрет создания экземпляра класса
  AppColors._();

  // Brand (в стиле маркетплейсов: чистый, контрастный, “премиум”)
  // Primary - фирменный синий (быстрый, “тех” вайб)
  static const Color primary = Color(0xFF2563EB);
  static const Color primaryLight = Color(0xFF3B82F6);
  static const Color primaryDark = Color(0xFF1D4ED8);
  static const Color primaryExtraLight = Color(0xFFDCEBFF);

  // Secondary - глубокий темный (для текста/контрастных акцентов)
  static const Color secondary = Color(0xFF111827);
  static const Color secondaryLight = Color(0xFF374151);
  static const Color secondaryDark = Color(0xFF0B1220);
  static const Color secondaryExtraLight = Color(0xFFE5E7EB);

  // Accent - мягкий циан (в поддержке синего бренда)
  static const Color accent = Color(0xFF06B6D4);
  static const Color accentLight = Color(0xFF67E8F9);
  static const Color accentDark = Color(0xFF0891B2);

  // Success (зеленый) - успешные операции
  static const Color success = Color(0xFF22C55E);
  static const Color successLight = Color(0xFF86EFAC);
  static const Color successDark = Color(0xFF16A34A);

  // Warning (желтый) - предупреждения
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningLight = Color(0xFFFCD34D);
  static const Color warningDark = Color(0xFFB45309);

  // Error (красный) - ошибки
  static const Color error = Color(0xFFEF4444);
  static const Color errorLight = Color(0xFFFCA5A5);
  static const Color errorDark = Color(0xFFB91C1C);

  // Info (синий) - информационные сообщения
  static const Color info = Color(0xFF3B82F6);
  static const Color infoLight = Color(0xFF93C5FD);
  static const Color infoDark = Color(0xFF1D4ED8);

  // Neutral (серый) - нейтральные элементы
  static const Color neutral50 = Color(0xFFFAFAFA);
  static const Color neutral100 = Color(0xFFF5F5F5);
  static const Color neutral200 = Color(0xFFEEEEEE);
  static const Color neutral300 = Color(0xFFE0E0E0);
  static const Color neutral400 = Color(0xFFBDBDBD);
  static const Color neutral500 = Color(0xFF9E9E9E);
  static const Color neutral600 = Color(0xFF757575);
  static const Color neutral700 = Color(0xFF616161);
  static const Color neutral800 = Color(0xFF424242);
  static const Color neutral900 = Color(0xFF212121);

  // Специальные цвета
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);
  static const Color transparent = Color(0x00000000);

  // Цвета текста
  static const Color textPrimary = Color(0xFF111827);
  static const Color textSecondary = Color(0xFF6B7280);

  // Цвета фона
  static const Color background = Color(0xFFF7F7FB);
  static const Color surface = white;

  // Цвета границ
  static const Color border = Color(0xFFE5E7EB);

  // Градиенты
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary, accent],
  );

  static const LinearGradient successGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [success, Color(0xFF8BC34A)],
  );

  static const LinearGradient errorGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [error, Color(0xFFF43F5E)],
  );

  static const LinearGradient infoGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [info, Color(0xFF03A9F4)],
  );

  static const LinearGradient warningGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [warning, Color(0xFFFFCA28)],
  );

  // Градиенты для темной темы
  static const LinearGradient darkPrimaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryLight, accentDark],
  );

  // Цвета для статусов заказов
  static const Color orderPending = warning;
  static const Color orderInProgress = info;
  static const Color orderCompleted = success;
  static const Color orderCancelled = error;
  static const Color orderDispute = accent;

  // Цвета для рейтингов
  static const Color rating5 = success;
  static const Color rating4 = Color(0xFF8BC34A);
  static const Color rating3 = warning;
  static const Color rating2 = Color(0xFFFF9800);
  static const Color rating1 = error;

  // Цвета для бейджей
  static const Color badgeTop = Color(0xFFFFD700); // Золотой
  static const Color badgeVerified = info;
  static const Color badgeFast = success;
  static const Color badgeNew = accent;

  // Цвета для чата
  static const Color chatMyMessage = primaryLight;
  static const Color chatOtherMessage = neutral100;
  static const Color chatOnline = success;
  static const Color chatOffline = neutral400;
  static const Color chatTyping = info;

  // Glassmorphism (полупрозрачные)
  static Color glassWhite = white.withOpacity(0.1);
  static Color glassBorder = white.withOpacity(0.2);
  static Color glassBlur = white.withOpacity(0.05);

  // Neumorphism (тени)
  static Color neuLight = white;
  static Color neuDark = neutral400;

  // Overlay (затемнения)
  static Color overlayLight = black.withOpacity(0.3);
  static Color overlayMedium = black.withOpacity(0.5);
  static Color overlayDark = black.withOpacity(0.7);
}
