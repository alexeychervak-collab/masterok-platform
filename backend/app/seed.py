"""
Скрипт заполнения базы данных демо-данными для платформы МастерОК.
Запуск: python -m app.seed
"""

import uuid
import random
from datetime import datetime, timedelta

import bcrypt
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.user import User, UserRole
from app.models.category import Category, Skill
from app.models.specialist import Specialist, SpecialistSkill, SkillLevel
from app.models.service import Service
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.order_bid import OrderBid, BidStatus
from app.models.review import Review


def _uid() -> str:
    return str(uuid.uuid4())


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


# ---------------------------------------------------------------------------
# Константы
# ---------------------------------------------------------------------------
DEFAULT_PASSWORD = _hash_password("demo123")

MALE_NAMES = [
    "Иван", "Алексей", "Дмитрий", "Сергей", "Андрей",
    "Михаил", "Николай", "Владимир", "Олег", "Павел",
    "Артём", "Роман", "Виктор", "Максим", "Александр",
    "Евгений", "Денис", "Кирилл", "Антон", "Василий",
    "Юрий", "Игорь", "Тимур", "Руслан", "Григорий",
]

MALE_SURNAMES = [
    "Иванов", "Петров", "Сидоров", "Козлов", "Новиков",
    "Морозов", "Соколов", "Лебедев", "Кузнецов", "Попов",
    "Волков", "Зайцев", "Белов", "Орлов", "Титов",
    "Громов", "Фёдоров", "Макаров", "Степанов", "Егоров",
    "Шилов", "Рябов", "Борисов", "Гончаров", "Никитин",
]

FEMALE_NAMES = [
    "Анна", "Елена", "Мария", "Ольга", "Наталья",
    "Екатерина", "Ирина", "Татьяна", "Светлана", "Юлия",
]

FEMALE_SURNAMES = [
    "Петрова", "Иванова", "Сидорова", "Козлова", "Новикова",
    "Морозова", "Соколова", "Лебедева", "Кузнецова", "Попова",
]

CITIES_DISTRIBUTION = [
    ("Москва", 18),
    ("Санкт-Петербург", 10),
    ("Казань", 6),
    ("Новосибирск", 5),
    ("Екатеринбург", 4),
    ("Краснодар", 4),
    ("Нижний Новгород", 3),
]

WORK_SCHEDULES = [
    "Пн-Пт 9:00-18:00",
    "Пн-Пт 8:00-17:00",
    "Пн-Сб 9:00-19:00",
    "Ежедневно 8:00-20:00",
    "Пн-Пт 10:00-19:00",
    "Пн-Сб 8:00-18:00",
    "Пн-Вс 9:00-21:00",
    "Пн-Пт 9:00-17:00, Сб по договорённости",
]

EDUCATIONS = [
    "Высшее техническое, МГСУ",
    "Среднее специальное, строительный колледж",
    "Высшее, политехнический институт",
    "Профессиональные курсы, сертификат мастера",
    "Высшее техническое, МГТУ им. Баумана",
    "Среднее специальное, техникум",
    "Высшее, архитектурный институт",
    "Курсы повышения квалификации, ТехноНИКОЛЬ",
    "Высшее техническое, СПбГАСУ",
    "Среднее специальное, ПТУ, курсы повышения квалификации",
    "Высшее, строительный университет",
    "Профессиональная переподготовка, Академия ДПО",
    None,
    None,
]

# ---------------------------------------------------------------------------
# 20 Категорий + 4 навыка каждая
# ---------------------------------------------------------------------------
CATEGORIES_DATA = [
    {
        "name": "Ремонт квартир",
        "slug": "remont-kvartir",
        "icon": "\U0001f528",
        "description": "Комплексный и частичный ремонт квартир: косметический, капитальный, евроремонт, отделка под ключ.",
        "image": "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800",
        "skills": [
            ("Косметический ремонт", "kosmeticheskiy-remont"),
            ("Капитальный ремонт", "kapitalnyy-remont"),
            ("Евроремонт", "evroremont"),
            ("Отделка под ключ", "otdelka-pod-klyuch"),
        ],
    },
    {
        "name": "Строительство домов",
        "slug": "stroitelstvo-domov",
        "icon": "\U0001f3d7\ufe0f",
        "description": "Строительство частных домов, коттеджей, бань и хозяйственных построек из любых материалов.",
        "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
        "skills": [
            ("Каркасное строительство", "karkasnoe-stroitelstvo"),
            ("Кирпичная кладка", "kirpichnaya-kladka"),
            ("Строительство из бруса", "stroitelstvo-iz-brusa"),
            ("Фундаментные работы", "fundamentnye-raboty"),
        ],
    },
    {
        "name": "Электромонтаж",
        "slug": "elektromontazh",
        "icon": "\u26a1",
        "description": "Электромонтажные работы любой сложности: проводка, щитки, розетки, освещение, слаботочные системы.",
        "image": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
        "skills": [
            ("Монтаж проводки", "montazh-provodki"),
            ("Установка розеток и выключателей", "ustanovka-rozetok"),
            ("Сборка электрощитов", "sborka-elektroshchitov"),
            ("Монтаж освещения", "montazh-osveshcheniya"),
        ],
    },
    {
        "name": "Сантехника",
        "slug": "santehnika",
        "icon": "\U0001f6b0",
        "description": "Монтаж и ремонт сантехники: трубы, смесители, унитазы, ванны, водонагреватели, канализация.",
        "image": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800",
        "skills": [
            ("Замена труб", "zamena-trub"),
            ("Установка сантехники", "ustanovka-santehniki"),
            ("Монтаж водонагревателей", "montazh-vodonagrevatelej"),
            ("Прочистка канализации", "prochistka-kanalizacii"),
        ],
    },
    {
        "name": "Дизайн интерьера",
        "slug": "dizajn-interera",
        "icon": "\U0001f3a8",
        "description": "Разработка дизайн-проектов квартир, домов и коммерческих помещений с авторским надзором.",
        "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
        "skills": [
            ("3D-визуализация", "3d-vizualizaciya"),
            ("Планировочные решения", "planirovochnye-resheniya"),
            ("Подбор материалов", "podbor-materialov"),
            ("Авторский надзор", "avtorskij-nadzor"),
        ],
    },
    {
        "name": "Кровельные работы",
        "slug": "krovelnye-raboty",
        "icon": "\U0001f3e0",
        "description": "Устройство и ремонт кровли: металлочерепица, мягкая кровля, профнастил, водосточные системы.",
        "image": "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=800",
        "skills": [
            ("Монтаж металлочерепицы", "montazh-metallocherepicy"),
            ("Мягкая кровля", "myagkaya-krovlya"),
            ("Ремонт кровли", "remont-krovli"),
            ("Водосточные системы", "vodostochnye-sistemy"),
        ],
    },
    {
        "name": "Фасадные работы",
        "slug": "fasadnye-raboty",
        "icon": "\U0001f3ad",
        "description": "Отделка и утепление фасадов: штукатурка, сайдинг, вентилируемые фасады, покраска.",
        "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        "skills": [
            ("Штукатурка фасадов", "shtukaturka-fasadov"),
            ("Монтаж сайдинга", "montazh-sajdinga"),
            ("Вентилируемые фасады", "ventiliruemye-fasady"),
            ("Покраска фасадов", "pokraska-fasadov"),
        ],
    },
    {
        "name": "Плиточные работы",
        "slug": "plitochnye-raboty",
        "icon": "\U0001f532",
        "description": "Укладка плитки и керамогранита на полы, стены. Мозаика, затирка, гидроизоляция.",
        "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
        "skills": [
            ("Укладка напольной плитки", "ukladka-napolnoj-plitki"),
            ("Укладка настенной плитки", "ukladka-nastennoj-plitki"),
            ("Мозаичные работы", "mozaichnye-raboty"),
            ("Гидроизоляция", "gidroizolyaciya"),
        ],
    },
    {
        "name": "Малярные работы",
        "slug": "malyarnye-raboty",
        "icon": "\U0001f58c\ufe0f",
        "description": "Покраска стен и потолков, поклейка обоев, декоративная штукатурка, шпатлёвка, выравнивание.",
        "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
        "skills": [
            ("Покраска стен", "pokraska-sten"),
            ("Поклейка обоев", "poklejka-oboev"),
            ("Декоративная штукатурка", "dekorativnaya-shtukaturka"),
            ("Шпатлёвка и выравнивание", "shpatlyovka-i-vyravnivanie"),
        ],
    },
    {
        "name": "Утепление",
        "slug": "uteplenie",
        "icon": "\U0001f9ca",
        "description": "Утепление стен, полов, кровли и фасадов. Пенопласт, минвата, пенополиуретан.",
        "image": "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800",
        "skills": [
            ("Утепление стен", "uteplenie-sten"),
            ("Утепление кровли", "uteplenie-krovli"),
            ("Утепление пола", "uteplenie-pola"),
            ("Напыление ППУ", "napylenie-ppu"),
        ],
    },
    {
        "name": "Установка окон",
        "slug": "ustanovka-okon",
        "icon": "\U0001fa9f",
        "description": "Установка и замена окон ПВХ, деревянных и алюминиевых. Откосы, подоконники, москитные сетки.",
        "image": "https://images.unsplash.com/photo-1585129777188-94600bc7b4b3?w=800",
        "skills": [
            ("Монтаж окон ПВХ", "montazh-okon-pvh"),
            ("Установка откосов", "ustanovka-otkosov"),
            ("Остекление балконов", "osteklenie-balkonov"),
            ("Ремонт окон", "remont-okon"),
        ],
    },
    {
        "name": "Натяжные потолки",
        "slug": "natyazhnye-potolki",
        "icon": "\u2728",
        "description": "Монтаж натяжных потолков: матовые, глянцевые, сатиновые, многоуровневые, с подсветкой.",
        "image": "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800",
        "skills": [
            ("Монтаж натяжных потолков", "montazh-natyazhnyh-potolkov"),
            ("Многоуровневые потолки", "mnogourovnevye-potolki"),
            ("Световые линии", "svetovye-linii"),
            ("Ремонт натяжных потолков", "remont-natyazhnyh-potolkov"),
        ],
    },
    {
        "name": "Ландшафтный дизайн",
        "slug": "landshaftnyj-dizajn",
        "icon": "\U0001f33f",
        "description": "Благоустройство участков: газоны, дорожки, клумбы, системы полива, освещение, малые формы.",
        "image": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
        "skills": [
            ("Устройство газона", "ustrojstvo-gazona"),
            ("Мощение дорожек", "moshchenie-dorozhek"),
            ("Системы автополива", "sistemy-avtopoliva"),
            ("Озеленение", "ozelenenie"),
        ],
    },
    {
        "name": "Мебель на заказ",
        "slug": "mebel-na-zakaz",
        "icon": "\U0001fa91",
        "description": "Изготовление мебели по индивидуальным проектам: кухни, шкафы-купе, гардеробные, столы.",
        "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
        "skills": [
            ("Корпусная мебель", "korpusnaya-mebel"),
            ("Кухни на заказ", "kuhni-na-zakaz"),
            ("Шкафы-купе", "shkafy-kupe"),
            ("Столярные работы", "stolyarnye-raboty"),
        ],
    },
    {
        "name": "Инженерные сети",
        "slug": "inzhenernye-seti",
        "icon": "\U0001f527",
        "description": "Проектирование и монтаж инженерных коммуникаций: отопление, вентиляция, водоснабжение.",
        "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
        "skills": [
            ("Монтаж отопления", "montazh-otopleniya"),
            ("Системы вентиляции", "sistemy-ventilyacii"),
            ("Тёплые полы", "tyoplye-poly"),
            ("Монтаж водоснабжения", "montazh-vodosnabzheniya"),
        ],
    },
    {
        "name": "Кондиционеры",
        "slug": "kondicionery",
        "icon": "\u2744\ufe0f",
        "description": "Продажа, установка и обслуживание кондиционеров и сплит-систем всех типов.",
        "image": "https://images.unsplash.com/photo-1631545806609-35dab5d34286?w=800",
        "skills": [
            ("Установка сплит-систем", "ustanovka-split-sistem"),
            ("Обслуживание кондиционеров", "obsluzhivanie-kondicionerov"),
            ("Монтаж мульти-сплит", "montazh-multi-split"),
            ("Ремонт кондиционеров", "remont-kondicionerov"),
        ],
    },
    {
        "name": "Клининг",
        "slug": "klining",
        "icon": "\U0001f9f9",
        "description": "Профессиональная уборка квартир, домов и офисов. Генеральная уборка, после ремонта, химчистка.",
        "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
        "skills": [
            ("Генеральная уборка", "generalnaya-uborka"),
            ("Уборка после ремонта", "uborka-posle-remonta"),
            ("Химчистка мебели", "himchistka-mebeli"),
            ("Мойка окон", "mojka-okon"),
        ],
    },
    {
        "name": "Переезды",
        "slug": "pereezdy",
        "icon": "\U0001f69a",
        "description": "Квартирные и офисные переезды, грузоперевозки, услуги грузчиков, упаковка вещей.",
        "image": "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800",
        "skills": [
            ("Квартирный переезд", "kvartirnyj-pereezd"),
            ("Офисный переезд", "ofisnyj-pereezd"),
            ("Грузоперевозки", "gruzoperevozki"),
            ("Услуги грузчиков", "uslugi-gruzchikov"),
        ],
    },
    {
        "name": "Демонтаж",
        "slug": "demontazh",
        "icon": "\U0001f4a5",
        "description": "Демонтажные работы: снос стен, демонтаж полов, потолков, перегородок, старой отделки.",
        "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
        "skills": [
            ("Демонтаж стен", "demontazh-sten"),
            ("Демонтаж полов", "demontazh-polov"),
            ("Снос перегородок", "snos-peregorodok"),
            ("Вывоз мусора", "vyvoz-musora"),
        ],
    },
    {
        "name": "Металлоконструкции",
        "slug": "metallokonstrukcii",
        "icon": "\u2699\ufe0f",
        "description": "Изготовление и монтаж металлоконструкций: лестницы, навесы, ворота, ограждения, каркасы.",
        "image": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800",
        "skills": [
            ("Сварочные работы", "svarochnye-raboty"),
            ("Изготовление лестниц", "izgotovlenie-lestnic"),
            ("Монтаж навесов", "montazh-navesov"),
            ("Ворота и ограждения", "vorota-i-ograzhdeniya"),
        ],
    },
]

