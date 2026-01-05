import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Shield, Users, Star, TrendingUp, Award, Heart } from 'lucide-react'

const stats = [
  { value: '15,000+', label: 'Специалистов' },
  { value: '50,000+', label: 'Выполненных проектов' },
  { value: '4.9/5', label: 'Средний рейтинг' },
  { value: '98%', label: 'Довольных клиентов' },
]

const values = [
  {
    icon: Shield,
    title: 'Безопасность',
    description: 'Проверенные специалисты, безопасные сделки через эскроу, защита данных'
  },
  {
    icon: Star,
    title: 'Качество',
    description: 'Рейтинговая система, реальные отзывы, гарантия качества работ'
  },
  {
    icon: Users,
    title: 'Сообщество',
    description: 'Активное комьюнити профессионалов и заказчиков'
  },
  {
    icon: TrendingUp,
    title: 'Развитие',
    description: 'Постоянное улучшение платформы, новые возможности'
  },
  {
    icon: Award,
    title: 'Профессионализм',
    description: 'Только проверенные мастера с подтвержденной квалификацией'
  },
  {
    icon: Heart,
    title: 'Забота',
    description: 'Круглосуточная поддержка, решение любых вопросов'
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              О платформе <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">YODO</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              YODO — современная платформа для поиска проверенных специалистов в сфере строительства, 
              ремонта и обслуживания. Мы объединяем профессионалов и заказчиков, делая процесс поиска 
              и выполнения работ максимально простым и безопасным.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white py-12 mb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">Наша миссия</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Мы создаем экосистему, где каждый может легко найти надежного специалиста для любой задачи, 
                а профессионалы получают постоянный поток заказов и инструменты для развития своего бизнеса.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Наша цель — сделать процесс поиска и заказа услуг таким же простым, как онлайн-шопинг, 
                но с гарантией качества и безопасности на каждом этапе.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Наши ценности</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="container mx-auto px-4 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Как мы работаем</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">1. Проверка специалистов</h3>
                <p className="text-gray-600">
                  Каждый специалист проходит тщательную проверку документов, квалификации и опыта работы. 
                  Мы проверяем паспортные данные, дипломы, сертификаты и портфолио выполненных работ.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">2. Прозрачное ценообразование</h3>
                <p className="text-gray-600">
                  Все цены на платформе прозрачны. Специалисты указывают стоимость услуг, 
                  клиенты могут сравнивать предложения и выбирать оптимальный вариант.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">3. Безопасная сделка</h3>
                <p className="text-gray-600">
                  Средства блокируются на счете эскроу до выполнения работ. Оплата происходит только 
                  после подтверждения качества заказчиком. Это защищает обе стороны сделки.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">4. Поддержка 24/7</h3>
                <p className="text-gray-600">
                  Наша команда поддержки всегда на связи. Мы помогаем решать любые вопросы, 
                  споры и проблемы, возникающие в процессе работы.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Присоединяйтесь к нам</h2>
            <p className="text-lg text-gray-600 mb-8">
              Станьте частью крупнейшего сообщества профессионалов и заказчиков. 
              Вместе мы создаем будущее индустрии услуг.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="/register-specialist" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Стать специалистом
              </a>
              <a 
                href="/register-client" 
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                Найти специалиста
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}





