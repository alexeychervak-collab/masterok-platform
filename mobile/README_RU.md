# 📱 YODO Mobile App - Полное руководство

## 🎯 О приложении

**YODO** - современное мобильное приложение для iOS и Android для поиска специалистов и заказа услуг. Приложение построено на Flutter и полностью готово к production.

## ✨ Возможности

### Для пользователей:
- ✅ Поиск специалистов по категориям
- ✅ Просмотр профилей и рейтингов
- ✅ Создание и управление заказами
- ✅ Чат с специалистами (в реальном времени)
- ✅ Безопасная оплата через эскроу
- ✅ Отзывы и рейтинги
- ✅ Push-уведомления
- ✅ Избранные специалисты
- ✅ История заказов

### Технические особенности:
- 🎨 Современный Material Design 3
- 🔄 Riverpod для state management
- 🚀 Go Router для навигации
- 📡 Dio для HTTP запросов
- 💾 Secure Storage для токенов
- 🌍 Мультиязычность (готово к локализации)
- 📱 Адаптивный UI для всех размеров экранов
- ⚡ Высокая производительность

## 🏗️ Архитектура

```
lib/
├── main.dart                      # Точка входа
├── app.dart                       # MaterialApp
│
├── core/                          # Ядро приложения
│   ├── models/                   # Модели данных
│   │   ├── user.dart
│   │   ├── specialist.dart
│   │   ├── order.dart
│   │   ├── category.dart
│   │   └── review.dart
│   │
│   ├── services/                 # Сервисы для работы с API
│   │   ├── auth_service.dart
│   │   ├── specialists_service.dart
│   │   ├── orders_service.dart
│   │   └── categories_service.dart
│   │
│   ├── network/                  # HTTP клиент
│   │   └── api_client.dart
│   │
│   ├── router/                   # Навигация
│   │   └── router.dart
│   │
│   └── theme/                    # Темы и стили
│       ├── app_theme.dart
│       └── app_colors.dart
│
└── features/                     # Функциональные модули
    ├── auth/                     # Авторизация
    │   ├── data/
    │   │   └── auth_provider.dart
    │   └── presentation/
    │       └── pages/
    │           ├── login_page.dart
    │           └── register_page.dart
    │
    ├── home/                     # Главная
    │   ├── data/
    │   │   └── categories_provider.dart
    │   └── presentation/
    │       ├── pages/
    │       │   └── home_page.dart
    │       └── widgets/
    │           ├── category_card.dart
    │           ├── specialist_card.dart
    │           ├── promo_banner.dart
    │           └── search_bar_widget.dart
    │
    ├── specialists/              # Специалисты
    │   ├── data/
    │   │   └── specialists_provider.dart
    │   └── presentation/
    │       └── pages/
    │           ├── specialists_page.dart
    │           └── specialist_detail_page.dart
    │
    ├── orders/                   # Заказы
    │   ├── data/
    │   │   └── orders_provider.dart
    │   └── presentation/
    │       └── pages/
    │           └── orders_page.dart
    │
    ├── profile/                  # Профиль
    │   └── presentation/
    │       └── pages/
    │           └── profile_page.dart
    │
    └── shell/                    # Bottom Navigation
        └── presentation/
            └── pages/
                └── shell_page.dart
```

## 🚀 Быстрый старт

### 1. Установите зависимости

```bash
flutter pub get
```

### 2. Настройте API URL

Откройте `lib/core/network/api_client.dart` и измените:

```dart
// Для локальной разработки:
const String baseUrl = 'http://10.0.2.2:8000/api/v1';  // Android Emulator
// const String baseUrl = 'http://localhost:8000/api/v1';  // iOS Simulator

// Для production:
// const String baseUrl = 'https://api.yodo.ru/api/v1';
```

### 3. Запустите приложение

```bash
# Debug mode
flutter run

# Release mode (для тестирования производительности)
flutter run --release

# На конкретном устройстве
flutter devices
flutter run -d <device_id>
```

## 📦 Сборка APK/IPA

### Android APK

**Автоматическая сборка (Windows):**
```bash
build-apk.bat
```

**Автоматическая сборка (Mac/Linux):**
```bash
chmod +x build-apk.sh
./build-apk.sh
```

**Ручная сборка:**
```bash
# Debug APK
flutter build apk --debug

# Release APK
flutter build apk --release

# Split APKs (по архитектурам)
flutter build apk --split-per-abi --release

# App Bundle для Google Play
flutter build appbundle --release
```