# ---------------------------------------------------------------------------
# 50 Специалистов — подробные данные
# ---------------------------------------------------------------------------
SPECIALISTS_DATA = [
    # --- Москва (18) ---
    {
        "name": "Иван Иванов", "email": "specialist1@masterok.ru", "phone": "+79001234501",
        "city": "Москва", "experience": 15, "rating": 4.9, "review_count": 87,
        "completed_orders": 234, "response_time": 15, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Мастер по ремонту квартир",
        "description": "Выполняю все виды отделочных работ. 15 лет опыта в ремонте квартир и домов. Работаю с любыми материалами, соблюдаю сроки. Бесплатный выезд на замер.",
        "education": "Высшее техническое, МГСУ",
        "categories": [0, 7, 8],
    },
    {
        "name": "Алексей Петров", "email": "specialist2@masterok.ru", "phone": "+79001234502",
        "city": "Москва", "experience": 10, "rating": 4.8, "review_count": 56,
        "completed_orders": 178, "response_time": 20, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Электрик высшей категории",
        "description": "Электромонтажные работы любой сложности. Имею допуск до 1000В. Проводка, щитки, умный дом. Работаю по ГОСТу и ПУЭ.",
        "education": "Высшее техническое, МГТУ им. Баумана",
        "categories": [2],
    },
    {
        "name": "Дмитрий Сидоров", "email": "specialist3@masterok.ru", "phone": "+79001234503",
        "city": "Москва", "experience": 8, "rating": 4.7, "review_count": 43,
        "completed_orders": 129, "response_time": 30, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Сантехник-универсал",
        "description": "Все виды сантехнических работ: от замены смесителя до полной разводки труб. Работаю аккуратно, убираю за собой. Гарантия 2 года.",
        "education": "Среднее специальное, строительный колледж",
        "categories": [3, 14],
    },
    {
        "name": "Сергей Козлов", "email": "specialist4@masterok.ru", "phone": "+79001234504",
        "city": "Москва", "experience": 20, "rating": 5.0, "review_count": 112,
        "completed_orders": 350, "response_time": 10, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Прораб, комплексный ремонт под ключ",
        "description": "Организую и выполняю ремонт квартир под ключ. Своя бригада проверенных мастеров. Составляю сметы, контролирую каждый этап. 20 лет в строительстве.",
        "education": "Высшее, политехнический институт",
        "categories": [0, 1],
    },
    {
        "name": "Андрей Новиков", "email": "specialist5@masterok.ru", "phone": "+79001234505",
        "city": "Москва", "experience": 5, "rating": 4.6, "review_count": 28,
        "completed_orders": 67, "response_time": 45, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Дизайнер интерьера",
        "description": "Создаю функциональные и красивые интерьеры. 3D-визуализация, подбор материалов, авторский надзор. Работаю в стилях: современный, лофт, минимализм, скандинавский.",
        "education": "Высшее, архитектурный институт",
        "categories": [4],
    },
    {
        "name": "Михаил Морозов", "email": "specialist6@masterok.ru", "phone": "+79001234506",
        "city": "Москва", "experience": 12, "rating": 4.8, "review_count": 65,
        "completed_orders": 198, "response_time": 20, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Плиточник-отделочник",
        "description": "Профессиональная укладка плитки и керамогранита. Сложные рисунки, мозаика, подрезка под 45 градусов. Гидроизоляция ванных комнат.",
        "education": "Среднее специальное, техникум",
        "categories": [7],
    },
    {
        "name": "Николай Соколов", "email": "specialist7@masterok.ru", "phone": "+79001234507",
        "city": "Москва", "experience": 7, "rating": 4.5, "review_count": 31,
        "completed_orders": 89, "response_time": 40, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Маляр-штукатур",
        "description": "Качественная покраска стен и потолков, поклейка обоев, декоративная штукатурка. Идеально ровные поверхности. Работаю с импортными и отечественными материалами.",
        "education": "Профессиональные курсы, сертификат мастера",
        "categories": [8],
    },
    {
        "name": "Владимир Лебедев", "email": "specialist8@masterok.ru", "phone": "+79001234508",
        "city": "Москва", "experience": 18, "rating": 4.9, "review_count": 94,
        "completed_orders": 267, "response_time": 15, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Строитель-каменщик",
        "description": "Строительство домов из кирпича, блоков, бруса. Фундаменты, стены, перегородки. Полный цикл строительных работ. Работаю по Москве и области.",
        "education": "Высшее техническое, МГСУ",
        "categories": [1],
    },
    {
        "name": "Олег Кузнецов", "email": "specialist9@masterok.ru", "phone": "+79001234509",
        "city": "Москва", "experience": 6, "rating": 4.4, "review_count": 22,
        "completed_orders": 54, "response_time": 60, "is_verified": True, "is_premium": False, "is_available": False,
        "title": "Мастер по установке окон",
        "description": "Установка пластиковых и деревянных окон. Откосы, подоконники, отливы. Остекление балконов и лоджий. Ремонт оконной фурнитуры.",
        "education": "Среднее специальное, строительный колледж",
        "categories": [10],
    },
    {
        "name": "Павел Попов", "email": "specialist10@masterok.ru", "phone": "+79001234510",
        "city": "Москва", "experience": 9, "rating": 4.7, "review_count": 48,
        "completed_orders": 143, "response_time": 25, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Мастер натяжных потолков",
        "description": "Монтаж натяжных потолков за 1 день. Матовые, глянцевые, сатиновые, тканевые. Многоуровневые конструкции, световые линии, парящие потолки.",
        "education": "Курсы повышения квалификации, ТехноНИКОЛЬ",
        "categories": [11],
    },
    {
        "name": "Артём Волков", "email": "specialist11@masterok.ru", "phone": "+79001234511",
        "city": "Москва", "experience": 4, "rating": 4.3, "review_count": 18,
        "completed_orders": 42, "response_time": 50, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Мастер по кондиционерам",
        "description": "Установка и обслуживание сплит-систем и мульти-сплит. Чистка, заправка фреоном, диагностика. Работаю с брендами: Daikin, Mitsubishi, LG, Samsung.",
        "education": None,
        "categories": [15],
    },
    {
        "name": "Роман Зайцев", "email": "specialist12@masterok.ru", "phone": "+79001234512",
        "city": "Москва", "experience": 14, "rating": 4.8, "review_count": 73,
        "completed_orders": 215, "response_time": 20, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Кровельщик",
        "description": "Монтаж и ремонт кровли любой сложности. Металлочерепица, гибкая черепица, профнастил, фальцевая кровля. Водосточные системы, снегозадержатели.",
        "education": "Высшее техническое, СПбГАСУ",
        "categories": [5],
    },
    {
        "name": "Виктор Белов", "email": "specialist13@masterok.ru", "phone": "+79001234513",
        "city": "Москва", "experience": 11, "rating": 4.6, "review_count": 39,
        "completed_orders": 112, "response_time": 35, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Фасадчик-утеплитель",
        "description": "Утепление и отделка фасадов. Мокрый фасад, вентилируемый фасад, сайдинг. Штукатурка и покраска. Работаю на высоте.",
        "education": "Среднее специальное, техникум",
        "categories": [6, 9],
    },
    {
        "name": "Максим Орлов", "email": "specialist14@masterok.ru", "phone": "+79001234514",
        "city": "Москва", "experience": 3, "rating": 4.2, "review_count": 14,
        "completed_orders": 31, "response_time": 55, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Мастер по демонтажу",
        "description": "Демонтажные работы: снос стен и перегородок, демонтаж полов, потолков, старой отделки. Вывоз строительного мусора. Быстро и аккуратно.",
        "education": None,
        "categories": [18],
    },
    {
        "name": "Александр Титов", "email": "specialist15@masterok.ru", "phone": "+79001234515",
        "city": "Москва", "experience": 16, "rating": 4.9, "review_count": 81,
        "completed_orders": 245, "response_time": 15, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Сварщик, мастер по металлоконструкциям",
        "description": "Изготовление и монтаж металлоконструкций: лестницы, перила, навесы, ворота, заборы. Аргонная и полуавтоматическая сварка. Собственная мастерская.",
        "education": "Высшее техническое, МГТУ им. Баумана",
        "categories": [19],
    },
    {
        "name": "Евгений Громов", "email": "specialist16@masterok.ru", "phone": "+79001234516",
        "city": "Москва", "experience": 8, "rating": 4.5, "review_count": 34,
        "completed_orders": 98, "response_time": 30, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Мастер по мебели на заказ",
        "description": "Изготовление корпусной мебели по индивидуальным размерам. Кухни, шкафы-купе, гардеробные, стеллажи. Замер, проект, производство, установка.",
        "education": "Среднее специальное, строительный колледж",
        "categories": [13],
    },
    {
        "name": "Денис Фёдоров", "email": "specialist17@masterok.ru", "phone": "+79001234517",
        "city": "Москва", "experience": 6, "rating": 4.6, "review_count": 29,
        "completed_orders": 76, "response_time": 40, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Ландшафтный дизайнер",
        "description": "Благоустройство придомовых территорий. Газоны, мощение дорожек, клумбы, системы автополива, освещение участка. Проект и реализация.",
        "education": "Высшее, архитектурный институт",
        "categories": [12],
    },
    {
        "name": "Кирилл Макаров", "email": "specialist18@masterok.ru", "phone": "+79001234518",
        "city": "Москва", "experience": 2, "rating": 4.1, "review_count": 9,
        "completed_orders": 18, "response_time": 60, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Мастер клининга",
        "description": "Профессиональная уборка квартир и домов. Генеральная уборка, после ремонта, регулярная уборка. Использую профессиональное оборудование и экосредства.",
        "education": None,
        "categories": [16],
    },
    # --- Санкт-Петербург (10) ---
    {
        "name": "Антон Степанов", "email": "specialist19@masterok.ru", "phone": "+79001234519",
        "city": "Санкт-Петербург", "experience": 12, "rating": 4.8, "review_count": 67,
        "completed_orders": 198, "response_time": 20, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Мастер по ремонту квартир",
        "description": "Комплексный ремонт квартир в Санкт-Петербурге. Работаю со старым фондом и новостройками. Выравнивание стен, полов, все виды отделки.",
        "education": "Высшее техническое, СПбГАСУ",
        "categories": [0, 8],
    },
    {
        "name": "Василий Егоров", "email": "specialist20@masterok.ru", "phone": "+79001234520",
        "city": "Санкт-Петербург", "experience": 9, "rating": 4.7, "review_count": 44,
        "completed_orders": 132, "response_time": 25, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Электрик",
        "description": "Электромонтаж в квартирах и домах. Замена проводки, установка щитков, розеток, выключателей. Монтаж люстр и точечного освещения.",
        "education": "Среднее специальное, техникум",
        "categories": [2],
    },
    {
        "name": "Юрий Шилов", "email": "specialist21@masterok.ru", "phone": "+79001234521",
        "city": "Санкт-Петербург", "experience": 7, "rating": 4.5, "review_count": 31,
        "completed_orders": 87, "response_time": 35, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Сантехник",
        "description": "Установка и замена сантехники, разводка труб, подключение стиральных и посудомоечных машин. Устранение протечек. Работаю по СПб и Ленобласти.",
        "education": "Среднее специальное, строительный колледж",
        "categories": [3],
    },
    {
        "name": "Игорь Рябов", "email": "specialist22@masterok.ru", "phone": "+79001234522",
        "city": "Санкт-Петербург", "experience": 15, "rating": 4.9, "review_count": 78,
        "completed_orders": 223, "response_time": 15, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Строитель, каркасные дома",
        "description": "Строительство каркасных домов и бань. Фундаменты, стены, кровля, отделка. Полный цикл от проекта до сдачи. Работаю по СПб и Ленобласти.",
        "education": "Высшее, строительный университет",
        "categories": [1, 5],
    },
    {
        "name": "Тимур Борисов", "email": "specialist23@masterok.ru", "phone": "+79001234523",
        "city": "Санкт-Петербург", "experience": 5, "rating": 4.4, "review_count": 21,
        "completed_orders": 53, "response_time": 45, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Плиточник",
        "description": "Укладка плитки в ванных комнатах, кухнях, на полу. Керамогранит, мозаика. Гидроизоляция. Аккуратный и ответственный подход к работе.",
        "education": "Профессиональные курсы, сертификат мастера",
        "categories": [7],
    },
    {
        "name": "Руслан Гончаров", "email": "specialist24@masterok.ru", "phone": "+79001234524",
        "city": "Санкт-Петербург", "experience": 10, "rating": 4.6, "review_count": 42,
        "completed_orders": 126, "response_time": 30, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Инженер по отоплению и вентиляции",
        "description": "Проектирование и монтаж систем отопления, вентиляции, тёплых полов. Подбор оборудования, пусконаладка. Обслуживание котельных.",
        "education": "Высшее техническое, СПбГАСУ",
        "categories": [14],
    },
    {
        "name": "Григорий Никитин", "email": "specialist25@masterok.ru", "phone": "+79001234525",
        "city": "Санкт-Петербург", "experience": 4, "rating": 4.3, "review_count": 17,
        "completed_orders": 39, "response_time": 50, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Мастер натяжных потолков",
        "description": "Быстрый и качественный монтаж натяжных потолков. Все виды полотен, многоуровневые конструкции, подсветка. Выезд по СПб бесплатно.",
        "education": None,
        "categories": [11],
    },
    {
        "name": "Иван Козлов", "email": "specialist26@masterok.ru", "phone": "+79001234526",
        "city": "Санкт-Петербург", "experience": 13, "rating": 4.7, "review_count": 52,
        "completed_orders": 167, "response_time": 20, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Мастер по фасадам и утеплению",
        "description": "Утепление и отделка фасадов домов. Мокрый фасад, штукатурка, сайдинг, клинкерная плитка. Работаю с промышленными альпинистами.",
        "education": "Высшее, политехнический институт",
        "categories": [6, 9],
    },
    {
        "name": "Алексей Волков", "email": "specialist27@masterok.ru", "phone": "+79001234527",
        "city": "Санкт-Петербург", "experience": 3, "rating": 4.0, "review_count": 11,
        "completed_orders": 24, "response_time": 60, "is_verified": False, "is_premium": False, "is_available": False,
        "title": "Грузчик, помощь с переездом",
        "description": "Квартирные и офисные переезды. Аккуратная погрузка, перевозка, разгрузка. Сборка и разборка мебели. Упаковочные материалы в наличии.",
        "education": None,
        "categories": [17],
    },
    # --- Казань (6) ---
    {
        "name": "Дмитрий Новиков", "email": "specialist28@masterok.ru", "phone": "+79001234528",
        "city": "Казань", "experience": 11, "rating": 4.8, "review_count": 58,
        "completed_orders": 173, "response_time": 20, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Мастер по ремонту и отделке",
        "description": "Все виды ремонтных и отделочных работ в Казани. Квартиры, дома, офисы. Штукатурка, покраска, плитка, ламинат. Работаю качественно и в срок.",
        "education": "Высшее, строительный университет",
        "categories": [0, 7, 8],
    },
    {
        "name": "Сергей Морозов", "email": "specialist29@masterok.ru", "phone": "+79001234529",
        "city": "Казань", "experience": 8, "rating": 4.6, "review_count": 35,
        "completed_orders": 104, "response_time": 30, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Электрик-монтажник",
        "description": "Электромонтажные работы в Казани. Проводка, щитки, розетки, освещение. Монтаж систем умного дома. Допуск до 1000В.",
        "education": "Среднее специальное, техникум",
        "categories": [2],
    },
    {
        "name": "Андрей Соколов", "email": "specialist30@masterok.ru", "phone": "+79001234530",
        "city": "Казань", "experience": 6, "rating": 4.5, "review_count": 27,
        "completed_orders": 68, "response_time": 40, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Сантехник-отделочник",
        "description": "Сантехнические и отделочные работы. Замена труб, установка сантехники, укладка плитки в санузлах. Комплексный ремонт ванных комнат.",
        "education": "Среднее специальное, строительный колледж",
        "categories": [3, 7],
    },
    {
        "name": "Михаил Лебедев", "email": "specialist31@masterok.ru", "phone": "+79001234531",
        "city": "Казань", "experience": 14, "rating": 4.7, "review_count": 49,
        "completed_orders": 156, "response_time": 25, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Строитель домов и бань",
        "description": "Строительство домов из кирпича и блоков. Бани из бруса. Фундаменты, стены, кровля. Работаю по Казани и Татарстану. Гарантия 5 лет.",
        "education": "Высшее, политехнический институт",
        "categories": [1, 5],
    },
    {
        "name": "Николай Попов", "email": "specialist32@masterok.ru", "phone": "+79001234532",
        "city": "Казань", "experience": 5, "rating": 4.4, "review_count": 19,
        "completed_orders": 47, "response_time": 45, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Мастер по мебели",
        "description": "Изготовление корпусной мебели на заказ в Казани. Кухни, шкафы, тумбы, комоды. Использую качественную фурнитуру. Замер и доставка бесплатно.",
        "education": "Среднее специальное, техникум",
        "categories": [13],
    },
    {
        "name": "Владимир Зайцев", "email": "specialist33@masterok.ru", "phone": "+79001234533",
        "city": "Казань", "experience": 7, "rating": 4.5, "review_count": 33,
        "completed_orders": 91, "response_time": 35, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Кровельщик-фасадчик",
        "description": "Кровельные и фасадные работы в Казани. Монтаж металлочерепицы, мягкой кровли, сайдинга. Утепление фасадов. Работаю на высоте.",
        "education": "Профессиональные курсы, сертификат мастера",
        "categories": [5, 6],
    },
    # --- Новосибирск (5) ---
    {
        "name": "Олег Белов", "email": "specialist34@masterok.ru", "phone": "+79001234534",
        "city": "Новосибирск", "experience": 10, "rating": 4.7, "review_count": 45,
        "completed_orders": 137, "response_time": 25, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Мастер по ремонту квартир",
        "description": "Ремонт квартир в Новосибирске. Все виды работ: от косметического до капитального. Работаю с новостройками и вторичным жильём.",
        "education": "Высшее, строительный университет",
        "categories": [0, 8],
    },
    {
        "name": "Павел Орлов", "email": "specialist35@masterok.ru", "phone": "+79001234535",
        "city": "Новосибирск", "experience": 7, "rating": 4.6, "review_count": 32,
        "completed_orders": 89, "response_time": 35, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Электрик-сантехник",
        "description": "Электромонтажные и сантехнические работы. Универсальный мастер на все руки. Мелкий ремонт, установка техники, сборка мебели.",
        "education": "Среднее специальное, строительный колледж",
        "categories": [2, 3],
    },
    {
        "name": "Артём Титов", "email": "specialist36@masterok.ru", "phone": "+79001234536",
        "city": "Новосибирск", "experience": 15, "rating": 4.9, "review_count": 71,
        "completed_orders": 209, "response_time": 15, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Строитель каркасных домов",
        "description": "Строительство каркасных домов и бань в Новосибирске и области. Фундаменты, стены, кровля, утепление, отделка. Строим зимой и летом.",
        "education": "Высшее техническое, МГСУ",
        "categories": [1, 9],
    },
    {
        "name": "Роман Громов", "email": "specialist37@masterok.ru", "phone": "+79001234537",
        "city": "Новосибирск", "experience": 4, "rating": 4.3, "review_count": 16,
        "completed_orders": 38, "response_time": 50, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Мастер по кондиционерам и вентиляции",
        "description": "Установка и обслуживание кондиционеров и приточной вентиляции. Подбор оборудования, монтаж, гарантийное обслуживание.",
        "education": None,
        "categories": [15, 14],
    },
    {
        "name": "Виктор Фёдоров", "email": "specialist38@masterok.ru", "phone": "+79001234538",
        "city": "Новосибирск", "experience": 9, "rating": 4.5, "review_count": 36,
        "completed_orders": 105, "response_time": 30, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Плиточник-отделочник",
        "description": "Укладка плитки, керамогранита, мозаики. Ванные комнаты, кухни, полы. Гидроизоляция, затирка, подрезка. Работаю аккуратно и чисто.",
        "education": "Среднее специальное, техникум",
        "categories": [7],
    },
    # --- Екатеринбург (4) ---
    {
        "name": "Максим Макаров", "email": "specialist39@masterok.ru", "phone": "+79001234539",
        "city": "Екатеринбург", "experience": 11, "rating": 4.8, "review_count": 53,
        "completed_orders": 162, "response_time": 20, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Прораб, ремонт под ключ",
        "description": "Комплексный ремонт квартир и домов в Екатеринбурге. Своя бригада мастеров. Работаем по договору со сметой. От черновой отделки до чистовой.",
        "education": "Высшее, политехнический институт",
        "categories": [0, 1],
    },
    {
        "name": "Александр Степанов", "email": "specialist40@masterok.ru", "phone": "+79001234540",
        "city": "Екатеринбург", "experience": 6, "rating": 4.5, "review_count": 26,
        "completed_orders": 71, "response_time": 40, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Электрик",
        "description": "Электромонтажные работы в Екатеринбурге. Квартиры, частные дома, коммерческие помещения. Работаю по проекту и без. Сертификат электробезопасности.",
        "education": "Среднее специальное, строительный колледж",
        "categories": [2],
    },
    {
        "name": "Евгений Егоров", "email": "specialist41@masterok.ru", "phone": "+79001234541",
        "city": "Екатеринбург", "experience": 8, "rating": 4.6, "review_count": 38,
        "completed_orders": 109, "response_time": 30, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Сварщик, металлоконструкции",
        "description": "Сварочные работы и изготовление металлоконструкций. Лестницы, перила, навесы, ворота, решётки. Аргон, полуавтомат. Работаю по чертежам.",
        "education": "Среднее специальное, техникум",
        "categories": [19],
    },
    {
        "name": "Денис Шилов", "email": "specialist42@masterok.ru", "phone": "+79001234542",
        "city": "Екатеринбург", "experience": 3, "rating": 4.2, "review_count": 13,
        "completed_orders": 28, "response_time": 55, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Мастер клининга",
        "description": "Профессиональная уборка в Екатеринбурге. Квартиры, офисы, коттеджи. Генеральная уборка, после ремонта, регулярное обслуживание.",
        "education": None,
        "categories": [16],
    },
    # --- Краснодар (4) ---
    {
        "name": "Кирилл Рябов", "email": "specialist43@masterok.ru", "phone": "+79001234543",
        "city": "Краснодар", "experience": 9, "rating": 4.7, "review_count": 41,
        "completed_orders": 124, "response_time": 25, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Мастер по ремонту и отделке",
        "description": "Ремонт квартир и домов в Краснодаре. Все виды отделочных работ. Штукатурка, шпатлёвка, покраска, плитка, ламинат. Работаю быстро и качественно.",
        "education": "Среднее специальное, строительный колледж",
        "categories": [0, 7, 8],
    },
    {
        "name": "Антон Борисов", "email": "specialist44@masterok.ru", "phone": "+79001234544",
        "city": "Краснодар", "experience": 13, "rating": 4.8, "review_count": 59,
        "completed_orders": 178, "response_time": 20, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Строитель домов",
        "description": "Строительство частных домов в Краснодарском крае. Кирпич, газобетон, каркас. Фундаменты, стены, крыша, отделка. Строим от 2 месяцев.",
        "education": "Высшее, строительный университет",
        "categories": [1, 5],
    },
    {
        "name": "Василий Гончаров", "email": "specialist45@masterok.ru", "phone": "+79001234545",
        "city": "Краснодар", "experience": 6, "rating": 4.4, "review_count": 24,
        "completed_orders": 62, "response_time": 40, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Ландшафтный дизайнер",
        "description": "Благоустройство участков в Краснодаре. Газоны, дорожки, автополив, посадка растений, освещение. Проектирование и реализация ландшафтного дизайна.",
        "education": "Высшее, архитектурный институт",
        "categories": [12],
    },
    {
        "name": "Юрий Никитин", "email": "specialist46@masterok.ru", "phone": "+79001234546",
        "city": "Краснодар", "experience": 5, "rating": 4.3, "review_count": 20,
        "completed_orders": 48, "response_time": 45, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Мастер по кондиционерам",
        "description": "Установка и обслуживание кондиционеров в Краснодаре. Сплит-системы, мульти-сплит, канальные. Чистка, заправка, ремонт. Выезд бесплатный.",
        "education": "Профессиональные курсы, сертификат мастера",
        "categories": [15],
    },
    # --- Нижний Новгород (3) ---
    {
        "name": "Игорь Иванов", "email": "specialist47@masterok.ru", "phone": "+79001234547",
        "city": "Нижний Новгород", "experience": 10, "rating": 4.7, "review_count": 46,
        "completed_orders": 138, "response_time": 25, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Мастер по ремонту квартир",
        "description": "Все виды ремонтных работ в Нижнем Новгороде. Квартиры и частные дома. Честные цены, чёткие сроки, договор. Работаю на совесть.",
        "education": "Высшее, строительный университет",
        "categories": [0, 8],
    },
    {
        "name": "Тимур Петров", "email": "specialist48@masterok.ru", "phone": "+79001234548",
        "city": "Нижний Новгород", "experience": 7, "rating": 4.5, "review_count": 30,
        "completed_orders": 83, "response_time": 35, "is_verified": True, "is_premium": False, "is_available": True,
        "title": "Сантехник-электрик",
        "description": "Сантехнические и электрические работы. Замена труб, установка сантехники, монтаж проводки, розеток. Мелкий бытовой ремонт любой сложности.",
        "education": "Среднее специальное, техникум",
        "categories": [2, 3],
    },
    {
        "name": "Руслан Сидоров", "email": "specialist49@masterok.ru", "phone": "+79001234549",
        "city": "Нижний Новгород", "experience": 4, "rating": 4.2, "review_count": 15,
        "completed_orders": 34, "response_time": 50, "is_verified": False, "is_premium": False, "is_available": True,
        "title": "Грузчик, переезды",
        "description": "Помощь с переездами по Нижнему Новгороду. Квартиры, офисы, дачи. Аккуратная транспортировка мебели и техники. Грузовик в наличии.",
        "education": None,
        "categories": [17],
    },
    {
        "name": "Григорий Козлов", "email": "specialist50@masterok.ru", "phone": "+79001234550",
        "city": "Нижний Новгород", "experience": 25, "rating": 4.9, "review_count": 91,
        "completed_orders": 312, "response_time": 10, "is_verified": True, "is_premium": True, "is_available": True,
        "title": "Инженер-строитель, все виды работ",
        "description": "Профессиональный строитель с 25-летним стажем. Строительство домов, ремонт квартир, инженерные системы. Работаю по договору с гарантией до 5 лет.",
        "education": "Высшее техническое, МГСУ",
        "categories": [0, 1, 14],
    },
]

