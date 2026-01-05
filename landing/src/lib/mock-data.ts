export type Availability = 'online' | 'offline' | 'busy'

export interface SpecialistMock {
  id: string
  name: string
  title: string
  rating: number
  reviewCount: number
  completedJobs: number
  hourlyRate?: number
  fixedPrice?: number
  location: string
  city?: string
  experienceYears?: number
  direction?: 'Проектирование' | 'ПТО' | 'Смета' | 'Строительство' | 'Ремонт' | 'Дизайн' | 'Инженерные сети'
  expertiseExperience?: 'Государственная' | 'Коммерческая' | 'Нет'
  authorSupervision?: boolean
  travelReady?: boolean
  initials: string
  avatarUrl: string
  verified: boolean
  topRated: boolean
  responseTime: string
  skills: string[]
  availability: Availability
  description: string
  portfolio: string[]
}

export interface CategoryMock {
  id: string
  name: string
  count: number
  icon: string
  image: string
  popular?: boolean
}

export interface ProjectMock {
  id: string
  title: string
  description: string
  budget: number
  image: string
  category: string
}

export interface OrderMock {
  id: string
  title: string
  description: string
  category: string
  direction?: 'Проектирование' | 'ПТО' | 'Смета' | 'Строительство' | 'Ремонт' | 'Дизайн' | 'Инженерные сети'
  objectType?: 'Жилой' | 'Коммерческий' | 'Сельскохозяйственный' | 'Социальный' | 'Специальный' | 'Административный' | 'Линейный'
  stage?: 'Проектная документация' | 'Рабочая документация'
  section?: string
  budget: { min: number; max: number } | number
  location: string
  city?: string
  deadline: string
  term?: '7 дней' | '14 дней' | '1 месяц' | '2 месяца' | '3 месяца+'
  expertise?: 'Государственная' | 'Коммерческая' | 'Не требуется'
  authorSupervision?: boolean
  requiresTravel?: boolean
  safeDeal?: boolean
  postedAt: string
  client: {
    name: string
    avatarUrl: string
    rating: number
    ordersCount: number
    verified: boolean
  }
  responses: number
  urgency: 'low' | 'medium' | 'high'
  matchScore?: number
}

// Списки из ОФ_Поиск (упрощённо; можно расширять)
export const projectSections = [
  'ГП — Генеральный план',
  'АД — Автомобильные дороги',
  'АР — Архитектурные решения',
  'КР — Конструктивные решения',
  'ОВ — Отопление/вентиляция/кондиционирование',
  'ВК — Водоснабжение/канализация',
  'ЭС — Электроснабжение',
  'СС — Слаботочные системы',
  'ПОС — Проект организации строительства',
  'ООС — Охрана окружающей среды',
  'ПБ — Пожарная безопасность',
  'ОДИ — Доступность для МГН',
  'ГОЧС — Гражданская оборона',
]

// NOTE: Используем внешние CDN-изображения, чтобы не хранить бинарники в репозитории.
// Если нужно "прогрузить" картинки локально — добавим скрипт скачивания и положим их в public/.
export const categoriesMock: CategoryMock[] = [
  {
    id: 'house',
    name: 'Строительство домов',
    count: 3200,
    icon: '🏗️',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
    popular: true,
  },
  {
    id: 'repair',
    name: 'Ремонт квартир',
    count: 4800,
    icon: '🔨',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
    popular: true,
  },
  {
    id: 'design',
    name: 'Дизайн интерьера',
    count: 1920,
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
    popular: true,
  },
  {
    id: 'plumbing',
    name: 'Сантехника',
    count: 1850,
    icon: '🚰',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800',
  },
  {
    id: 'electric',
    name: 'Электромонтаж',
    count: 2100,
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
  },
  {
    id: 'architecture',
    name: 'Архитектура',
    count: 2450,
    icon: '📐',
    image: 'https://images.unsplash.com/photo-1529421308418-eab98863cee6?w=800',
  },
  {
    id: 'roof',
    name: 'Кровельные работы',
    count: 980,
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800',
  },
  {
    id: 'facade',
    name: 'Фасадные работы',
    count: 1340,
    icon: '🎭',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  },
]

