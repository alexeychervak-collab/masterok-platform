# 🎨 Настройка иконок приложения YODO

## Требования к иконке

- **Формат:** PNG с прозрачностью
- **Размер оригинала:** 1024x1024 px
- **Стиль:** Современный, минималистичный
- **Цвета:** Градиент из основной палитры YODO

## Быстрая настройка с flutter_launcher_icons

### Шаг 1: Добавьте в pubspec.yaml

```yaml
dev_dependencies:
  flutter_launcher_icons: ^0.13.1

flutter_launcher_icons:
  android: true
  ios: true
  image_path: "assets/images/app_icon.png"
  adaptive_icon_background: "#6366F1"
  adaptive_icon_foreground: "assets/images/app_icon_foreground.png"
```

### Шаг 2: Разместите иконки

1. Создайте иконку 1024x1024px
2. Сохраните как `assets/images/app_icon.png`
3. (Опционально) Создайте foreground для Android: `assets/images/app_icon_foreground.png`

### Шаг 3: Генерация иконок

```bash
flutter pub get
flutter pub run flutter_launcher_icons
```

## Ручная настройка

### Android

Разместите иконки в соответствующие папки:

```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png         (48x48 px)
├── mipmap-hdpi/ic_launcher.png         (72x72 px)
├── mipmap-xhdpi/ic_launcher.png        (96x96 px)
├── mipmap-xxhdpi/ic_launcher.png       (144x144 px)
├── mipmap-xxxhdpi/ic_launcher.png      (192x192 px)
```

### iOS

Разместите иконки в:
```
ios/Runner/Assets.xcassets/AppIcon.appiconset/
```

Размеры:
- 20x20 (@1x, @2x, @3x)
- 29x29 (@1x, @2x, @3x)
- 40x40 (@1x, @2x, @3x)
- 60x60 (@2x, @3x)
- 76x76 (@1x, @2x)
- 83.5x83.5 (@2x)
- 1024x1024 (@1x)

## Дизайн иконки YODO

### Концепт

Иконка должна отражать:
- ⚡ Скорость и эффективность
- 🤝 Связь клиентов и специалистов
- ✨ Современность и инновации

### Рекомендуемый дизайн

**Вариант 1: Минималистичный логотип**
- Буквы "Y" или "YODO"
- Градиент от #6366F1 до #A855F7
- Закругленные углы
- Белый фон

**Вариант 2: Иконка со значком**
- Звезда или молния в круге
- Градиентный фон
- Простой, но запоминающийся

### Цветовая палитра YODO

```
Primary: #6366F1
Secondary: #A855F7
Accent: #EC4899
Background: #F9FAFB
```

## Генератор иконок онлайн

Если у вас нет дизайнера, используйте:

1. **App Icon Generator** - https://appicon.co/
   - Загрузите иконку 1024x1024
   - Скачайте все размеры сразу

2. **Icon Kitchen** - https://icon.kitchen/
   - Создайте adaptive icon для Android

3. **MakeAppIcon** - https://makeappicon.com/
   - Генерация для всех платформ

## Проверка иконки

После установки иконки:

```bash
# Пересоберите приложение
flutter clean
flutter build apk --debug

# Установите на устройство
flutter install
```

Проверьте:
- ✅ Иконка отображается на домашнем экране
- ✅ Иконка четкая на всех размерах
- ✅ Иконка соответствует брендингу
- ✅ Иконка выглядит хорошо на светлом и темном фоне

## Adaptive Icon (Android 8+)

Современные Android устройства используют adaptive icons:

```xml
<!-- android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml -->
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

## Splash Screen

Также настройте splash screen в `flutter_native_splash`:

```yaml
dev_dependencies:
  flutter_native_splash: ^2.3.5

flutter_native_splash:
  color: "#6366F1"
  image: assets/images/splash_logo.png
  android: true
  ios: true
```

Затем:
```bash
flutter pub run flutter_native_splash:create
```

---

**Примечание:** Для production приложения рекомендуется заказать профессиональный дизайн иконки у дизайнера.