# ---------------------------------------------------------------------------
# Услуги (шаблоны по категориям)
# ---------------------------------------------------------------------------
SERVICES_BY_CATEGORY = {
    0: [  # Ремонт квартир
        ("Косметический ремонт комнаты", "Покраска стен, замена обоев, обновление потолка", 25000, "за м²", 480),
        ("Капитальный ремонт квартиры", "Полный ремонт с заменой коммуникаций, стяжка, штукатурка", 45000, "за м²", 1440),
        ("Ремонт ванной комнаты под ключ", "Плитка, сантехника, потолок, освещение", 120000, "за услугу", 2880),
    ],
    1: [  # Строительство домов
        ("Строительство дома из газобетона", "Фундамент, стены, перекрытия, кровля", 150000, "за м²", None),
        ("Строительство бани из бруса", "Баня 6x4 под ключ с отделкой", 85000, "за услугу", None),
        ("Заливка фундамента", "Ленточный фундамент с армированием", 8500, "за м²", None),
    ],
    2: [  # Электромонтаж
        ("Замена электропроводки", "Демонтаж старой и прокладка новой проводки", 1200, "за точку", 480),
        ("Установка розеток и выключателей", "Штробление, прокладка кабеля, установка", 800, "за точку", 60),
        ("Сборка и подключение электрощита", "Сборка щита на 24-36 модулей с защитной автоматикой", 12000, "за услугу", 240),
    ],
    3: [  # Сантехника
        ("Замена труб водоснабжения", "Демонтаж старых и монтаж новых труб ПВХ/металлопластик", 3500, "за точку", 240),
        ("Установка унитаза", "Демонтаж старого, установка нового с подключением", 3000, "за услугу", 120),
        ("Установка ванны", "Демонтаж старой, установка и подключение новой ванны", 5000, "за услугу", 180),
    ],
    4: [  # Дизайн интерьера
        ("Дизайн-проект квартиры", "Обмерный план, планировка, 3D-визуализация, чертежи", 2500, "за м²", None),
        ("3D-визуализация интерьера", "Фотореалистичные рендеры 3-5 ракурсов на комнату", 15000, "за услугу", None),
        ("Авторский надзор за ремонтом", "Контроль качества работ, выезды на объект", 30000, "за услугу", None),
    ],
    5: [  # Кровельные работы
        ("Монтаж кровли из металлочерепицы", "Обрешётка, гидроизоляция, укладка, коньки, ендовы", 1500, "за м²", None),
        ("Монтаж мягкой кровли", "Подготовка основания, укладка гибкой черепицы", 1200, "за м²", None),
        ("Ремонт кровли", "Устранение протечек, замена повреждённых элементов", 5000, "за м²", 480),
    ],
    6: [  # Фасадные работы
        ("Мокрый фасад", "Утепление + штукатурка + покраска фасада", 2800, "за м²", None),
        ("Монтаж сайдинга", "Обрешётка, утеплитель, монтаж панелей", 1800, "за м²", None),
        ("Покраска фасада", "Подготовка поверхности и покраска в 2 слоя", 800, "за м²", None),
    ],
    7: [  # Плиточные работы
        ("Укладка плитки на пол", "Подготовка основания, укладка, затирка", 1500, "за м²", 120),
        ("Укладка плитки на стены", "Выравнивание, укладка, затирка швов", 1800, "за м²", 120),
        ("Мозаичные работы", "Укладка мозаики любой сложности", 3000, "за м²", 180),
    ],
    8: [  # Малярные работы
        ("Покраска стен", "Шпатлёвка, грунтовка, покраска в 2 слоя", 600, "за м²", 60),
        ("Поклейка обоев", "Подготовка стен, грунтовка, поклейка", 500, "за м²", 45),
        ("Декоративная штукатурка", "Нанесение декоративной штукатурки с рисунком", 1200, "за м²", 90),
    ],
    9: [  # Утепление
        ("Утепление фасада пенопластом", "Монтаж утеплителя 100мм, дюбелирование, сетка", 1500, "за м²", None),
        ("Утепление кровли минватой", "Укладка минваты, пароизоляция, контробрешётка", 800, "за м²", None),
        ("Напыление пенополиуретана", "Бесшовное утепление стен и кровли ППУ", 2200, "за м²", None),
    ],
    10: [  # Установка окон
        ("Установка окна ПВХ", "Демонтаж старого окна, установка нового, запенивание", 4500, "за услугу", 180),
        ("Остекление балкона", "Монтаж алюминиевого или ПВХ остекления", 25000, "за услугу", 480),
        ("Установка откосов", "Пластиковые или штукатурные откосы", 2500, "за услугу", 120),
    ],
    11: [  # Натяжные потолки
        ("Натяжной потолок матовый", "Монтаж матового полотна с установкой светильников", 800, "за м²", 180),
        ("Натяжной потолок глянцевый", "Монтаж глянцевого полотна, парящий эффект", 1000, "за м²", 180),
        ("Многоуровневый потолок", "Дизайнерский потолок с переходами уровней и подсветкой", 1800, "за м²", 360),
    ],
    12: [  # Ландшафтный дизайн
        ("Устройство газона", "Подготовка почвы, укладка рулонного газона", 600, "за м²", None),
        ("Мощение садовых дорожек", "Укладка тротуарной плитки или камня на песчаное основание", 1500, "за м²", None),
        ("Монтаж системы автополива", "Проектирование и установка автоматического полива", 35000, "за услугу", None),
    ],
    13: [  # Мебель на заказ
        ("Кухня на заказ", "Замер, проект, изготовление и установка кухонного гарнитура", 95000, "за услугу", None),
        ("Шкаф-купе на заказ", "Встроенный шкаф-купе по индивидуальным размерам", 45000, "за услугу", None),
        ("Гардеробная комната", "Проектирование и изготовление системы хранения", 65000, "за услугу", None),
    ],
    14: [  # Инженерные сети
        ("Монтаж радиаторного отопления", "Установка радиаторов, разводка труб, подключение к котлу", 5000, "за точку", None),
        ("Монтаж тёплого пола", "Водяной тёплый пол с коллектором и автоматикой", 1800, "за м²", None),
        ("Монтаж приточной вентиляции", "Установка приточной установки с фильтрацией и подогревом", 45000, "за услугу", None),
    ],
    15: [  # Кондиционеры
        ("Установка сплит-системы", "Монтаж внутреннего и внешнего блока, прокладка трассы до 3м", 8000, "за услугу", 180),
        ("Обслуживание кондиционера", "Чистка фильтров, промывка, проверка давления, заправка", 3500, "за услугу", 90),
        ("Установка мульти-сплит системы", "Один внешний блок на 2-4 комнаты", 25000, "за услугу", 480),
    ],
    16: [  # Клининг
        ("Генеральная уборка квартиры", "Мытьё всех поверхностей, окон, техники, санузлов", 5000, "за услугу", 300),
        ("Уборка после ремонта", "Удаление строительной пыли, мытьё окон и полов", 7000, "за услугу", 420),
        ("Химчистка мягкой мебели", "Чистка дивана, кресел профессиональным оборудованием", 4000, "за услугу", 120),
    ],
    17: [  # Переезды
        ("Квартирный переезд", "Упаковка, погрузка, перевозка, разгрузка", 8000, "за услугу", 360),
        ("Услуги грузчиков", "Погрузка/разгрузка мебели и техники", 1500, "за час", 60),
        ("Грузоперевозка", "Доставка груза по городу на газели", 3000, "за услугу", 120),
    ],
    18: [  # Демонтаж
        ("Демонтаж стен и перегородок", "Снос ненесущих перегородок из кирпича, пазогребня, ГКЛ", 1500, "за м²", 120),
        ("Демонтаж старого пола", "Снятие плитки, ламината, паркета, стяжки", 500, "за м²", 60),
        ("Вывоз строительного мусора", "Погрузка и вывоз мусора контейнером", 8000, "за услугу", 240),
    ],
    19: [  # Металлоконструкции
        ("Изготовление металлической лестницы", "Каркас лестницы из металла с перилами", 65000, "за услугу", None),
        ("Монтаж навеса из поликарбоната", "Металлический каркас, покрытие поликарбонатом", 35000, "за услугу", None),
        ("Установка откатных ворот", "Изготовление и монтаж откатных ворот с автоматикой", 85000, "за услугу", None),
    ],
}