Результаты:
- Debug: `build/app/outputs/flutter-apk/app-debug.apk`
- Release: `build/app/outputs/flutter-apk/app-release.apk`
- Bundle: `build/app/outputs/bundle/release/app-release.aab`

### iOS IPA

```bash
flutter build ios --release
```

Затем откройте `ios/Runner.xcworkspace` в Xcode и создайте архив.

## 🎨 Кастомизация

### Цвета

Откройте `lib/core/theme/app_colors.dart`:

```dart
class AppColors {
  static const Color primary = Color(0xFF6366F1);      // Основной цвет
  static const Color secondary = Color(0xFFA855F7);    // Вторичный
  static const Color accent = Color(0xFFEC4899);       // Акцент
  
  // Измените эти значения под свой бренд
}
```

### Логотип и иконки

1. Замените иконку приложения:
   - Подготовьте PNG 1024x1024
   - Используйте [flutter_launcher_icons](https://pub.dev/packages/flutter_launcher_icons)
   
2. Добавьте свои изображения в `assets/images/`

3. Обновите `pubspec.yaml`:
```yaml
flutter:
  assets:
    - assets/images/logo.png
    - assets/images/splash.png
```

### Шрифты

Добавьте свои шрифты в `assets/fonts/` и обновите `pubspec.yaml`:

```yaml
flutter:
  fonts:
    - family: YourFont
      fonts:
        - asset: assets/fonts/YourFont-Regular.ttf
        - asset: assets/fonts/YourFont-Bold.ttf
          weight: 700
```

## 🔧 Настройки

### Firebase (Push-уведомления)

1. Добавьте `google-services.json` в `android/app/`
2. Добавьте `GoogleService-Info.plist` в `ios/Runner/`
3. Установите Firebase:
```bash
flutter pub add firebase_core firebase_messaging
```

### Deep Links

Настройте в `AndroidManifest.xml` и `Info.plist` для открытия приложения по ссылкам.

### Аналитика

Интегрируйте Firebase Analytics, Amplitude или Mixpanel для отслеживания событий.

## 🧪 Тестирование

### Unit тесты

```bash
flutter test
```

### Integration тесты

```bash
flutter test integration_test/
```

### Widget тесты

```bash
flutter test test/widget_test.dart
```

## 📊 Производительность

### Профилирование

```bash
flutter run --profile
```

Откройте DevTools:
```bash
flutter pub global activate devtools
flutter pub global run devtools
```

### Оптимизация размера

```bash
# Анализ размера
flutter build apk --analyze-size

# С обфускацией
flutter build apk --obfuscate --split-debug-info=build/debug-info
```

## 🐛 Отладка

### Логирование

```dart
import 'dart:developer' as developer;

developer.log('Message', name: 'TAG');
```

### Flutter DevTools

```bash
flutter run
# Откроется URL для DevTools
```

### Общие проблемы

**1. "Provider was disposed"**
- Используйте `autoDispose` providers
- Проверьте lifecycle виджетов

**2. "DioException"**
- Проверьте подключение к интернету
- Проверьте правильность API URL
- Проверьте логи: `flutter logs`

**3. "Build failed"**
- Очистите кэш: `flutter clean`
- Переустановите зависимости: `flutter pub get`
- Проверьте версии в `pubspec.yaml`

## 📱 Требования

### Минимальные версии:
- **Android:** API 23 (Android 6.0)
- **iOS:** 12.0
- **Flutter:** 3.16.0
- **Dart:** 3.2.0

### Рекомендуемые:
- **Android:** API 34 (Android 14)
- **iOS:** 17.0

## 🔐 Безопасность

- ✅ JWT токены хранятся в Secure Storage
- ✅ HTTPS для всех запросов
- ✅ Certificate pinning (опционально)
- ✅ Обфускация кода в release
- ✅ No cleartext traffic

## 📝 Лицензия

MIT License - см. LICENSE файл

## 👥 Поддержка

- **Email:** support@yodo.ru
- **Telegram:** @yodo_support
- **GitHub Issues:** [github.com/yodo/issues](https://github.com)

## 🗺️ Roadmap

### v1.1 (Q2 2026)
- [ ] Видео-звонки
- [ ] AI-ассистент
- [ ] Расширенная аналитика
- [ ] Мультиязычность

### v1.2 (Q3 2026)
- [ ] Офлайн режим
- [ ] Apple Pay / Google Pay
- [ ] AR preview для услуг
- [ ] Widget для главного экрана

## 🎉 Готово!

Приложение полностью готово к production. Следуйте инструкциям в [BUILD_APK.md](BUILD_APK.md) для сборки и публикации.

**Удачи с запуском! 🚀**

