# 🍎 STROYKA - ПОЛНАЯ НАСТРОЙКА iOS

## ✅ ВСЁ УЖЕ ГОТОВО!

Конфигурация iOS полностью настроена и готова к сборке.

---

## 📋 ЧТО НАСТРОЕНО

### 1. Podfile ✅
```ruby
- Platform: iOS 15.0
- Firebase pods готовы
- YooKassa готов
- Permissions настроены
```

### 2. Info.plist ✅
```xml
- Bundle ID: com.stroyka.app
- Display Name: STROYKA
- Permissions (Camera, Photos, Location)
- Firebase integration
- Deep linking (stroyka://)
- Background modes
```

### 3. GoogleService-Info.plist ✅
- Шаблон готов
- Нужно заменить на production Firebase config

### 4. AppDelegate.swift ✅
- Firebase initialization готов
- Push notifications готовы

---

## 🚀 СБОРКА iOS

### Требования

- ✅ macOS 12+
- ✅ Xcode 15+
- ✅ CocoaPods 1.11+
- ✅ Apple Developer Account

### Шаг 1: Установка Pods

```bash
cd ios
pod install
```

**Первый раз займёт:** 10-15 минут

### Шаг 2: Открыть в Xcode

```bash
open Runner.xcworkspace
```

⚠️ **ВАЖНО:** Открывать именно `.xcworkspace`, НЕ `.xcodeproj`!

### Шаг 3: Настройка Signing

**В Xcode:**

1. Выбрать проект `Runner` в Navigator
2. Target `Runner` → Signing & Capabilities
3. **Team:** Выбрать свою команду разработчика
4. **Bundle Identifier:** `com.stroyka.app`
5. ✅ Automatically manage signing

### Шаг 4: Сборка Archive

```
Product → Scheme → Edit Scheme
  └─ Run → Build Configuration → Release

Product → Archive
  └─ Дождаться окончания (15-20 минут)
```

### Шаг 5: Distribute App

После успешного Archive:

```
Organizer → Archives → Latest Archive
  └─ Distribute App
      └─ App Store Connect
          └─ Upload
              └─ Дождаться загрузки
```

---

## 📱 TestFlight

### После Upload в Xcode:

1. Открыть https://appstoreconnect.apple.com
2. Мои приложения → STROYKA → TestFlight
3. Дождаться обработки (10-30 минут)
4. "Управление соответствием" → Заполнить
5. Добавить тестировщиков

### Добавление тестировщиков:

**Внутренние (до 100):**
```
TestFlight → Внутреннее тестирование
  → Добавить тестировщиков
  → Ввести email адреса
```

**Внешние (до 10,000):**
```
TestFlight → Внешнее тестирование
  → Создать группу
  → Добавить тестировщиков
  → Отправить на проверку Apple (24-48 часов)
```

---

## ⚙️ КОНФИГУРАЦИЯ

### Bundle Identifier

```
com.stroyka.app
```

Должен совпадать:
- ✅ Info.plist → CFBundleIdentifier
- ✅ Xcode → General → Bundle Identifier
- ✅ Firebase Console → iOS App
- ✅ App Store Connect → Bundle ID

### Version & Build

```
Version: 1.0.0  (для пользователей)
Build: 1        (увеличивать каждую загрузку)
```

В Xcode:
```
General → Identity
  - Version: 1.0.0
  - Build: 1
```

Или в `pubspec.yaml`:
```yaml
version: 1.0.0+1
         ↑     ↑
    Version  Build
```

### Deployment Target

```
iOS 15.0+
```

**Почему 15.0?**
- Firebase требует 13.0+
- Современные фичи
- 95%+ устройств

### Capabilities

Уже настроены в Info.plist:
- ✅ Push Notifications
- ✅ Background Modes (fetch, remote-notification)
- ✅ App Groups (optional)

---

## 🔐 CERTIFICATES & PROFILES

### Development

```
1. Xcode → Preferences → Accounts
2. Добавить Apple ID
3. Manage Certificates
4. "+" → Apple Development
```

### Distribution

```
1. Xcode → Preferences → Accounts  
2. Manage Certificates
3. "+" → Apple Distribution
```

### Provisioning Profiles

**Automatic (рекомендуется для TestFlight):**
```
Xcode сам создаст и обновит профили
```