# ---------------------------------------------------------------------------
# Шаблоны заказов
# ---------------------------------------------------------------------------
ORDERS_DATA = [
    {"title": "Ремонт однокомнатной квартиры", "description": "Нужен косметический ремонт однокомнатной квартиры 38 м². Стены, потолок, пол. Материалы свои.", "budget": 150000, "budget_max": 200000, "address": "ул. Ленина, 45, кв. 12"},
    {"title": "Замена электропроводки в двушке", "description": "Полная замена проводки в двухкомнатной квартире. Старый дом, алюминий. Нужно на медь. 20 точек.", "budget": 30000, "budget_max": 50000, "address": "пр. Мира, 78, кв. 5"},
    {"title": "Установка ванны и унитаза", "description": "Нужно демонтировать старую ванну, установить новую акриловую + заменить унитаз. Всё куплено.", "budget": 8000, "budget_max": 15000, "address": "ул. Советская, 23, кв. 8"},
    {"title": "Укладка плитки в ванной", "description": "Ванная комната 6 м². Плитка 60x60 на пол и 30x60 на стены. Нужна гидроизоляция. Материалы есть.", "budget": 25000, "budget_max": 35000, "address": "ул. Гагарина, 15, кв. 44"},
    {"title": "Дизайн-проект двухкомнатной квартиры", "description": "Квартира 65 м² в новостройке. Нужен проект с 3D, чертежами, подбором материалов. Стиль — минимализм.", "budget": 80000, "budget_max": 120000, "address": "ул. Новая, 10, кв. 73"},
    {"title": "Натяжной потолок в зале", "description": "Комната 22 м². Хочу матовый белый потолок. 6 точечных светильников. Без переплат.", "budget": 15000, "budget_max": 25000, "address": "ул. Пушкина, 32, кв. 19"},
    {"title": "Строительство бани 6x4", "description": "Нужна баня из профилированного бруса на дачном участке. Фундамент свайный, кровля мягкая. Печь ставлю сам.", "budget": 400000, "budget_max": 550000, "address": "СНТ Берёзка, уч. 47"},
    {"title": "Установка 5 окон ПВХ", "description": "Замена старых деревянных окон на новые пластиковые. 3 окна 1400x1300, 2 окна 2100x1400. Окна заказаны.", "budget": 20000, "budget_max": 30000, "address": "ул. Кирова, 88, кв. 2"},
    {"title": "Генеральная уборка после ремонта", "description": "Трёхкомнатная квартира 85 м² после капитального ремонта. Нужна тщательная уборка всех помещений.", "budget": 8000, "budget_max": 12000, "address": "ул. Чехова, 5, кв. 67"},
    {"title": "Сборка и установка кухни", "description": "Кухонный гарнитур из IKEA, нужно собрать и установить. Подключение мойки, варочной панели, вытяжки.", "budget": 12000, "budget_max": 18000, "address": "пр. Победы, 101, кв. 34"},
    {"title": "Утепление фасада частного дома", "description": "Дом из газобетона 120 м² стен. Нужно утеплить пенопластом 100мм + мокрый фасад. Материалы куплю сам.", "budget": 180000, "budget_max": 250000, "address": "пос. Солнечный, ул. Садовая, 12"},
    {"title": "Монтаж радиаторного отопления", "description": "Частный дом, 8 радиаторов, газовый котёл уже стоит. Нужна разводка труб и установка радиаторов.", "budget": 40000, "budget_max": 60000, "address": "пос. Лесной, ул. Берёзовая, 7"},
    {"title": "Сварка лестницы на второй этаж", "description": "Нужна металлическая лестница с перилами. Высота 3м, поворот 90 градусов. Каркас для последующей обшивки деревом.", "budget": 55000, "budget_max": 80000, "address": "ул. Дачная, 22"},
    {"title": "Монтаж кровли из металлочерепицы", "description": "Дом 10x12, двускатная крыша. Нужен монтаж металлочерепицы, водосточной системы, утепление.", "budget": 200000, "budget_max": 300000, "address": "пос. Озёрный, ул. Центральная, 5"},
    {"title": "Квартирный переезд", "description": "Переезд из двухкомнатной квартиры на 5 этаже (без лифта) в новую квартиру. Нужен грузовик и 2 грузчика.", "budget": 6000, "budget_max": 10000, "address": "ул. Ломоносова, 14, кв. 37"},
    {"title": "Демонтаж старой кухни и перегородки", "description": "Нужно демонтировать кухонный гарнитур, старую плитку со стен и снести ненесущую перегородку между кухней и залом.", "budget": 10000, "budget_max": 18000, "address": "ул. Фрунзе, 9, кв. 21"},
    {"title": "Установка двух сплит-систем", "description": "Нужно установить 2 кондиционера: один в спальню (до 25 м²), второй в гостиную (до 35 м²). Кондиционеры куплены.", "budget": 14000, "budget_max": 20000, "address": "ул. Южная, 56, кв. 15"},
    {"title": "Покраска стен в 3 комнатах", "description": "Стены выровнены, нужна финишная шпатлёвка и покраска. Общая площадь стен примерно 120 м². Краска куплена.", "budget": 35000, "budget_max": 50000, "address": "ул. Школьная, 3, кв. 42"},
    {"title": "Остекление балкона", "description": "Балкон 3м, хрущёвка, 5 этаж. Хочу тёплое остекление ПВХ с выносом подоконника. Отделка внутри — панели ПВХ.", "budget": 30000, "budget_max": 45000, "address": "ул. Комсомольская, 67, кв. 30"},
    {"title": "Ландшафтный дизайн участка 10 соток", "description": "Нужен проект и реализация: газон, дорожки, зона барбекю, автополив. Участок пустой, только дом.", "budget": 150000, "budget_max": 250000, "address": "КП Сосновый бор, уч. 23"},
    {"title": "Химчистка дивана и двух кресел", "description": "Большой угловой диван (ткань) и два кресла. Пятна от кофе, общее загрязнение. Нужно почистить на дому.", "budget": 4000, "budget_max": 7000, "address": "ул. Октябрьская, 40, кв. 11"},
    {"title": "Монтаж тёплого водяного пола", "description": "Частный дом, первый этаж 80 м². Нужен водяной тёплый пол с коллектором. Стяжку буду заливать сам.", "budget": 90000, "budget_max": 130000, "address": "пос. Ясный, ул. Полевая, 8"},
    {"title": "Изготовление шкафа-купе", "description": "Встроенный шкаф-купе в прихожую. Ширина 2.4м, высота 2.5м, глубина 60см. Зеркальные двери. Нужен замер.", "budget": 35000, "budget_max": 55000, "address": "ул. Молодёжная, 18, кв. 6"},
    {"title": "Заливка ленточного фундамента", "description": "Фундамент для дома 10x10. Глубина 1.2м, ширина 40см. Армирование. Нужна опалубка, арматура, заливка.", "budget": 120000, "budget_max": 180000, "address": "д. Ивановка, ул. Новая, 15"},
    {"title": "Ремонт кровли после урагана", "description": "Сорвало часть металлочерепицы на площади примерно 20 м². Нужен срочный ремонт, течёт.", "budget": 15000, "budget_max": 30000, "address": "ул. Лесная, 4"},
    {"title": "Установка электрощита в коттедже", "description": "Новый коттедж, нужно собрать и установить щит на 48 модулей. Автоматы, УЗО, реле напряжения. Схема есть.", "budget": 15000, "budget_max": 25000, "address": "КП Берёзовая роща, д. 11"},
    {"title": "Мозаика в бассейне", "description": "Отделка чаши бассейна мозаикой. Размер бассейна 4x8м, глубина 1.5м. Нужна укладка мозаики и затирка.", "budget": 100000, "budget_max": 150000, "address": "д. Григорьевка, ул. Речная, 2"},
    {"title": "Монтаж приточной вентиляции", "description": "Квартира 90 м², хочу установить приточную вентиляцию с рекуперацией. Нужен подбор оборудования и монтаж.", "budget": 80000, "budget_max": 120000, "address": "пр. Ленинградский, 22, кв. 51"},
    {"title": "Ремонт санузла под ключ", "description": "Совмещённый санузел 5 м². Нужно: демонтаж, гидроизоляция, плитка, сантехника, потолок, электрика. Всё с нуля.", "budget": 80000, "budget_max": 130000, "address": "ул. Речная, 17, кв. 9"},
    {"title": "Установка откатных ворот с автоматикой", "description": "Проём 4м, забор из профнастила. Нужны откатные ворота из профнастила на рельсе с электроприводом и пультом.", "budget": 70000, "budget_max": 100000, "address": "д. Пригородная, ул. Центральная, 31"},
]

