# YODO Mobile App

Flutter мобильное приложение для платформы YODO.

## Требования

- Flutter 3.16+
- Dart 3.2+
- Android Studio / Xcode

## Установка

```bash
# Установка зависимостей
flutter pub get

# Генерация кода (freezed, json_serializable)
flutter pub run build_runner build --delete-conflicting-outputs

# Запуск
flutter run
```

## Структура

```
lib/
├── main.dart                 # Entry point
├── app.dart                  # MaterialApp
├── core/
│   ├── theme/               # Стили и цвета
│   ├── router/              # Go Router навигация
│   └── network/             # API клиент (Dio)
└── features/
    ├── auth/                # Авторизация
    ├── home/                # Главный экран
    ├── specialists/         # Специалисты
    ├── orders/              # Заказы
    ├── profile/             # Профиль
    └── shell/               # Bottom Navigation
```

## Сборка

### Android

```bash
flutter build apk --release
flutter build appbundle --release  # для Play Store
```

### iOS

```bash
flutter build ios --release
```

## API

Приложение использует API бэкенда:
- Development: `http://localhost:8000/api/v1`
- Production: `https://api.yodo.ru/api/v1`

Настройте URL в `lib/core/network/api_client.dart`




