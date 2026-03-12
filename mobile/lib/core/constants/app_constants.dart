/// Константы приложения МастерОК
class AppConstants {
  AppConstants._();

  // Информация о приложении
  static const String appName = 'МастерОК';
  static const String appVersion = '2.0.0';
  static const String appDescription = 'Платформа строительных услуг №1 в России';

  // API
  static const String baseUrl = 'https://api.masterok.ru';
  static const String wsUrl = 'wss://api.masterok.ru/ws';
  
  // Валюта
  static const String currency = '₽';
  static const String currencyCode = 'RUB';
  
  // Локализация
  static const String locale = 'ru_RU';
  static const String language = 'ru';
  static const String country = 'RU';
  
  // Контакты
  static const String supportPhone = '+7 (800) 555-35-35';
  static const String supportEmail = 'support@masterok.ru';
  static const String supportTelegram = '@masterok_support';
  static const String supportWhatsApp = '+79001234567';

  // Социальные сети
  static const String vkUrl = 'https://vk.com/masterok_app';
  static const String telegramUrl = 'https://t.me/masterok_official';
  static const String youtubeUrl = 'https://youtube.com/@masterok';
  static const String rutube = 'https://rutube.ru/c/masterok';
  static const String dzen = 'https://dzen.ru/masterok';
  
  // Комиссии
  static const double platformCommission = 0.10; // 10%
  static const double minCommission = 50.0; // Минимум 50₽
  static const double maxCommission = 5000.0; // Максимум 5000₽
  
  // Лимиты
  static const int minOrderBudget = 500; // Минимум 500₽
  static const int maxOrderBudget = 1000000; // Максимум 1 млн₽
  static const int maxPhotosPerOrder = 10;
  static const int maxPhotosPerReview = 5;
  static const int maxMessageLength = 1000;
  static const int maxOrderDescriptionLength = 2000;
  
  // Рейтинги
  static const double minRating = 1.0;
  static const double maxRating = 5.0;
  static const int minReviewsForTop = 10;
  static const double minRatingForTop = 4.5;
  
  // Кэшбек и бонусы
  static const double cashbackPercent = 0.05; // 5% кэшбек
  static const int bonusForFirstOrder = 500; // 500₽ за первый заказ
  static const int bonusForReferral = 1000; // 1000₽ за реферала
  static const int bonusForReview = 100; // 100₽ за отзыв
  
  // Регионы России (топ-20)
  static const List<String> regions = [
    'Москва',
    'Санкт-Петербург',
    'Московская область',
    'Ленинградская область',
    'Новосибирск',
    'Екатеринбург',
    'Казань',
    'Нижний Новгород',
    'Челябинск',
    'Самара',
    'Омск',
    'Ростов-на-Дону',
    'Уфа',
    'Красноярск',
    'Воронеж',
    'Пермь',
    'Волгоград',
    'Краснодар',
    'Саратов',
    'Тюмень',
  ];
  
  // Категории услуг (топ-20 для РФ)
  static const List<Map<String, dynamic>> categories = [
    {'id': 1, 'name': 'Ремонт квартир', 'icon': 'construction', 'color': 0xFFFF9800},
    {'id': 2, 'name': 'Сантехника', 'icon': 'plumbing', 'color': 0xFF2196F3},
    {'id': 3, 'name': 'Электрика', 'icon': 'electrical_services', 'color': 0xFFFFC107},
    {'id': 4, 'name': 'Отделочные работы', 'icon': 'format_paint', 'color': 0xFF9C27B0},
    {'id': 5, 'name': 'Укладка плитки', 'icon': 'grid_on', 'color': 0xFF00BCD4},
    {'id': 6, 'name': 'Установка дверей', 'icon': 'door_front', 'color': 0xFF795548},
    {'id': 7, 'name': 'Установка окон', 'icon': 'window', 'color': 0xFF607D8B},
    {'id': 8, 'name': 'Сборка мебели', 'icon': 'chair', 'color': 0xFF8BC34A},
    {'id': 9, 'name': 'Натяжные потолки', 'icon': 'layers', 'color': 0xFF3F51B5},
    {'id': 10, 'name': 'Утепление', 'icon': 'ac_unit', 'color': 0xFF00BCD4},
    {'id': 11, 'name': 'Кровельные работы', 'icon': 'roofing', 'color': 0xFF795548},
    {'id': 12, 'name': 'Фасадные работы', 'icon': 'home', 'color': 0xFFFF5722},
    {'id': 13, 'name': 'Дизайн интерьера', 'icon': 'palette', 'color': 0xFFE91E63},
    {'id': 14, 'name': 'Уборка', 'icon': 'cleaning_services', 'color': 0xFF4CAF50},
    {'id': 15, 'name': 'Грузоперевозки', 'icon': 'local_shipping', 'color': 0xFFFF9800},
    {'id': 16, 'name': 'Кондиционеры', 'icon': 'air', 'color': 0xFF03A9F4},
    {'id': 17, 'name': 'Отопление', 'icon': 'whatshot', 'color': 0xFFFF5722},
    {'id': 18, 'name': 'Вентиляция', 'icon': 'air', 'color': 0xFF00BCD4},
    {'id': 19, 'name': 'Умный дом', 'icon': 'lightbulb', 'color': 0xFFFFC107},
    {'id': 20, 'name': 'Другое', 'icon': 'more_horiz', 'color': 0xFF9E9E9E},
  ];
  