# ---------------------------------------------------------------------------
# Шаблоны отзывов
# ---------------------------------------------------------------------------
REVIEW_COMMENTS_5 = [
    ("Отличная работа! Сделали ремонт быстро и качественно. Всем рекомендую!", "Качество, скорость, аккуратность", None),
    ("Великолепный мастер! Всё сделано идеально, придраться не к чему. Буду обращаться ещё.", "Профессионализм, чистота после работы", None),
    ("Рекомендую этого специалиста на все 100%. Работает чисто, быстро, цена адекватная.", "Цена/качество, пунктуальность", None),
    ("Превосходный результат! Сосед зашёл посмотреть и тоже захотел такой же ремонт.", "Красивый результат, внимание к деталям", None),
    ("Мастер — золотые руки! Сделал даже лучше, чем я ожидал. Приятный в общении.", "Мастерство, коммуникабельность", None),
    ("Всё выполнено на высшем уровне. Работал аккуратно, убрал за собой. Однозначно 5 звёзд!", "Аккуратность, ответственность", None),
    ("Очень доволен результатом. Мастер предложил несколько вариантов решения, помог с выбором материалов.", "Экспертность, помощь с материалами", None),
    ("Идеальная работа от начала до конца. Всё по смете, без сюрпризов. Большое спасибо!", "Прозрачность цен, надёжность", None),
    ("Профессионал своего дела! Работал быстро и качественно. Приехал вовремя, закончил раньше срока.", "Скорость, пунктуальность, качество", None),
    ("Замечательный специалист. Выполнил работу на отлично, дал полезные советы по эксплуатации.", "Качество, полезные советы", None),
    ("Это лучший мастер, с которым я работал! Всё чётко, профессионально, в срок.", "Профессионализм, соблюдение сроков", None),
    ("Жена в восторге от результата! Мастер учёл все наши пожелания. Спасибо огромное!", "Внимание к пожеланиям, результат", None),
]

