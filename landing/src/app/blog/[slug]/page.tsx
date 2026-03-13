'use client'

import Header from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react'

const articles: Record<string, { title: string; author: string; date: string; readTime: string; category: string; image: string; content: string[] }> = {
  'kak-vybrat-specialista': {
    title: 'Как выбрать специалиста для ремонта',
    author: 'Редакция МастерОК',
    date: '2026-02-15',
    readTime: '7 мин',
    category: 'Советы',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200',
    content: [
      'Выбор специалиста для ремонта — одно из самых важных решений, которое напрямую влияет на результат. Не стоит ориентироваться только на цену: самый дешёвый мастер может обойтись дороже из-за переделок. Обращайте внимание на портфолио, отзывы реальных клиентов и готовность работать по договору.',
      'На МастерОК каждый специалист проходит верификацию: мы проверяем документы, опыт работы и квалификацию. Рейтинг формируется на основе реальных отзывов заказчиков. Верифицированные мастера с рейтингом 4.8+ — это проверенный выбор для любого проекта.',
      'Перед началом работ обязательно обсудите смету, сроки и гарантийные обязательства. Используйте безопасную сделку на платформе: деньги замораживаются и переводятся специалисту только после вашего подтверждения качества. Это защищает обе стороны.',
      'Несколько советов: запросите фотоотчёт с предыдущих объектов, уточните наличие допусков (для электрики и газа это критично), договоритесь о промежуточных приёмках. Хороший специалист сам предложит составить договор и подробную смету.',
    ],
  },
  'bezopasnya-sdelka': {
    title: 'Безопасная сделка: как работает эскроу',
    author: 'Юридический отдел',
    date: '2026-02-10',
    readTime: '5 мин',
    category: 'Платежи',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200',
    content: [
      'Безопасная сделка — это механизм защиты платежей, при котором деньги заказчика не поступают специалисту напрямую, а удерживаются на специальном счёте до завершения работ. Это называется эскроу, и это стандарт для всех крупных маркетплейсов услуг.',
      'Как это работает: заказчик создаёт заказ и вносит оплату. Деньги замораживаются на платформе. Специалист выполняет работы и отправляет фотоотчёт. Заказчик проверяет результат и подтверждает приёмку. После этого средства моментально переводятся специалисту.',
      'Если возникает спор, подключается служба модерации МастерОК. Мы рассматриваем фотоматериалы, договор и переписку, чтобы вынести справедливое решение. В 94% случаев споры решаются в течение 48 часов.',
      'Для специалистов безопасная сделка тоже выгодна: гарантия оплаты за выполненную работу, меньше рисков «кинуть на деньги», повышенное доверие со стороны заказчиков.',
    ],
  },
  'skolko-stoit-remont': {
    title: 'Сколько стоит ремонт квартиры в 2026 году',
    author: 'Аналитический отдел',
    date: '2026-01-28',
    readTime: '10 мин',
    category: 'Аналитика',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    content: [
      'Стоимость ремонта квартиры зависит от множества факторов: площадь, состояние объекта, класс отделки и регион. В Москве в 2026 году средняя стоимость косметического ремонта составляет 8 000 — 15 000 руб/м², капитального ремонта — 20 000 — 45 000 руб/м², а дизайнерского ремонта — от 50 000 руб/м².',
      'Основные статьи расходов: материалы (40-50% бюджета), работа мастеров (30-40%), проект и дизайн (5-10%), непредвиденные расходы (10-15%). Рекомендуем всегда закладывать запас 10-15% от общего бюджета.',
      'Чтобы сэкономить без потери качества: заказывайте материалы заранее (не в сезон), сравнивайте цены от нескольких специалистов на МастерОК, выбирайте мастеров с фиксированной ценой за весь объём работ, а не почасовую оплату.',
      'По данным нашей платформы, средний бюджет ремонта однокомнатной квартиры в Москве — 850 000 руб, двухкомнатной — 1 400 000 руб, трёхкомнатной — 2 100 000 руб. В регионах цены на 30-50% ниже.',
    ],
  },
  'dizajn-trendy': {
    title: 'Тренды дизайна интерьера 2026',
    author: 'Дизайн-команда',
    date: '2026-01-20',
    readTime: '6 мин',
    category: 'Дизайн',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200',
    content: [
      'В 2026 году главный тренд — осознанный минимализм. Функциональные пространства, натуральные материалы, тёплые тона и продуманное освещение. Уходят в прошлое перегруженные интерьеры с обилием декора.',
      'Популярные решения: встроенная мебель, скрытые системы хранения, умный дом (автоматическое управление светом, климатом, шторами). Микроцемент и штукатурка вместо обоев, дерево и камень вместо пластика.',
      'Цветовая палитра: тёплый белый, бежевые тона, терракота, глубокий зелёный. Акцентные стены возвращаются, но в более сдержанном исполнении — рейки, декоративная штукатурка, натуральный камень.',
      'Совет: выбирайте дизайнера, который предлагает 3D-визуализацию. На МастерОК много дизайнеров с портфолио реализованных проектов. Цена дизайн-проекта от 1 500 до 5 000 руб/м².',
    ],
  },
  'elektromontazh-v-kvartire': {
    title: 'Электромонтаж: что нужно знать',
    author: 'Технический отдел',
    date: '2026-01-15',
    readTime: '8 мин',
    category: 'Инструкции',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200',
    content: [
      'Электромонтаж — один из самых ответственных этапов ремонта. Ошибки в проводке могут привести к пожару или поражению током. Поэтому важно доверить эту работу профессионалу с допуском и опытом.',
      'Что входит в полный электромонтаж: проектирование схемы, штробление стен, прокладка кабеля, установка щитка с автоматами и УЗО, монтаж розеток и выключателей, подключение бытовой техники.',
      'Стоимость зависит от объёма: замена проводки в однокомнатной квартире — 35 000 — 65 000 руб, в двухкомнатной — 50 000 — 90 000 руб. Точка (розетка/выключатель) стоит от 500 до 1 500 руб.',
      'На МастерОК все электрики проходят проверку квалификации. Ищите специалистов с допуском до 1000В и опытом от 5 лет. Используйте безопасную сделку, чтобы оплата прошла после проверки работ.',
    ],
  },
  'uteplenie-doma': {
    title: 'Утепление дома: материалы и технологии',
    author: 'Эксперт по энергоэффективности',
    date: '2026-01-10',
    readTime: '7 мин',
    category: 'Строительство',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    content: [
      'Правильное утепление снижает расходы на отопление на 40-60%. Основные материалы: минеральная вата (базальтовая), экструдированный пенополистирол (XPS), пенополиуретан (PPU) напылением, эковата.',
      'Каждый материал имеет свои преимущества. Минвата — универсальный выбор для стен и крыши, паропроницаемая. XPS — идеален для фундамента и цоколя, не впитывает влагу. PPU — лучшая теплоизоляция, но дороже.',
      'Типичные ошибки: недостаточная толщина утеплителя, отсутствие пароизоляции, мостики холода на стыках. Всё это приводит к конденсату, плесени и потере эффективности утепления.',
      'Стоимость утепления фасада под ключ: от 1 800 до 3 500 руб/м². На МастерОК вы найдёте специалистов по утеплению с портфолио выполненных объектов и гарантией.',
    ],
  },
  'vybor-materialov': {
    title: 'Как выбрать отделочные материалы',
    author: 'Прораб со стажем',
    date: '2026-01-05',
    readTime: '9 мин',
    category: 'Советы',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
    content: [
      'Качество отделочных материалов определяет долговечность ремонта. Экономия на материалах может привести к тому, что через 2-3 года придётся всё переделывать.',
      'Для стен: штукатурка Knauf или Волма для выравнивания, обои — флизелиновые (долговечнее виниловых), краска — Dulux, Tikkurila, Caparol (акриловая или латексная). Для ванной — только влагостойкие материалы.',
      'Для пола: ламинат 33 класса (от 800 руб/м²), инженерная доска (от 2 500 руб/м²), керамогранит для влажных зон (от 1 200 руб/м²). Плитку берите с запасом 10% на подрезку.',
      'Совет: покупайте материалы в крупных сетях (Леруа Мерлен, OBI, Петрович) — там дешевле и есть возврат. Но закупку лучше согласовать со специалистом, чтобы не купить лишнего.',
    ],
  },
  'etapy-remonta': {
    title: 'Этапы ремонта квартиры: пошаговая инструкция',
    author: 'Главный прораб МастерОК',
    date: '2025-12-28',
    readTime: '12 мин',
    category: 'Инструкции',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200',
    content: [
      'Правильная последовательность ремонта экономит время и деньги. Вот проверенный порядок: 1) Проект и дизайн. 2) Демонтаж. 3) Возведение перегородок. 4) Электрика и сантехника (черновая). 5) Стяжка пола. 6) Штукатурка стен.',
      'Продолжение: 7) Разводка отопления и кондиционирования. 8) Шпаклёвка и подготовка стен. 9) Укладка плитки в санузлах. 10) Чистовая отделка: обои/покраска. 11) Укладка напольных покрытий. 12) Установка дверей.',
      'Финал: 13) Монтаж натяжных потолков. 14) Установка розеток, выключателей, светильников. 15) Установка сантехники. 16) Монтаж кухни. 17) Уборка и финальная приёмка.',
      'Типичные сроки: косметический ремонт 1-комнатной — 2-4 недели, капитальный ремонт — 2-4 месяца, ремонт под ключ с дизайн-проектом — 3-6 месяцев. Найдите бригаду на МастерОК и контролируйте каждый этап через платформу.',
    ],
  },
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug]

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Статья не найдена</h1>
          <p className="text-gray-600 mb-6">К сожалению, такой статьи не существует.</p>
          <Link href="/blog" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">Все статьи</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const otherSlugs = Object.keys(articles).filter(s => s !== params.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Главная</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Блог</Link>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-xs">{article.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            {/* Hero image */}
            <div className="rounded-2xl overflow-hidden mb-6 aspect-video bg-gray-200">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full font-medium">{article.category}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(article.date).toLocaleDateString('ru-RU')}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{article.readTime}</span>
              <span className="flex items-center gap-1"><User className="w-4 h-4" />{article.author}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>

            <div className="prose prose-lg max-w-none">
              {article.content.map((p, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">{p}</p>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Нужен специалист?</h3>
              <p className="text-primary-100 mb-4">Найдите проверенного мастера на МастерОК. Безопасная сделка, рейтинги, отзывы.</p>
              <div className="flex gap-3">
                <Link href="/search" className="px-5 py-2.5 bg-white text-primary-700 rounded-xl font-semibold hover:bg-gray-50">Найти специалиста</Link>
                <Link href="/create-order" className="px-5 py-2.5 border border-white/30 rounded-xl font-semibold hover:bg-white/10">Создать заказ</Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Другие статьи</h3>
              <div className="space-y-4">
                {otherSlugs.map(slug => (
                  <Link key={slug} href={`/blog/${slug}`} className="block group">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{articles[slug].title}</div>
                    <div className="text-xs text-gray-500 mt-1">{articles[slug].readTime} · {articles[slug].category}</div>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="block mt-4 text-sm text-primary-600 font-medium hover:underline">Все статьи →</Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Быстрые ссылки</h3>
              <div className="space-y-2">
                <Link href="/search" className="block text-sm text-primary-600 hover:underline">Найти специалиста →</Link>
                <Link href="/create-order" className="block text-sm text-primary-600 hover:underline">Создать заказ →</Link>
                <Link href="/how-it-works" className="block text-sm text-primary-600 hover:underline">Как это работает →</Link>
                <Link href="/pricing" className="block text-sm text-primary-600 hover:underline">Тарифы →</Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Back */}
        <div className="mt-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Назад к блогу
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
