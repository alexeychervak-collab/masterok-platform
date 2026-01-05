# YODO Landing

Next.js лендинг для платформы YODO.

## Технологии

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Prisma + Vercel Postgres
- Radix UI

## Установка

```bash
# Установка зависимостей
npm install

# Генерация Prisma клиента
npx prisma generate

# Запуск в режиме разработки
npm run dev
```

## Деплой на Vercel

### 1. Создайте базу данных

В Vercel Dashboard → Storage → Create → Postgres

### 2. Подключите проект

```bash
npx vercel link
npx vercel env pull .env.local
```

### 3. Примените миграции

```bash
npx prisma db push
npx prisma db seed
```

### 4. Деплой

```bash
npx vercel --prod
```

## Переменные окружения

```env
# Vercel Postgres (автоматически)
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# Auth
JWT_SECRET=your-secret-key

# Payments
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
```

## Структура

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/            # UI компоненты
│   ├── layout/        # Header, Footer
│   └── sections/      # Секции лендинга
└── lib/
    ├── prisma.ts
    └── utils.ts
```