REVIEW_COMMENTS_4 = [
    ("Хорошо выполнил работу, но немного затянул по срокам.", "Качество работы", "Небольшая задержка по срокам"),
    ("В целом доволен результатом. Пара мелочей, но мастер вернулся и исправил.", "Исправляет недочёты", "Были мелкие недоделки"),
    ("Качественная работа, но хотелось бы чуть больше аккуратности с мусором.", "Хорошее качество", "Мусор после работы"),
    ("Работа выполнена хорошо, но связь с мастером не всегда оперативная.", "Результат работы", "Долго отвечает на сообщения"),
    ("Хороший специалист, всё сделал нормально. Цена чуть выше средней, но качество есть.", "Профессионализм", "Цена немного выше"),
    ("Работа на четвёрку. Основную задачу выполнил, но есть пара замечаний по мелочам.", "Основная работа выполнена", "Мелкие недочёты"),
    ("Мастер знает своё дело. Единственное — приехал с опозданием на час.", "Знание дела", "Опоздание"),
]

REVIEW_COMMENTS_3 = [
    ("Нормально, но были мелкие недочёты которые пришлось переделывать.", "Приемлемая цена", "Недочёты в работе"),
    ("Средне. Работу выполнил, но ожидал большего за такие деньги.", "Работа сделана", "Качество не идеальное"),
    ("Удовлетворительно. Пришлось несколько раз напоминать о мелочах.", "Выполнил основной объём", "Нужен контроль"),
    ("Результат терпимый, но сроки затянул прилично.", "Работа выполнена", "Серьёзная задержка сроков"),
    ("Не то, чего я ожидал. Работу сделал, но качество на тройку.", "Задачу закрыл", "Среднее качество"),
]

