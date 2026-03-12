import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Briefcase, MapPin, Clock, Users, Heart, TrendingUp, Zap, Award, Coffee, Globe } from 'lucide-react'

const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer (Next.js)',
    department: 'Engineering',
    city: 'Удаленно',
    type: 'Full-time',
    salary: '200 000 - 350 000 ₽',
    description: 'Разработка и развитие frontend платформы на Next.js 14, TypeScript, Tailwind CSS. Работа с современным стеком технологий.',
    requirements: ['React/Next.js 3+ года', 'TypeScript', 'Tailwind CSS', 'REST API, GraphQL', 'Git, CI/CD'],
  },
  {
    id: 2,
    title: 'Backend Developer (Python/FastAPI)',
    department: 'Engineering',
    city: 'Удаленно',
    type: 'Full-time',
    salary: '180 000 - 320 000 ₽',
    description: 'Проектирование и разработка высоконагруженных API, работа с PostgreSQL, оптимизация производительности.',
    requirements: ['Python 3+ года', 'FastAPI/Django', 'PostgreSQL', 'Docker', 'Опыт с микросервисами'],
  },
  {
    id: 3,
    title: 'Flutter Mobile Developer',
    department: 'Engineering',
    city: 'Удаленно',
    type: 'Full-time',
    salary: '150 000 - 280 000 ₽',
    description: 'Разработка мобильного приложения на Flutter, интеграция с API, работа над UX/UI.',
    requirements: ['Flutter/Dart 2+ года', 'REST API', 'State management', 'iOS & Android', 'Git'],
  },
  {
    id: 4,
    title: 'Product Designer (UI/UX)',
    department: 'Design',
    city: 'Москва/Удаленно',
    type: 'Full-time',
    salary: '120 000 - 250 000 ₽',
    description: 'Создание интерфейсов для web и mobile, проведение UX-исследований, работа с дизайн-системой.',
    requirements: ['Figma', 'Опыт в продуктовом дизайне 2+ года', 'Портфолио', 'UX research', 'Прототипирование'],
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    department: 'Engineering',
    city: 'Удаленно',
    type: 'Full-time',
    salary: '160 000 - 300 000 ₽',
    description: 'Настройка и поддержка инфраструктуры, CI/CD, мониторинг, автоматизация развертывания.',
    requirements: ['Docker, Kubernetes', 'Linux', 'CI/CD (GitHub Actions)', 'Terraform', 'Monitoring (Prometheus, Grafana)'],
  },
  {
    id: 6,
    title: 'QA Engineer',
    department: 'Engineering',
    city: 'Удаленно',
    type: 'Full-time',
    salary: '100 000 - 180 000 ₽',
    description: 'Тестирование web и mobile приложений, написание автотестов, работа с CI/CD.',
    requirements: ['Опыт тестирования 2+ года', 'Selenium/Playwright', 'Python/JavaScript', 'REST API testing', 'SQL'],
  },
  {
    id: 7,
    title: 'Content Manager',
    department: 'Marketing',
    city: 'Москва/Удаленно',
    type: 'Full-time',
    salary: '80 000 - 150 000 ₽',
    description: 'Создание контента для блога, соцсетей, email-рассылок. Работа с SEO.',
    requirements: ['Копирайтинг', 'SEO', 'Аналитика', 'Опыт в B2C', 'Грамотная речь'],
  },
  {
    id: 8,
    title: 'Customer Support Lead',
    department: 'Support',
    city: 'Москва/Удаленно',
    type: 'Full-time',
    salary: '90 000 - 160 000 ₽',
    description: 'Управление командой поддержки, выстраивание процессов, работа с клиентами.',
    requirements: ['Опыт управления командой', 'Клиентоориентированность', 'CRM системы', 'Аналитика', 'Стрессоустойчивость'],
  },
]

const benefits = [
  {
    icon: Zap,
    title: 'Гибкий график',
    description: 'Работайте в удобное для вас время',
  },
  {
    icon: Globe,
    title: 'Удаленная работа',
    description: 'Работайте из любой точки мира',
  },
  {
    icon: TrendingUp,
    title: 'Рост и развитие',
    description: 'Обучение, конференции, сертификация',
  },
  {
    icon: Heart,
    title: 'ДМС',
    description: 'Полный пакет медицинского страхования',
  },
  {
    icon: Coffee,
    title: 'Офис в центре',
    description: 'Современный офис с зонами отдыха',
  },
  {
    icon: Award,
    title: 'Бонусы',
    description: 'KPI и годовые бонусы за результаты',
  },
]

const values = [
  {
    title: 'Клиентоориентированность',
    description: 'Мы создаем продукт, который решает реальные проблемы пользователей',
  },
  {
    title: 'Инновации',
    description: 'Мы используем современные технологии и постоянно экспериментируем',
  },
  {
    title: 'Команда',
    description: 'Мы поддерживаем друг друга и растем вместе',
  },
  {
    title: 'Прозрачность',
    description: 'Мы открыто делимся информацией и принимаем решения вместе',
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 mb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Присоединяйтесь к команде МастерОК
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Мы строим будущее индустрии услуг. Станьте частью команды профессионалов, 
              которые меняют рынок труда в России.
            </p>
            <div className="flex flex-wrap gap-8 justify-center text-left">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-gray-600">Сотрудников</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-gray-600">Открытых вакансий</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">150%</div>
                  <div className="text-gray-600">Рост за год</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Почему МастерОК?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold mb-8">Открытые вакансии</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.city}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{job.salary}</div>
                      <div className="text-sm text-gray-600">в месяц</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Требования:</div>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow">
                    Откликнуться
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Наши ценности</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 text-lg">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Не нашли подходящую вакансию?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
              Отправьте нам свое резюме, и мы свяжемся с вами, когда появится подходящая позиция
            </p>
            <a
              href="mailto:hr@masterok.ru"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-shadow"
            >
              Отправить резюме
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}





