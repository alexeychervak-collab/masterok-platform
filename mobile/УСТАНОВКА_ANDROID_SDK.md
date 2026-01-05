# 🤖 УСТАНОВКА ANDROID SDK

## ❌ ОШИБКА: "No Android SDK found"

Эта ошибка означает, что Android SDK не установлен или не настроен.

---

## ✅ РЕШЕНИЕ 1: УСТАНОВИТЬ ANDROID STUDIO (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Скачать Android Studio

https://developer.android.com/studio

**Размер:** ~1 GB  
**Время установки:** 15-20 минут

### Шаг 2: Установить Android Studio

1. Запустить установщик
2. Выбрать "Standard" installation
3. Дождаться загрузки компонентов

**Что установится:**
- Android SDK
- Android SDK Platform
- Android SDK Build-Tools
- Android Emulator

### Шаг 3: Настроить Flutter

```bash
flutter doctor --android-licenses
# Нажимать "y" для принятия лицензий
```

### Шаг 4: Проверка

```bash
flutter doctor -v
```

Должно быть:
```
[√] Android toolchain - develop for Android devices
    • Android SDK at C:\Users\User\AppData\Local\Android\sdk
    • Platform android-34, build-tools 34.0.0
    • Java binary at: ...
    • All Android licenses accepted.
```

---

## ✅ РЕШЕНИЕ 2: УСТАНОВИТЬ ТОЛЬКО SDK (БЕЗ ANDROID STUDIO)

### Для опытных пользователей:

1. Скачать Command Line Tools:
   https://developer.android.com/studio#command-tools

2. Распаковать в `C:\Android\sdk\cmdline-tools`

3. Установить компоненты:
```bash
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

4. Установить переменную окружения:
```
ANDROID_HOME=C:\Android\sdk
Path += %ANDROID_HOME%\platform-tools
Path += %ANDROID_HOME%\tools
```

---

## ✅ РЕШЕНИЕ 3: СОБРАТЬ ОНЛАЙН (GITHUB ACTIONS)

Если не хотите устанавливать Android SDK локально, можно собрать через GitHub Actions!

### Шаг 1: Создать файл workflow

Файл: `.github/workflows/build-apk.yml`

```yaml
name: Build APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.35.7'
          channel: 'stable'
      
      - name: Install dependencies
        run: |
          cd mobile
          flutter pub get
      
      - name: Build APK
        run: |
          cd mobile
          flutter build apk --release --split-per-abi
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: |
            mobile/build/app/outputs/flutter-apk/*.apk
```

### Шаг 2: Push на GitHub

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push
```

### Шаг 3: Скачать APK

1. GitHub → Actions tab
2. Последний workflow run
3. Artifacts → Скачать APK

---

## ✅ РЕШЕНИЕ 4: ИСПОЛЬЗОВАТЬ CODEMAGIC (ОБЛАКО)

### Бесплатная CI/CD для Flutter:

1. Регистрация: https://codemagic.io
2. Подключить GitHub репозиторий
3. Настроить workflow
4. APK соберётся автоматически!

**Преимущества:**
- Не нужен Android SDK локально
- Бесплатно 500 минут/месяц
- Автоматическая публикация

---

## 🔍 ПРОВЕРКА УСТАНОВКИ

После установки Android SDK:

```bash
# Проверка Flutter
flutter doctor -v

# Должно быть всё зелёное:
# [√] Flutter
# [√] Android toolchain
# [√] Chrome
# [√] Visual Studio (для Windows)
```

---

## 📱 АЛЬТЕРНАТИВА: СБОРКА НА MAC (ДЛЯ iOS)

Если у вас только Windows без Android SDK:

1. Найти Mac (друг, коллега, интернет-кафе)
2. Установить Flutter и Xcode
3. Собрать iOS версию
4. Загрузить в TestFlight

Или использовать облачные Mac (Codemagic, GitHub Actions Mac runner)

---

## ⚡ БЫСТРЫЙ ПУТЬ: GITHUB ACTIONS

**Самый простой способ без локальной установки:**

1. Залить код на GitHub
2. Добавить workflow файл (см. выше)
3. Push
4. Через 10-15 минут скачать готовый APK!

---

## 🎯 РЕКОМЕНДАЦИЯ

**Для разработки:** Установите Android Studio  
**Для разовой сборки:** Используйте GitHub Actions  
**Для CI/CD:** Используйте Codemagic

---

*Выберите подходящий вариант и следуйте инструкциям!*

