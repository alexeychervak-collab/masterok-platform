'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'Как найти специалиста?',
    answer: 'Используйте поиск на главной странице или просмотрите каталог по категориям. Вы можете фильтровать специалистов по рейтингу, городу, опыту и другим параметрам.',
  },
  {
    question: 'Как происходит оплата?',
    answer: 'Оплата производится через платформу. После согласования заказа вы вносите предоплату, которая хранится на защищённом счёте. Деньги переводятся специалисту только после вашего подтверждения выполнения работы.',
  },
  {
    question: 'Какая комиссия платформы?',
    answer: 'Комиссия платформы составляет 15% от стоимости заказа. Она уже включена в цену, которую вы видите. Специалист получает 85% от суммы заказа.',
  },
  {
    question: 'Как стать специалистом?',
    answer: 'Зарегистрируйтесь на платформе, заполните профиль, укажите свои навыки и опыт, загрузите портфолио. После модерации вы сможете принимать заказы.',
  },
  {
    question: 'Что делать, если возник спор?',
    answer: 'В случае спора обратитесь в службу поддержки через личный кабинет. Мы рассмотрим ситуацию и поможем найти справедливое решение. Деньги не будут переведены специалисту до разрешения спора.',
  },
  {
    question: 'Как отменить заказ?',
    answer: 'Вы можете отменить заказ в личном кабинете до начала работы. Если работа уже началась, свяжитесь с поддержкой для решения вопроса.',
  },
]

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors"
      >
        <span className="font-semibold text-lg pr-4">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 flex-shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-6">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Частые <span className="gradient-text">вопросы</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ответы на популярные вопросы о платформе
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-card rounded-2xl border p-6 md:p-8"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}




