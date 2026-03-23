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
      { name: 'Безопасная сделка', href: '/safe-deal' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  company: {
    title: 'Компания',
    links: [
      { name: 'О нас', href: '/about' },
      { name: 'Контакты', href: '/contacts' },
      { name: 'Вакансии', href: '/careers' },
      { name: 'Блог', href: '/blog' },
      { name: 'Для бизнеса', href: '/business' },
      { name: 'Истории успеха', href: '/success-stories' },
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

const TelegramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
);

const VKIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.785 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.678.864 2.492 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.15-3.574 2.15-3.574.119-.254.305-.491.746-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.746.864 1.32 1.592 1.473 2.084.17.508-.085.763-.594.763z"/></svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
);

const socialIconComponents: Record<string, React.FC> = {
  Telegram: TelegramIcon,
  VK: VKIcon,
  Instagram: InstagramIcon,
};

const socialLinks = [
  { name: 'Telegram', href: 'https://t.me/masterok' },
  { name: 'VK', href: 'https://vk.com/masterok' },
  { name: 'Instagram', href: 'https://instagram.com/masterok' },
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
                МастерОК
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
              <a href="mailto:support@masterok.ru" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                support@masterok.ru
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
            © {new Date().getFullYear()} МастерОК. Все права защищены.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:scale-110 transition-all"
                title={link.name}
              >
                {(() => { const SocialIcon = socialIconComponents[link.name]; return SocialIcon ? <SocialIcon /> : null; })()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}




