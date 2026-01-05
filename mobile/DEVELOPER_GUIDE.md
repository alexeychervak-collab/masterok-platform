# 👨‍💻 Руководство разработчика YODO Mobile App

## 📋 Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Архитектура приложения](#архитектура-приложения)
3. [Структура проекта](#структура-проекта)
4. [Работа с API](#работа-с-api)
5. [State Management](#state-management)
6. [Навигация](#навигация)
7. [Добавление новых фич](#добавление-новых-фич)
8. [Сборка APK](#сборка-apk)
9. [Тестирование](#тестирование)
10. [Советы и лучшие практики](#советы-и-лучшие-практики)

---

## 🚀 Быстрый старт

### Установка зависимостей

```bash
cd mobile
flutter pub get
```

### Запуск приложения

```bash
# Development mode
flutter run

# Production mode
flutter run --release

# На конкретном устройстве
flutter run -d <device_id>
```

### Проверка окружения

```bash
flutter doctor
flutter doctor -v  # Подробная информация
```

---

## 🏗️ Архитектура приложения

Приложение использует **Clean Architecture** с **Feature-First** структурой.

### Основные принципы

1. **Separation of Concerns** - разделение логики на слои
2. **Dependency Injection** - через Riverpod
3. **Reactive Programming** - State management с Riverpod
4. **Single Source of Truth** - централизованное состояние

### Слои архитектуры

```
lib/
├── core/                    # Общие компоненты
│   ├── models/             # Общие модели данных
│   ├── services/           # Общие сервисы
│   ├── network/            # API клиент
│   ├── router/             # Навигация
│   └── theme/              # Стили и темы
│
└── features/               # Функциональные модули
    ├── auth/
    │   ├── data/          # Providers, repositories
    │   └── presentation/   # UI: pages, widgets
    │
    ├── home/
    ├── specialists/
    ├── orders/
    └── profile/
```

---

## 📁 Структура проекта

### Core (Общие компоненты)

#### `lib/core/models/`
Модели данных, используемые во всем приложении:
- `user.dart` - Модель пользователя
- `specialist.dart` - Модель специалиста
- `order.dart` - Модель заказа
- `category.dart` - Модель категории
- `review.dart` - Модель отзыва

#### `lib/core/services/`
Сервисы для работы с API:
- `auth_service.dart` - Аутентификация
- `specialists_service.dart` - Работа со специалистами
- `orders_service.dart` - Работа с заказами
- `categories_service.dart` - Работа с категориями

#### `lib/core/network/`
- `api_client.dart` - Dio клиент с interceptors

#### `lib/core/theme/`
- `app_theme.dart` - Светлая и темная темы
- `app_colors.dart` - Цветовая палитра

### Features (Функциональные модули)

Каждая фича имеет структуру:

```
feature_name/
├── data/
│   └── *_provider.dart      # Riverpod providers
│
└── presentation/
    ├── pages/              # Экраны
    └── widgets/            # Виджеты фичи
```

---

## 🌐 Работа с API

### Конфигурация

API клиент настроен в `lib/core/network/api_client.dart`:

```dart
const String baseUrl = 'https://api.yodo.ru/api/v1';
```

Для локальной разработки измените на:
```dart
const String baseUrl = 'http://10.0.2.2:8000/api/v1';  // Android Emulator
const String baseUrl = 'http://localhost:8000/api/v1';  // iOS Simulator
```

### Создание нового сервиса

```dart
// lib/core/services/my_service.dart
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:yodo/core/network/api_client.dart';

final myServiceProvider = Provider<MyService>((ref) {
  return MyService(ref.read(dioProvider));
});

class MyService {
  final Dio _dio;

  MyService(this._dio);

  Future<List<MyModel>> getItems() async {
    try {
      final response = await _dio.get('/items');
      final List<dynamic> data = response.data as List<dynamic>;
      return data.map((json) => MyModel.fromJson(json)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  String _handleError(dynamic error) {
    if (error is DioException) {
      // Обработка ошибок
    }
    return 'Произошла ошибка';
  }
}
```

---

## 🔄 State Management

### Riverpod Providers

#### FutureProvider - для загрузки данных

```dart
final specialistsProvider = FutureProvider.autoDispose<List<Specialist>>((ref) async {
  final service = ref.read(specialistsServiceProvider);
  return service.getSpecialists();
});
```

#### StateNotifierProvider - для мутаций

```dart
final ordersNotifierProvider = StateNotifierProvider<OrdersNotifier, AsyncValue<void>>((ref) {
  return OrdersNotifier(ref);
});

class OrdersNotifier extends StateNotifier<AsyncValue<void>> {
  final Ref _ref;

  OrdersNotifier(this._ref) : super(const AsyncValue.data(null));

  Future<void> createOrder(OrderData data) async {
    state = const AsyncValue.loading();
    try {
      final service = _ref.read(ordersServiceProvider);
      await service.createOrder(data);
      state = const AsyncValue.data(null);
      _ref.invalidate(myOrdersProvider); // Refresh list
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}
```

#### Использование в UI

```dart
class MyWidget extends ConsumerWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final specialistsAsync = ref.watch(specialistsProvider);

    return specialistsAsync.when(
      data: (specialists) => ListView.builder(
        itemCount: specialists.length,
        itemBuilder: (context, index) => SpecialistCard(specialists[index]),
      ),
      loading: () => CircularProgressIndicator(),
      error: (error, stack) => Text('Error: $error'),
    );
  }
}
```

---

## 🧭 Навигация

### Go Router

Навигация настроена в `lib/core/router/router.dart`.

#### Навигация между экранами

```dart
// Push (с back button)
context.push('/specialist/123');

// Go (заменяет текущий экран)
context.go('/login');

// Go back
context.pop();

// С параметрами
context.push('/specialist/${specialist.id}');
```

#### Добавление нового маршрута

```dart
GoRoute(
  path: '/my-new-page',
  name: 'my-new-page',
  builder: (context, state) => MyNewPage(),
),

// С параметрами
GoRoute(
  path: '/item/:id',
  name: 'item-detail',
  builder: (context, state) => ItemDetailPage(
    id: state.pathParameters['id']!,
  ),
),
```

---

## ✨ Добавление новых фич

### Шаг 1: Создать структуру

```
lib/features/my_feature/
├── data/
│   └── my_feature_provider.dart
└── presentation/
    ├── pages/
    │   └── my_feature_page.dart
    └── widgets/
        └── my_feature_widget.dart
```

### Шаг 2: Создать модель (если нужно)

```dart
// lib/core/models/my_model.dart
class MyModel {
  final int id;
  final String name;

  const MyModel({required this.id, required this.name});

  factory MyModel.fromJson(Map<String, dynamic> json) {
    return MyModel(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}
```

### Шаг 3: Создать сервис

```dart
// lib/core/services/my_service.dart
final myServiceProvider = Provider<MyService>((ref) {
  return MyService(ref.read(dioProvider));
});

class MyService {
  final Dio _dio;
  MyService(this._dio);

  Future<List<MyModel>> getItems() async {
    final response = await _dio.get('/items');
    return (response.data as List).map((json) => MyModel.fromJson(json)).toList();
  }
}
```

### Шаг 4: Создать provider

```dart
// lib/features/my_feature/data/my_feature_provider.dart
final myItemsProvider = FutureProvider.autoDispose<List<MyModel>>((ref) async {
  final service = ref.read(myServiceProvider);
  return service.getItems();
});
```

### Шаг 5: Создать UI

```dart
// lib/features/my_feature/presentation/pages/my_feature_page.dart
class MyFeaturePage extends ConsumerWidget {
  const MyFeaturePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final itemsAsync = ref.watch(myItemsProvider);

    return Scaffold(
      appBar: AppBar(title: Text('My Feature')),
      body: itemsAsync.when(
        data: (items) => ListView.builder(
          itemCount: items.length,
          itemBuilder: (context, index) => ListTile(
            title: Text(items[index].name),
          ),
        ),
        loading: () => Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
      ),
    );
  }
}
```

### Шаг 6: Добавить маршрут

```dart
// lib/core/router/router.dart
GoRoute(
  path: '/my-feature',
  name: 'my-feature',
  builder: (context, state) => MyFeaturePage(),
),
```

---

## 📦 Сборка APK

### Быстрая сборка

```bash
# Windows
build-apk.bat

# Mac/Linux
./build-apk.sh
```

### Ручная сборка

```bash
# Debug
flutter build apk --debug

# Release
flutter build apk --release

# Split по архитектурам (оптимизированный)
flutter build apk --split-per-abi --release

# App Bundle для Google Play
flutter build appbundle --release
```

Подробнее: [BUILD_APK.md](BUILD_APK.md)

---

## 🧪 Тестирование

### Unit тесты

```bash
flutter test
```

### Integration тесты

```bash
flutter test integration_test
```

### Widget тесты

```dart
testWidgets('MyWidget test', (WidgetTester tester) async {
  await tester.pumpWidget(
    ProviderScope(
      child: MaterialApp(home: MyWidget()),
    ),
  );

  expect(find.text('Hello'), findsOneWidget);
  await tester.tap(find.byType(ElevatedButton));
  await tester.pump();
});
```

---

## 💡 Советы и лучшие практики

### 1. Оптимизация производительности

```dart
// Используйте const конструкторы где возможно
const Text('Hello');
const SizedBox(height: 16);

// Используйте ListView.builder для больших списков
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ItemWidget(items[index]),
);

// Используйте autoDispose для providers
final provider = FutureProvider.autoDispose<Data>(...);
```

### 2. Обработка ошибок

```dart
// Всегда обрабатывайте ошибки в providers
try {
  final data = await service.getData();
  return data;
} catch (e, stack) {
  // Логирование
  print('Error: $e');
  print('Stack: $stack');
  rethrow; // Или return default value
}
```

### 3. Кэширование

```dart
// Кэшируйте данные через keepAlive
final cacheProvider = FutureProvider.autoDispose<Data>((ref) async {
  ref.keepAlive(); // Данные не будут очищены
  return await service.getData();
});
```

### 4. Отладка

```dart
// Используйте logger
import 'package:logger/logger.dart';
final logger = Logger();

logger.d('Debug message');
logger.i('Info message');
logger.w('Warning message');
logger.e('Error message');

// Включите подробные логи Riverpod
ProviderScope(
  observers: [MyObserver()],
  child: MyApp(),
);
```

### 5. Форматирование кода

```bash
# Автоформатирование
flutter format lib/

# Анализ кода
flutter analyze

# Проверка перед коммитом
flutter analyze && flutter test
```

---

## 📚 Дополнительные ресурсы

- [Flutter Documentation](https://docs.flutter.dev/)
- [Riverpod Documentation](https://riverpod.dev/)
- [Go Router Documentation](https://pub.dev/packages/go_router)
- [Dio Documentation](https://pub.dev/packages/dio)

---

## 🆘 Помощь и поддержка

### Частые проблемы

**Ошибка: "Provider was disposed"**
- Используйте `autoDispose` providers
- Проверьте lifecycle виджетов

**Ошибка: "Bad state: No element"**
- Проверьте наличие данных перед доступом
- Используйте `.firstWhere(..., orElse: () => null)`

**Ошибка: "A RenderFlex overflowed"**
- Оберните в `Expanded` или `Flexible`
- Используйте `SingleChildScrollView`

### Команды для отладки

```bash
# Очистить кэш
flutter clean

# Переустановить зависимости
flutter pub get

# Проверить устройства
flutter devices

# Подробные логи
flutter run -v

# Flutter doctor с подробностями
flutter doctor -v
```

---

**Удачной разработки! 🚀**

