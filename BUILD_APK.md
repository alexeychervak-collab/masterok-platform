# Сборка APK через Trusted Web Activity (TWA)

## Предварительные требования

- Node.js 18+
- Java JDK 11+
- Android SDK (API Level 33+)
- Google Chrome 72+ на устройстве

## 1. Установка Bubblewrap CLI

```bash
npm install -g @aspect-build/aspect-cli
npm install -g @nicolo-ribaudo/bubblewrap
```

Или:

```bash
npm install -g @nicolo-ribaudo/bubblewrap
```

## 2. Инициализация проекта

```bash
mkdir masterok-twa && cd masterok-twa

bubblewrap init --manifest https://masterok.ru/manifest.json
```

Bubblewrap запросит:

| Параметр | Значение |
|----------|----------|
| Domain | `masterok.ru` |
| App name | `МастерОК` |
| Short name | `МастерОК` |
| Package name | `ru.masterok.app` |
| Theme color | `#f97316` |
| Background color | `#ffffff` |
| Start URL | `/` |
| Display mode | `standalone` |

## 3. Настройка подписи

При первой сборке Bubblewrap создаст keystore автоматически. Для продакшена:

```bash
keytool -genkey -v \
  -keystore masterok-release.keystore \
  -alias masterok \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

Сохраните пароль и keystore в надёжном месте.

## 4. Получение SHA-256 отпечатка

```bash
keytool -list -v \
  -keystore masterok-release.keystore \
  -alias masterok | grep SHA256
```

Скопируйте отпечаток и замените `PLACEHOLDER_FINGERPRINT` в файле:
- `landing/public/.well-known/assetlinks.json`

Формат: `XX:XX:XX:...` (32 пары hex-символов через двоеточие).

## 5. Сборка APK

```bash
bubblewrap build
```

Файл `app-release-signed.apk` появится в текущей директории.

## 6. Тестирование

```bash
# Установка на подключённое устройство
adb install app-release-signed.apk

# Или через эмулятор Android Studio
```

## 7. Проверка Digital Asset Links

Убедитесь, что `assetlinks.json` доступен:

```bash
curl https://masterok.ru/.well-known/assetlinks.json
```

Должен вернуть JSON с правильным `sha256_cert_fingerprints`.

## 8. Размещение APK на сайте

```bash
cp app-release-signed.apk ../downloads/app-release.apk
```

APK будет доступен по адресу: `https://masterok.ru/downloads/app-release.apk`

## 9. Публикация в Google Play (опционально)

1. Создайте аккаунт разработчика Google Play ($25)
2. Создайте приложение в Google Play Console
3. Загрузите AAB (Android App Bundle):

```bash
bubblewrap build --generateAppBundle
```

4. Загрузите `app-release-bundle.aab` в Play Console
5. Добавьте описание, скриншоты, иконки
6. Отправьте на модерацию

## Обновление

При обновлении сайта TWA автоматически подтянет изменения — пересборка APK не требуется. Пересборка нужна только при изменении:

- Иконок приложения
- Имени приложения
- Package name
- Настроек manifest.json (display, orientation и т.д.)

## Troubleshooting

### Белая полоска сверху (Chrome address bar)
Проверьте, что `assetlinks.json` содержит правильный fingerprint и доступен по HTTPS.

### Приложение открывается в браузере
- Digital Asset Links не настроены
- Fingerprint не совпадает
- Файл `assetlinks.json` не отдаётся сервером

### Ошибка сборки Java
Убедитесь, что `JAVA_HOME` указывает на JDK 11+:
```bash
java -version
echo $JAVA_HOME
```