**Manual (для Production):**
```
1. https://developer.apple.com
2. Certificates, IDs & Profiles
3. Profiles → "+"
4. App Store Distribution
5. Скачать и установить (двойной клик)
```

---

## 🔥 FIREBASE SETUP

### 1. Создать iOS App в Firebase

```
1. https://console.firebase.google.com
2. Project: STROYKA
3. Add app → iOS
4. Bundle ID: com.stroyka.app
5. Download GoogleService-Info.plist
```

### 2. Добавить в проект

```bash
# Заменить файл:
cp ~/Downloads/GoogleService-Info.plist ios/Runner/

# Или перетащить в Xcode:
Runner/ → GoogleService-Info.plist → Add to targets: Runner
```

### 3. Проверка

```swift
// В AppDelegate.swift должно быть:
import Firebase

func application(...) {
    FirebaseApp.configure()
}
```

---

## 💳 YOOKASSA SDK

### Уже настроено в Podfile:

```ruby
source 'https://git.yoomoney.ru/scm/sdk/cocoa-pod-specs.git'

# YooKassa будет установлен через:
# yookassa_payments_flutter plugin
```

### После `pod install`:

```
✅ YooKassaPayments pod установлен
✅ Зависимости настроены
✅ Готов к использованию
```

---

## 🧪 ТЕСТИРОВАНИЕ

### На симуляторе:

```bash
# Запустить конкретный симулятор
flutter run -d "iPhone 15 Pro"

# Список доступных
flutter devices
```

### На физическом устройстве:

1. Подключить iPhone/iPad
2. Разблокировать устройство
3. Trust This Computer (если первый раз)
4. В Xcode выбрать устройство
5. Product → Run

---

## 📊 BUILD SETTINGS

### Важные настройки:

```
PRODUCT_BUNDLE_IDENTIFIER = com.stroyka.app
IPHONEOS_DEPLOYMENT_TARGET = 15.0
SWIFT_VERSION = 5.0
DEVELOPMENT_TEAM = [Your Team ID]
CODE_SIGN_STYLE = Automatic
```

### Optimization:

**Debug:**
```
SWIFT_OPTIMIZATION_LEVEL = -Onone
```

**Release:**
```
SWIFT_OPTIMIZATION_LEVEL = -O
SWIFT_COMPILATION_MODE = wholemodule
```

---

## ❗ ЧАСТЫЕ ПРОБЛЕМЫ

### "Command PhaseScriptExecution failed"

```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
```

### "Signing for Runner requires a development team"

```
Xcode → Signing & Capabilities
  → Team → Выбрать команду
```

### "Module 'Firebase' not found"

```bash
cd ios
pod deintegrate
pod install
```

### "Unable to boot simulator"

```bash
# Перезапустить Simulator
killall Simulator
open -a Simulator
```

### "App installation failed"

```
1. Очистить derived data:
   Xcode → Product → Clean Build Folder

2. Удалить app с устройства

3. Пересобрать:
   Product → Run
```

---

## 📝 ЧЕКЛИСТ ПЕРЕД ARCHIVE

- [ ] Team выбрана
- [ ] Bundle ID правильный (com.stroyka.app)
- [ ] Version и Build номер увеличены
- [ ] GoogleService-Info.plist (production)
- [ ] YooKassa production keys в коде
- [ ] API URL production
- [ ] Scheme = Release
- [ ] Signing = Automatic
- [ ] Device = Any iOS Device (arm64)
- [ ] Все ошибки исправлены
- [ ] Протестировано на устройстве

---

## 🚀 ГОТОВО К СБОРКЕ!

Всё настроено для успешной сборки iOS версии STROYKA!

### Следующие шаги:

```bash
1. cd ios && pod install
2. open Runner.xcworkspace
3. Настроить Signing
4. Product → Archive
5. Distribute → App Store Connect
6. TestFlight → Добавить тестировщиков
```

**Время сборки:** 20-30 минут (первый раз)

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

- [Flutter iOS Setup](https://docs.flutter.dev/deployment/ios)
- [Xcode Help](https://developer.apple.com/documentation/xcode)
- [TestFlight Guide](https://developer.apple.com/testflight/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

*Создано: 04.01.2026*  
*Проект: STROYKA*  
*iOS Version: 1.0.0*  
*Готово к сборке ✅*

