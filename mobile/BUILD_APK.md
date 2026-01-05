# 📱 Руководство по сборке APK для YODO Mobile App

## ✅ Предварительные требования

### 1. Установите Flutter SDK

```bash
# Скачайте Flutter SDK с официального сайта
# https://docs.flutter.dev/get-started/install

# После установки проверьте:
flutter --version
# Должна быть версия Flutter 3.16+ и Dart 3.2+
```

### 2. Установите Android SDK

- Скачайте и установите Android Studio: https://developer.android.com/studio
- В Android Studio установите:
  - Android SDK Platform 34
  - Android SDK Build-Tools 34.0.0
  - Android SDK Command-line Tools
  - Android Emulator (опционально для тестирования)

### 3. Настройте переменные среды

**Windows:**
```bash
# Добавьте в PATH:
C:\src\flutter\bin
C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools
C:\Users\YourName\AppData\Local\Android\Sdk\tools\bin
```

**Mac/Linux:**
```bash
# Добавьте в ~/.bashrc или ~/.zshrc:
export PATH="$PATH:/path/to/flutter/bin"
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 🚀 Пошаговая инструкция по сборке

### Шаг 1: Проверка окружения

```bash
cd mobile

# Проверьте, что Flutter настроен правильно
flutter doctor

# Все должно быть с ✓ (галочками), кроме опциональных компонентов
```

### Шаг 2: Настройка local.properties

Создайте или обновите файл `android/local.properties`:

```properties
# Windows пример:
flutter.sdk=C:\\src\\flutter
sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk

# Mac/Linux пример:
flutter.sdk=/Users/yourname/flutter
sdk.dir=/Users/yourname/Library/Android/sdk
```

### Шаг 3: Установка зависимостей

```bash
# Установите все пакеты
flutter pub get

# Если нужна генерация кода (для будущих моделей)
# flutter pub run build_runner build --delete-conflicting-outputs
```

### Шаг 4: Создание keystore (для Release-сборки)

**ВАЖНО:** Keystore уже создан в проекте для удобства разработки.
Файл: `android/app/yodo-keystore.jks`

Параметры:
- Alias: `yodo-key`
- Password: `yodo123456`

**Для production используйте свой keystore:**

```bash
# Создайте новый keystore
keytool -genkey -v -keystore android/app/release-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias release-key

# Обновите android/app/build.gradle с новыми параметрами
```

### Шаг 5: Сборка APK

#### Debug APK (для тестирования)
```bash
flutter build apk --debug
```

Результат: `build/app/outputs/flutter-apk/app-debug.apk`

#### Release APK (для публикации)
```bash
flutter build apk --release
```

Результат: `build/app/outputs/flutter-apk/app-release.apk`

#### Split APKs (оптимизированные для разных архитектур)
```bash
flutter build apk --split-per-abi --release
```

Результат:
- `app-armeabi-v7a-release.apk` (ARM 32-bit)
- `app-arm64-v8a-release.apk` (ARM 64-bit)
- `app-x86_64-release.apk` (x86 64-bit)

#### App Bundle (для Google Play)
```bash
flutter build appbundle --release
```

Результат: `build/app/outputs/bundle/release/app-release.aab`

### Шаг 6: Установка APK на устройство

```bash
# Подключите Android устройство через USB или запустите эмулятор

# Проверьте подключение
adb devices

# Установите APK
adb install build/app/outputs/flutter-apk/app-release.apk

# Или используйте Flutter
flutter install
```

## 🛠️ Быстрые команды

### Сборка и установка за один шаг
```bash
flutter run --release
```

### Очистка сборки
```bash
flutter clean
flutter pub get
```

### Проверка размера APK
```bash
flutter build apk --analyze-size
```

## 📋 Checklist перед сборкой

- [ ] `flutter doctor` показывает все зеленые галочки
- [ ] `android/local.properties` настроен корректно
- [ ] Все зависимости установлены (`flutter pub get`)
- [ ] Версия в `pubspec.yaml` обновлена
- [ ] Протестировано на реальном устройстве
- [ ] Keystore настроен (для release)
- [ ] Проверены разрешения в `AndroidManifest.xml`
- [ ] Проверен размер APK (< 50 MB желательно)

## 🐛 Решение проблем

### Ошибка: "SDK location not found"
```bash
# Создайте android/local.properties с путями к SDK
```

### Ошибка: "Gradle build failed"
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter build apk
```

### Ошибка: "Keystore file not found"
```bash
# Проверьте путь в android/app/build.gradle
# Или создайте новый keystore
```

### Ошибка: "Execution failed for task ':app:lintVitalRelease'"
```bash
# В android/app/build.gradle добавьте:
android {
    lintOptions {
        checkReleaseBuilds false
    }
}
```

## 📱 Тестирование APK

### На физическом устройстве
1. Включите "Режим разработчика" на Android
2. Включите "Отладка по USB"
3. Подключите устройство через USB
4. Разрешите установку из неизвестных источников
5. Установите APK

### На эмуляторе
```bash
# Запустите эмулятор из Android Studio или:
flutter emulators
flutter emulators --launch <emulator_id>

# Установите APK
flutter install
```

## 🎯 Оптимизация APK

### Уменьшение размера
```bash
# Используйте split APKs
flutter build apk --split-per-abi --release

# Включите obfuscation
flutter build apk --obfuscate --split-debug-info=build/debug-info --release
```

### Производительность
```bash
# Profile build для анализа производительности
flutter build apk --profile
flutter run --profile
```

## 📦 Готовый APK

После успешной сборки APK находится:

**Debug:** `build/app/outputs/flutter-apk/app-debug.apk`

**Release:** `build/app/outputs/flutter-apk/app-release.apk`

**Размер:** ~20-30 MB (зависит от зависимостей)

## 🚀 Публикация в Google Play

1. Создайте App Bundle:
```bash
flutter build appbundle --release
```

2. Войдите в Google Play Console
3. Создайте новое приложение
4. Загрузите `app-release.aab`
5. Заполните информацию о приложении
6. Пройдите проверку и опубликуйте

## 📞 Поддержка

При проблемах:
1. Проверьте `flutter doctor`
2. Очистите кэш: `flutter clean`
3. Обновите зависимости: `flutter pub get`
4. Проверьте логи: `flutter logs`
5. Запустите с подробным выводом: `flutter run -v`

---

**Успешной сборки! 🎉**