export const projectsMock: ProjectMock[] = [
  {
    id: 'p1',
    title: 'Строительство коттеджа',
    description: 'Загородный дом 200м² под ключ',
    budget: 3500000,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    category: 'Строительство',
  },
  {
    id: 'p2',
    title: 'Капитальный ремонт',
    description: 'Квартира 85м²',
    budget: 1200000,
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200',
    category: 'Ремонт',
  },
  {
    id: 'p3',
    title: 'Архитектурный проект',
    description: 'Проектирование коттеджа',
    budget: 180000,
    image: 'https://images.unsplash.com/photo-1529421308418-eab98863cee6?w=1200',
    category: 'Архитектура',
  },
  {
    id: 'p4',
    title: 'Дизайн интерьера',
    description: 'Современный стиль',
    budget: 350000,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200',
    category: 'Дизайн',
  },
]

export const specialistsMock: SpecialistMock[] = [
  {
    id: '1',
    name: 'Даниил Крахин',
    title: 'Профессиональный архитектор и проектировщик',
    rating: 4.95,
    reviewCount: 127,
    completedJobs: 200,
    fixedPrice: 150000,
    location: 'Москва',
    city: 'Москва',
    experienceYears: 15,
    direction: 'Проектирование',
    expertiseExperience: 'Государственная',
    authorSupervision: true,
    travelReady: true,
    initials: 'ДК',
    avatarUrl: 'https://i.pravatar.cc/200?img=12',
    verified: true,
    topRated: true,
    responseTime: '1 час',
    skills: ['Проектирование', 'Архитектура', 'AutoCAD', '3D моделирование'],
    availability: 'online',
    description: 'Опыт 15+ лет. Проектирование частных домов и квартир. Договор, смета, сопровождение.',
    portfolio: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600',
    ],
  },
  {
    id: '2',
    name: 'Алексей Иванов',
    title: 'Мастер по ремонту и отделке',
    rating: 4.89,
    reviewCount: 89,
    completedJobs: 156,
    hourlyRate: 2500,
    location: 'Москва',
    city: 'Москва',
    experienceYears: 9,
    direction: 'Ремонт',
    expertiseExperience: 'Коммерческая',
    authorSupervision: false,
    travelReady: true,
    initials: 'АИ',
    avatarUrl: 'https://i.pravatar.cc/200?img=33',
    verified: true,
    topRated: true,
    responseTime: '30 мин',
    skills: ['Ремонт квартир', 'Отделка', 'Плитка', 'Шпаклевка'],
    availability: 'online',
    description: 'Ремонт под ключ. Гарантия 2 года. Фотоотчёты, ежедневный контроль качества.',
    portfolio: [
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600',
    ],
  },
  {
    id: '3',
    name: 'Михаил Петров',
    title: 'Электрик, допуск, опыт 10+ лет',
    rating: 4.92,
    reviewCount: 64,
    completedJobs: 98,
    hourlyRate: 1800,
    location: 'Москва',
    city: 'Москва',
    experienceYears: 11,
    direction: 'Инженерные сети',
    expertiseExperience: 'Нет',
    authorSupervision: false,
    travelReady: true,
    initials: 'МП',
    avatarUrl: 'https://i.pravatar.cc/200?img=56',
    verified: true,
    topRated: false,
    responseTime: '2 часа',
    skills: ['Электрика', 'Проводка', 'Щиты', 'Освещение'],
    availability: 'online',
    description: 'Электромонтаж любой сложности: от замены розеток до полной проводки. Чисто, аккуратно.',
    portfolio: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600',
      'https://images.unsplash.com/photo-1621905252472-943afaa20e20?w=600',
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600',
    ],
  },
  {
    id: '4',
    name: 'Сергей Васильев',
    title: 'Сантехник-универсал',
    rating: 4.87,
    reviewCount: 52,
    completedJobs: 87,
    hourlyRate: 2000,
    location: 'Москва',
    city: 'Москва',
    experienceYears: 7,
    direction: 'Инженерные сети',
    expertiseExperience: 'Нет',
    authorSupervision: false,
    travelReady: true,
    initials: 'СВ',
    avatarUrl: 'https://i.pravatar.cc/200?img=8',
    verified: false,
    topRated: false,
    responseTime: '3 часа',
    skills: ['Сантехника', 'Трубы', 'Смесители', 'Унитазы'],
    availability: 'offline',
    description: 'Срочный выезд, устранение протечек, замена сантехники. Работаю по договору.',
    portfolio: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600',
      'https://images.unsplash.com/photo-1585704034336-7e68c3a9d5ae?w=600',
      'https://images.unsplash.com/photo-1585704033160-4c7fda6b36d6?w=600',
    ],
  },
  {
    id: '5',
    name: 'Дмитрий Смирнов',
    title: 'Дизайнер интерьеров',
    rating: 4.96,
    reviewCount: 43,
    completedJobs: 65,
    fixedPrice: 80000,
    location: 'Москва',
    city: 'Москва',
    experienceYears: 8,
    direction: 'Дизайн',
    expertiseExperience: 'Коммерческая',
    authorSupervision: true,
    travelReady: false,
    initials: 'ДС',
    avatarUrl: 'https://i.pravatar.cc/200?img=5',
    verified: true,
    topRated: true,
    responseTime: '1 час',
    skills: ['Дизайн интерьера', '3D визуализация', 'Планировки'],
    availability: 'busy',
    description: 'Создам дизайн-проект: планировки, визуализации, подбор материалов, ведомости и чертежи.',
    portfolio: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?w=600',
    ],
  },
]