REVIEW_COMMENTS_2 = [
    ("Качество среднее, ожидал лучшего за такую цену.", "Приехал быстро", "Низкое качество за высокую цену"),
    ("Пришлось переделывать часть работы. Не рекомендую.", None, "Плохое качество, нужна переделка"),
    ("Не очень доволен. Мастер торопился и это видно по результату.", "Быстро", "Видна спешка, неаккуратность"),
]

REVIEW_COMMENTS_1 = [
    ("К сожалению, не оправдал ожиданий. Много недоделок.", None, "Некачественная работа, недоделки"),
    ("Крайне разочарован. Пришлось вызывать другого мастера переделывать.", None, "Пришлось полностью переделывать"),
]

SPECIALIST_RESPONSES = [
    "Спасибо за отзыв! Рад, что вам понравилось. Обращайтесь ещё!",
    "Благодарю за высокую оценку! Всегда рад помочь.",
    "Спасибо! Было приятно работать с вами. Удачи!",
    "Благодарю за отзыв! Если будут вопросы — обращайтесь.",
    "Спасибо за обратную связь! Принимаю к сведению.",
    "Благодарю за честный отзыв. Буду работать над улучшением.",
    "Спасибо за отзыв! Приношу извинения за неудобства, учту на будущее.",
    None,
    None,
    None,
]


