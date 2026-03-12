# ⚡ Быстрый старт для разработчика - Сборка APK

> **Цель:** Собрать готовый APK файл приложения МастерОК за 15 минут

## 📋 Что нужно установить (один раз)

### 1. Flutter SDK

**Windows:**
```bash
# Скачайте с https://docs.flutter.dev/get-started/install/windows
# Распакуйте в C:\src\flutter

# Добавьте в PATH:
C:\src\flutter\bin

# Проверьте в новом терминале:
flutter --version
```

**Mac:**
```bash
brew install --cask flutter
flutter --version
```

**Linux:**
```bash
sudo snap install flutter --classic
flutter --version
```

### 2. Android Studio + Android SDK

1. Скачайте Android Studio: https://developer.android.com/studio
2. Установите (все по умолчанию)
3. Откройте Android Studio → More Actions → SDK Manager
4. Установите:
   - ✅ Android SDK Platform 34
   - ✅ Android SDK Build-Tools 34
   - ✅ Android SDK Command-line Tools

### 3. Проверка установки

```bash
flutter doctor
```

Должно быть:
```
[✓] Flutter (Channel stable, 3.16+)
[✓] Android toolchain - develop for Android devices
[✓] Android Studio (version 2023.1+)
```

---

## 🚀 Сборка APK (каждый раз)

### Вариант 1: Автоматический скрипт (Рекомендуется)

**Windows:**
```bash
cd D:\masterok\mobile
build-apk.bat
```

Следуйте инструкциям на экране:
1. Выберите тип сборки (обычно вариант 2 - Release APK)
2. Дождитесь окончания сборки
3. APK будет в `build\app\outputs\flutter-apk\app-release.apk`

**Mac/Linux:**
```bash
cd /path/to/masterok/mobile
chmod +x build-apk.sh
./build-apk.sh
```

### Вариант 2: Ручная сборка

```bash
# 1. Перейдите в папку
cd D:\masterok\mobile

# 2. Проверьте Flutter
flutter doctor

# 3. Установите зависимости (первый раз)
flutter pub get

# 4. Создайте local.properties (первый раз)
# Создайте файл: android/local.properties
# Добавьте (замените пути на свои):
flutter.sdk=C:\\src\\flutter
sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk

# 5. Соберите APK
flutter build apk --release

# 6. Найдите APK
# Windows: D:\masterok\mobile\build\app\outputs\flutter-apk\app-release.apk
# Mac/Linux: /path/to/masterok/mobile/build/app/outputs/flutter-apk/app-release.apk
```

---

## 📱 Установка APK на телефон

### Способ 1: Через ADB (USB кабель)

```bash
# 1. Включите на телефоне:
#    Настройки → О телефоне → Нажмите 7 раз на "Номер сборки"
#    Настройки → Для разработчиков → Отладка по USB (включить)

# 2. Подключите телефон через USB

# 3. Проверьте подключение
adb devices
# Должно показать ваше устройство

# 4. Установите APK
adb install -r build\app\outputs\flutter-apk\app-release.apk

# 5. Готово! Приложение установлено
```

### Способ 2: Передать файл напрямую

1. Скопируйте APK файл на телефон (через USB, облако, email и т.д.)
2. На телефоне откройте файл APK
3. Разрешите установку из неизвестных источников (если попросит)
4. Установите

---

## ⚠️ Частые проблемы и решения

### Проблема 1: "SDK location not found"

**Решение:** Создайте файл `android/local.properties`

**Windows:**
```properties
flutter.sdk=C:\\src\\flutter
sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk
```

**Mac:**
```properties
flutter.sdk=/Users/yourname/flutter
sdk.dir=/Users/yourname/Library/Android/sdk
```

**Linux:**
```properties
flutter.sdk=/home/yourname/flutter
sdk.dir=/home/yourname/Android/Sdk
```

### Проблема 2: "Gradle build failed"

**Решение:**
```bash
cd android
gradlew clean
cd ..
flutter clean
flutter pub get
flutter build apk --release
```

### Проблема 3: "Flutter not found"

**Решение:** Добавьте Flutter в PATH

**Windows:**
1. Откройте "Изменение системных переменных среды"
2. Переменные среды → Path → Изменить
3. Добавьте: `C:\src\flutter\bin`
4. Перезапустите терминал

### Проблема 4: "Java version incorrect"

**Решение:** Android Studio уже включает нужную версию Java

```bash
# Windows - добавьте в PATH:
C:\Program Files\Android\Android Studio\jbr\bin

# Или переустановите Android Studio
```

### Проблема 5: APK не устанавливается на телефон

**Решение:**
1. Убедитесь что включена установка из неизвестных источников
2. Попробуйте удалить старую версию приложения
3. Перезагрузите телефон
4. Попробуйте другой способ передачи файла

---

## 📊 Размер APK

- **Debug APK:** ~40-50 MB
- **Release APK:** ~20-30 MB
- **Split APKs:** ~15-20 MB каждый

Для уменьшения размера используйте:
```bash
flutter build apk --split-per-abi --release
```

Это создаст отдельные APK для разных архитектур:
- `app-armeabi-v7a-release.apk` - для старых телефонов
- `app-arm64-v8a-release.apk` - для современных телефонов (используйте этот)
- `app-x86_64-release.apk` - для эмуляторов

---

## ✅ Чеклист перед сборкой

- [ ] Flutter установлен (`flutter --version` работает)
- [ ] Android SDK установлен (`android/local.properties` настроен)
- [ ] Зависимости установлены (`flutter pub get` выполнен)
- [ ] `flutter doctor` показывает зеленые галочки
- [ ] Есть свободно минимум 5 GB на диске
- [ ] Интернет подключен (для первой сборки)

---

## 🎯 Итоговые команды (копируй-вставляй)

```bash
# 1. Проверка
cd D:\masterok\mobile
flutter doctor

# 2. Установка зависимостей
flutter pub get

# 3. Очистка (если были ошибки)
flutter clean
flutter pub get

# 4. Сборка APK
flutter build apk --release

# 5. Найти APK
# Путь: build\app\outputs\flutter-apk\app-release.apk

# 6. Установить на телефон
adb install -r build\app\outputs\flutter-apk\app-release.apk
```

---

## 🆘 Помощь

### Если ничего не работает:

1. **Удалите все и начните заново:**
   ```bash
   flutter clean
   cd android
   gradlew clean
   cd ..
   flutter pub get
   flutter doctor
   flutter build apk --release
   ```

2. **Проверьте версии:**
   ```bash
   flutter --version  # должна быть 3.16+
   java -version      # должна быть 11+
   ```

3. **Переустановите Android Studio:**
   - Удалите Android Studio
   - Скачайте последнюю версию
   - Установите все компоненты SDK

4. **Обратитесь за помощью:**
   - Откройте issue на GitHub
   - Email: support@masterok.ru
   - Приложите вывод `flutter doctor -v`

---

## 📸 Скриншоты процесса

### После успешной сборки увидите:

```
✓ Built build\app\outputs\flutter-apk\app-release.apk (20.5MB)
```

### После установки на телефон:

```
Performing Streamed Install
Success
```

---

## 🎉 Готово!

После выполнения всех шагов у вас будет:
- ✅ Рабочий APK файл
- ✅ Установленное приложение на телефоне
- ✅ Возможность собирать APK в любой момент

**Время выполнения:** 10-15 минут (первый раз), 2-3 минуты (последующие разы)

---

**Успешной сборки! 🚀**