export const ordersMock: OrderMock[] = [
  {
    id: 'o1',
    title: 'Замена электропроводки в квартире 65 м²',
    description:
      'Нужен опытный электрик для полной замены проводки. Демонтаж старой, прокладка новой, щиток, розетки и выключатели.',
    category: 'Электрика',
    direction: 'Инженерные сети',
    objectType: 'Жилой',
    stage: 'Рабочая документация',
    section: 'ЭС — Электроснабжение',
    budget: { min: 45000, max: 65000 },
    location: 'Москва, Тверской район',
    city: 'Москва',
    deadline: '2026-02-10',
    term: '14 дней',
    expertise: 'Не требуется',
    authorSupervision: false,
    requiresTravel: true,
    safeDeal: true,
    postedAt: '2026-01-01T10:30:00',
    client: {
      name: 'Анна Петрова',
      avatarUrl: 'https://i.pravatar.cc/200?img=44',
      rating: 4.9,
      ordersCount: 12,
      verified: true,
    },
    responses: 5,
    urgency: 'high',
    matchScore: 95,
  },
  {
    id: 'o2',
    title: 'Косметический ремонт однокомнатной квартиры',
    description:
      'Поклейка обоев, покраска потолка, замена плинтусов, укладка ламината. Площадь 40 м².',
    category: 'Ремонт квартир',
    direction: 'Ремонт',
    objectType: 'Жилой',
    budget: 120000,
    location: 'Москва, СЗАО',
    city: 'Москва',
    deadline: '2026-02-15',
    term: '1 месяц',
    expertise: 'Не требуется',
    authorSupervision: false,
    requiresTravel: true,
    safeDeal: true,
    postedAt: '2026-01-01T09:15:00',
    client: {
      name: 'Дмитрий Иванов',
      avatarUrl: 'https://i.pravatar.cc/200?img=21',
      rating: 5.0,
      ordersCount: 8,
      verified: true,
    },
    responses: 12,
    urgency: 'medium',
    matchScore: 88,
  },
  {
    id: 'o3',
    title: 'Дизайн-проект кухни 15 м²',
    description:
      'Нужен дизайн-проект кухни с 3D визуализацией. Современный стиль, светлые тона. Срок — 2 недели.',
    category: 'Дизайн интерьера',
    direction: 'Проектирование',
    objectType: 'Жилой',
    stage: 'Проектная документация',
    section: 'АР — Архитектурные решения',
    budget: { min: 30000, max: 50000 },
    location: 'Москва, ЦАО',
    city: 'Москва',
    deadline: '2026-01-15',
    term: '14 дней',
    expertise: 'Коммерческая',
    authorSupervision: true,
    requiresTravel: false,
    safeDeal: false,
    postedAt: '2026-01-01T08:00:00',
    client: {
      name: 'Мария Сидорова',
      avatarUrl: 'https://i.pravatar.cc/200?img=15',
      rating: 4.7,
      ordersCount: 5,
      verified: false,
    },
    responses: 8,
    urgency: 'high',
    matchScore: 92,
  },
]