  // Платежные системы РФ
  static const List<Map<String, String>> paymentMethods = [
    {'id': 'sbp', 'name': 'СБП (Система быстрых платежей)', 'icon': 'account_balance'},
    {'id': 'yookassa', 'name': 'ЮKassa', 'icon': 'credit_card'},
    {'id': 'sberbank', 'name': 'Сбербанк Онлайн', 'icon': 'account_balance'},
    {'id': 'tinkoff', 'name': 'Тинькофф', 'icon': 'account_balance'},
    {'id': 'yandex', 'name': 'ЮMoney', 'icon': 'account_balance_wallet'},
    {'id': 'qiwi', 'name': 'QIWI', 'icon': 'account_balance_wallet'},
    {'id': 'alfa', 'name': 'Альфа-Банк', 'icon': 'account_balance'},
    {'id': 'vtb', 'name': 'ВТБ', 'icon': 'account_balance'},
    {'id': 'mir', 'name': 'Карта МИР', 'icon': 'credit_card'},
    {'id': 'cash', 'name': 'Наличные', 'icon': 'payments'},
  ];
  
  // Время работы
  static const String workingHoursStart = '08:00';
  static const String workingHoursEnd = '22:00';
  static const List<String> workingDays = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
  ];
  
  // Документы
  static const String privacyPolicyUrl = 'https://masterok.ru/privacy';
  static const String termsOfServiceUrl = 'https://masterok.ru/terms';
  static const String userAgreementUrl = 'https://masterok.ru/agreement';
  
  // Маркетинг
  static const String promoCode = 'MASTEROK2026';
  static const double promoDiscount = 0.20; // 20% скидка
  static const int promoValidDays = 30;
  
  // Статистика
  static const String totalSpecialists = '12,345+';
  static const String totalOrders = '56,789+';
  static const String totalCities = '100+';
  static const String averageRating = '4.8';
  
  // Фичи для РФ рынка
  static const bool enableVoiceSearch = true;
  static const bool enableAIAssistant = true;
  static const bool enableCashback = true;
  static const bool enableReferralProgram = true;
  static const bool enableLoyaltyProgram = true;
  static const bool enableVideoReviews = true;
  static const bool enableLiveChat = true;
  static const bool enablePushNotifications = true;
  
  // Ссылки на рилсы/видео
  static const String reelsVK = 'https://vk.com/masterok_app/clips';
  static const String reelsTelegram = 'https://t.me/masterok_reels';
  static const String reelsYouTube = 'https://youtube.com/@masterok/shorts';
  static const String reelsRuTube = 'https://rutube.ru/c/masterok/shorts';
  static const String reelsDzen = 'https://dzen.ru/masterok/video';

  // Тексты для рекламы
  static const String adTitle = 'МастерОК — Найдите мастера за 5 минут!';
  static const String adDescription = 'Проверенные специалисты • Безопасная оплата • Гарантия качества';
  static const List<String> adBenefits = [
    '✅ 12,345+ проверенных специалистов',
    '✅ Безопасная оплата через эскроу',
    '✅ Гарантия качества работ',
    '✅ Страхование до 100,000₽',
    '✅ 5% кэшбек на все заказы',
    '✅ Поддержка 24/7',
  ];

  // Deep links
  static const String appStoreUrl = 'https://apps.apple.com/ru/app/masterok';
  static const String playStoreUrl = 'https://play.google.com/store/apps/details?id=com.masterok.app';
  static const String webAppUrl = 'https://masterok.ru';
}
