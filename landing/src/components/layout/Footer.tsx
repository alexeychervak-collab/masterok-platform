import Link from 'next/link'
import { Sparkles, Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const footerLinks = {
  platform: {
    title: 'Платформа',
    links: [
      { name: 'Найти специалиста', href: '/search' },
      { name: 'Категории', href: '/categories' },
      { name: 'Найти заказы', href: '/specialist/find-orders' },
      { name: 'Как это работает', href: '/how-it-works' },
      { name: 'Тарифы', href: '/pricing' },
    ],
  },
  company: {
    title: 'Компания',
    links: [
      { name: 'О нас', href: '/about' },
      { name: 'Контакты', href: '/contacts' },
      { name: 'Вакансии', href: '/careers' },
      { name: 'Блог', href: '/blog' },
    ],
  },
  legal: {
    title: 'Документы',
    links: [
      { name: 'Условия использования', href: '/terms' },
      { name: 'Политика конфиденциальности', href: '/privacy' },
      { name: 'Оферта', href: '/offer' },
      { name: 'Правила платформы', href: '/rules' },
    ],
  },
}

const socialLinks = [
  { name: 'Telegram', href: 'https://t.me/yodo', icon: '📱' },
  { name: 'VK', href: 'https://vk.com/yodo', icon: '💬' },
  { name: 'Instagram', href: 'https://instagram.com/yodo', icon: '📷' },
]

export function Footer() {
  return (
    <footer className="relative bg-muted/30 border-t overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Newsletter Section */}
        <div className="py-12 border-b">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-display font-bold mb-3">
              Подпишитесь на новости
            </h3>
            <p className="text-muted-foreground mb-6">
              Получайте лучшие предложения и новости платформы
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Ваш email"
                className="flex-1"
              />
              <Button variant="gradient">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-pink-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                YODO
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Платформа для поиска проверенных специалистов. Быстро, удобно, безопасно.
            </p>
            <div className="space-y-2">
              <a href="tel:+78001234567" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4" />
                8 800 123-45-67
              </a>
              <a href="mailto:support@yodo.ru" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                support@yodo.ru
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Москва, Россия
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="py-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} YODO. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl hover:scale-110 transition-transform"
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}