# ---------------------------------------------------------------------------
# Главная функция
# ---------------------------------------------------------------------------
async def seed_database() -> None:
    """Заполняет базу данных демо-данными. Идемпотентна — при наличии данных не выполняется."""

    async with AsyncSessionLocal() as session:
        # Проверяем наличие данных
        result = await session.execute(select(Category).limit(1))
        if result.scalars().first() is not None:
            print("[seed] База уже содержит данные, пропускаем.")
            return

        print("[seed] Начинаем заполнение базы данных...")

        # ---------------------------------------------------------------
        # 1. Категории и навыки
        # ---------------------------------------------------------------
        categories: list[Category] = []
        all_skills: list[Skill] = []
        # Словарь category_index -> list[Skill] для привязки специалистов
        skills_by_cat: dict[int, list[Skill]] = {}

        for idx, cat_data in enumerate(CATEGORIES_DATA):
            cat_id = _uid()
            cat = Category(
                id=cat_id,
                name=cat_data["name"],
                slug=cat_data["slug"],
                description=cat_data["description"],
                icon=cat_data["icon"],
                image=cat_data["image"],
                order=idx,
                is_active=True,
            )
            categories.append(cat)

            cat_skills = []
            for skill_name, skill_slug in cat_data["skills"]:
                sk = Skill(
                    id=_uid(),
                    name=skill_name,
                    slug=skill_slug,
                    category_id=cat_id,
                )
                all_skills.append(sk)
                cat_skills.append(sk)
            skills_by_cat[idx] = cat_skills

        session.add_all(categories)
        session.add_all(all_skills)
        print(f"[seed] Создано {len(categories)} категорий и {len(all_skills)} навыков.")

        # ---------------------------------------------------------------
        # 2. Пользователи-клиенты
        # ---------------------------------------------------------------
        client_users: list[User] = []
        for i in range(10):
            fname = FEMALE_NAMES[i]
            lname = FEMALE_SURNAMES[i % len(FEMALE_SURNAMES)]
            uid = _uid()
            user = User(
                id=uid,
                email=f"client{i + 1}@masterok.ru",
                phone=f"+7900123460{i}",
                password_hash=DEFAULT_PASSWORD,
                name=f"{fname} {lname}",
                avatar=f"https://i.pravatar.cc/200?u={uid}",
                role=UserRole.CLIENT,
                is_verified=True,
                is_active=True,
            )
            client_users.append(user)

        session.add_all(client_users)
        print(f"[seed] Создано {len(client_users)} клиентов.")

        # ---------------------------------------------------------------
        # 3. Пользователи-специалисты + специалисты + навыки + услуги
        # ---------------------------------------------------------------
        specialist_users: list[User] = []
        specialists: list[Specialist] = []
        specialist_skills_list: list[SpecialistSkill] = []
        services: list[Service] = []

        for i, sp_data in enumerate(SPECIALISTS_DATA):
            # User
            user_id = _uid()
            user = User(
                id=user_id,
                email=sp_data["email"],
                phone=sp_data["phone"],
                password_hash=DEFAULT_PASSWORD,
                name=sp_data["name"],
                avatar=f"https://i.pravatar.cc/200?u={user_id}",
                role=UserRole.SPECIALIST,
                is_verified=sp_data["is_verified"],
                is_active=True,
            )
            specialist_users.append(user)

            # Specialist
            spec_id = _uid()
            spec = Specialist(
                id=spec_id,
                user_id=user_id,
                title=sp_data["title"],
                description=sp_data["description"],
                city=sp_data["city"],
                address=None,
                experience=sp_data["experience"],
                rating=sp_data["rating"],
                review_count=sp_data["review_count"],
                completed_orders=sp_data["completed_orders"],
                response_time=sp_data["response_time"],
                is_verified=sp_data["is_verified"],
                is_premium=sp_data["is_premium"],
                is_available=sp_data["is_available"],
                education=sp_data.get("education"),
                work_schedule=random.choice(WORK_SCHEDULES),
            )
            specialists.append(spec)

            # SpecialistSkills — 3-5 навыков из связанных категорий
            linked_cat_indices = sp_data["categories"]
            available_skills = []
            for cat_idx in linked_cat_indices:
                available_skills.extend(skills_by_cat[cat_idx])

            num_skills = min(random.randint(3, 5), len(available_skills))
            chosen_skills = random.sample(available_skills, num_skills)

            levels = [SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED, SkillLevel.EXPERT]
            for sk in chosen_skills:
                exp = sp_data["experience"]
                if exp >= 10:
                    lvl = random.choice([SkillLevel.ADVANCED, SkillLevel.EXPERT])
                elif exp >= 5:
                    lvl = random.choice([SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED])
                else:
                    lvl = random.choice([SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE])

                ss = SpecialistSkill(
                    id=_uid(),
                    specialist_id=spec_id,
                    skill_id=sk.id,
                    level=lvl,
                    years_exp=min(exp, random.randint(1, exp) if exp > 0 else 1),
                )
                specialist_skills_list.append(ss)

            # Services — 2-3 услуги из связанных категорий
            num_services = random.randint(2, 3)
            service_pool = []
            for cat_idx in linked_cat_indices:
                if cat_idx in SERVICES_BY_CATEGORY:
                    for svc_template in SERVICES_BY_CATEGORY[cat_idx]:
                        service_pool.append((cat_idx, svc_template))

            chosen_services = random.sample(service_pool, min(num_services, len(service_pool)))
            for cat_idx, (svc_name, svc_desc, svc_price, svc_unit, svc_dur) in chosen_services:
                # Небольшая вариация цены
                price_variation = random.uniform(0.85, 1.15)
                svc = Service(
                    id=_uid(),
                    specialist_id=spec_id,
                    category_id=categories[cat_idx].id,
                    name=svc_name,
                    description=svc_desc,
                    price=round(svc_price * price_variation, -2),  # округлить до сотен
                    price_unit=svc_unit,
                    duration=svc_dur,
                    is_active=True,
                )
                services.append(svc)

        session.add_all(specialist_users)
        session.add_all(specialists)
        session.add_all(specialist_skills_list)
        session.add_all(services)
        print(f"[seed] Создано {len(specialist_users)} пользователей-специалистов.")
        print(f"[seed] Создано {len(specialists)} специалистов.")
        print(f"[seed] Создано {len(specialist_skills_list)} навыков специалистов.")
        print(f"[seed] Создано {len(services)} услуг.")

        # ---------------------------------------------------------------
        # 4. Заказы (30)
        # ---------------------------------------------------------------
        orders: list[Order] = []
        order_statuses_pool = [
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
            (OrderStatus.IN_PROGRESS, PaymentStatus.HELD),
            (OrderStatus.IN_PROGRESS, PaymentStatus.HELD),
            (OrderStatus.IN_PROGRESS, PaymentStatus.HELD),
            (OrderStatus.IN_PROGRESS, PaymentStatus.HELD),
            (OrderStatus.ACCEPTED, PaymentStatus.HELD),
            (OrderStatus.ACCEPTED, PaymentStatus.HELD),
            (OrderStatus.PUBLISHED, PaymentStatus.PENDING),
            (OrderStatus.PUBLISHED, PaymentStatus.PENDING),
            (OrderStatus.PUBLISHED, PaymentStatus.PENDING),
            (OrderStatus.PUBLISHED, PaymentStatus.PENDING),
            (OrderStatus.PUBLISHED, PaymentStatus.PENDING),
            (OrderStatus.PUBLISHED, PaymentStatus.PENDING),
            (OrderStatus.PENDING, PaymentStatus.PENDING),
            (OrderStatus.PENDING, PaymentStatus.PENDING),
            (OrderStatus.CANCELLED, PaymentStatus.REFUNDED),
            (OrderStatus.CANCELLED, PaymentStatus.REFUNDED),
            (OrderStatus.PAYMENT_PENDING, PaymentStatus.PENDING),
            (OrderStatus.PAYMENT_PENDING, PaymentStatus.PENDING),
            (OrderStatus.DISPUTED, PaymentStatus.HELD),
            (OrderStatus.COMPLETED, PaymentStatus.RELEASED),
        ]

        now = datetime.utcnow()

        for i, order_data in enumerate(ORDERS_DATA):
            status, payment_status = order_statuses_pool[i]
            client = client_users[i % len(client_users)]
            budget = order_data["budget"]
            total = round(budget * random.uniform(0.9, 1.1), -2)
            platform_fee = round(total * 0.1, 2)
            specialist_price = round(total - platform_fee, 2)

            # Для завершённых и активных заказов — назначить специалиста
            assigned_spec = None
            assigned_service = None
            completed_at_dt = None
            scheduled_dt = None
            deadline_dt = None

            if status in (OrderStatus.COMPLETED, OrderStatus.IN_PROGRESS, OrderStatus.ACCEPTED, OrderStatus.DISPUTED, OrderStatus.PAYMENT_PENDING):
                assigned_spec = random.choice(specialists)
                spec_services = [s for s in services if s.specialist_id == assigned_spec.id]
                if spec_services:
                    assigned_service = random.choice(spec_services)

            days_ago = random.randint(1, 90)
            if status == OrderStatus.COMPLETED:
                completed_at_dt = now - timedelta(days=random.randint(1, days_ago))
                scheduled_dt = completed_at_dt - timedelta(days=random.randint(1, 14))
            elif status in (OrderStatus.IN_PROGRESS, OrderStatus.ACCEPTED):
                scheduled_dt = now + timedelta(days=random.randint(1, 14))

            deadline_dt = now + timedelta(days=random.randint(7, 60))

            order = Order(
                id=_uid(),
                client_id=client.id,
                specialist_id=assigned_spec.id if assigned_spec else None,
                service_id=assigned_service.id if assigned_service else None,
                title=order_data["title"],
                description=order_data["description"],
                budget=float(order_data["budget"]),
                budget_max=float(order_data["budget_max"]),
                deadline=deadline_dt,
                address=order_data["address"],
                scheduled_at=scheduled_dt,
                completed_at=completed_at_dt,
                total_price=float(total),
                specialist_price=float(specialist_price),
                platform_fee=float(platform_fee),
                status=status,
                payment_status=payment_status,
            )
            orders.append(order)

        session.add_all(orders)
        print(f"[seed] Создано {len(orders)} заказов.")

        # ---------------------------------------------------------------
        # 5. Ставки (50) — на заказы со статусом PUBLISHED
        # ---------------------------------------------------------------
        bids: list[OrderBid] = []
        published_orders = [o for o in orders if o.status == OrderStatus.PUBLISHED]

        bid_messages = [
            "Готов выполнить работу качественно и в срок. Есть опыт подобных проектов.",
            "Могу приступить на этой неделе. Работаю по договору с гарантией.",
            "Выполню работу профессионально. Имею все необходимые инструменты и опыт.",
            "Предлагаю свои услуги. Примеры работ могу показать по запросу.",
            "Берусь за эту работу. Стоимость указана с учётом всех расходов.",
            "Готов обсудить детали. Опыт более 5 лет, есть отзывы от клиентов.",
            "Могу предложить оптимальное решение по цене и качеству.",
            "Выезд на осмотр бесплатно. Составлю подробную смету после замера.",
            "Работаю сам, без посредников. Поэтому цена адекватная.",
            "Имею большой опыт в подобных работах. Гарантирую качественный результат.",
        ]

        bid_timelines = [
            "2-3 дня", "3-5 дней", "1 неделя", "5-7 дней", "7-10 дней",
            "2 недели", "10-14 дней", "3-4 дня", "1-2 дня", "до 5 дней",
        ]

        bid_count = 0
        for pub_order in published_orders:
            # 5-10 ставок на каждый опубликованный заказ
            num_bids = random.randint(5, 10)
            bid_specs = random.sample(specialists, min(num_bids, len(specialists)))
            for spec in bid_specs:
                if bid_count >= 50:
                    break
                price = round(pub_order.budget * random.uniform(0.8, 1.3), -2)
                bid = OrderBid(
                    id=_uid(),
                    order_id=pub_order.id,
                    specialist_id=spec.id,
                    price=float(price),
                    timeline=random.choice(bid_timelines),
                    message=random.choice(bid_messages),
                    status=BidStatus.PENDING,
                )
                bids.append(bid)
                bid_count += 1
            if bid_count >= 50:
                break

        session.add_all(bids)
        print(f"[seed] Создано {len(bids)} ставок.")

        # ---------------------------------------------------------------
        # 6. Отзывы (200) — для заказов и специалистов
        # ---------------------------------------------------------------
        reviews: list[Review] = []

        # Распределение рейтингов: 50% 5-star, 25% 4-star, 15% 3-star, 8% 2-star, 2% 1-star
        rating_pool: list[int] = []
        rating_pool.extend([5] * 100)
        rating_pool.extend([4] * 50)
        rating_pool.extend([3] * 30)
        rating_pool.extend([2] * 16)
        rating_pool.extend([1] * 4)
        random.shuffle(rating_pool)

        # Создаём фиктивные order_id для отзывов (т.к. Review.order_id уникален)
        # Для простоты создадим отдельные "исторические" заказы для каждого отзыва
        review_orders: list[Order] = []

        review_idx = 0
        for spec in specialists:
            # 3-6 отзывов на специалиста
            num_reviews = random.randint(3, 6)
            if review_idx + num_reviews > 200:
                num_reviews = 200 - review_idx
            if num_reviews <= 0:
                break

            for _ in range(num_reviews):
                rating = rating_pool[review_idx % len(rating_pool)]

                # Выбираем шаблон отзыва по рейтингу
                if rating == 5:
                    comment, pros, cons = random.choice(REVIEW_COMMENTS_5)
                elif rating == 4:
                    comment, pros, cons = random.choice(REVIEW_COMMENTS_4)
                elif rating == 3:
                    comment, pros, cons = random.choice(REVIEW_COMMENTS_3)
                elif rating == 2:
                    comment, pros, cons = random.choice(REVIEW_COMMENTS_2)
                else:
                    comment, pros, cons = random.choice(REVIEW_COMMENTS_1)

                # Ответ специалиста — с вероятностью ~40%
                response = random.choice(SPECIALIST_RESPONSES)

                # Создаём заказ-заглушку для отзыва (order_id уникален)
                client = random.choice(client_users)
                review_order_id = _uid()
                days_back = random.randint(5, 180)
                completed_dt = now - timedelta(days=days_back)

                review_order = Order(
                    id=review_order_id,
                    client_id=client.id,
                    specialist_id=spec.id,
                    service_id=None,
                    title=f"Заказ #{review_idx + 1}",
                    description=None,
                    budget=float(random.randint(5, 150) * 1000),
                    budget_max=None,
                    deadline=None,
                    address=None,
                    scheduled_at=completed_dt - timedelta(days=random.randint(1, 14)),
                    completed_at=completed_dt,
                    total_price=float(random.randint(5, 150) * 1000),
                    specialist_price=float(random.randint(4, 135) * 1000),
                    platform_fee=float(random.randint(500, 15000)),
                    status=OrderStatus.COMPLETED,
                    payment_status=PaymentStatus.RELEASED,
                )
                review_orders.append(review_order)

                review = Review(
                    id=_uid(),
                    order_id=review_order_id,
                    user_id=client.id,
                    specialist_id=spec.id,
                    rating=rating,
                    comment=comment,
                    pros=pros,
                    cons=cons,
                    response=response,
                    is_published=True,
                )
                reviews.append(review)
                review_idx += 1

        session.add_all(review_orders)
        session.add_all(reviews)
        print(f"[seed] Создано {len(review_orders)} заказов для отзывов.")
        print(f"[seed] Создано {len(reviews)} отзывов.")

        # ---------------------------------------------------------------
        # Коммит
        # ---------------------------------------------------------------
        await session.commit()
        print("[seed] База данных успешно заполнена!")
        print(f"[seed] Итого:")
        print(f"  - Категорий: {len(categories)}")
        print(f"  - Навыков: {len(all_skills)}")
        print(f"  - Клиентов: {len(client_users)}")
        print(f"  - Специалистов: {len(specialists)}")
        print(f"  - Навыков специалистов: {len(specialist_skills_list)}")
        print(f"  - Услуг: {len(services)}")
        print(f"  - Заказов: {len(orders) + len(review_orders)}")
        print(f"  - Ставок: {len(bids)}")
        print(f"  - Отзывов: {len(reviews)}")


# ---------------------------------------------------------------------------
# Точка входа
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_database())
