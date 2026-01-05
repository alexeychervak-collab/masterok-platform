import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'repair' },
      update: {},
      create: {
        name: 'Ремонт и отделка',
        slug: 'repair',
        description: 'Ремонт квартир, домов, офисов',
        icon: 'Paintbrush',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'electric' },
      update: {},
      create: {
        name: 'Электрика',
        slug: 'electric',
        description: 'Электромонтажные работы',
        icon: 'Zap',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'plumbing' },
      update: {},
      create: {
        name: 'Сантехника',
        slug: 'plumbing',
        description: 'Сантехнические работы',
        icon: 'Droplets',
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'cleaning' },
      update: {},
      create: {
        name: 'Клининг',
        slug: 'cleaning',
        description: 'Уборка помещений',
        icon: 'Sparkles',
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tutors' },
      update: {},
      create: {
        name: 'Репетиторы',
        slug: 'tutors',
        description: 'Обучение и репетиторство',
        icon: 'GraduationCap',
        order: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Дизайн интерьера',
        slug: 'design',
        description: 'Дизайн и проектирование',
        icon: 'Palette',
        order: 6,
      },
    }),
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // Skills
  const skills = await Promise.all([
    // Электрика
    prisma.skill.upsert({
      where: { slug: 'wiring' },
      update: {},
      create: { name: 'Электропроводка', slug: 'wiring', categoryId: categories[1].id },
    }),
    prisma.skill.upsert({
      where: { slug: 'smart-home' },
      update: {},
      create: { name: 'Умный дом', slug: 'smart-home', categoryId: categories[1].id },
    }),
    prisma.skill.upsert({
      where: { slug: 'lighting' },
      update: {},
      create: { name: 'Освещение', slug: 'lighting', categoryId: categories[1].id },
    }),
    // Сантехника
    prisma.skill.upsert({
      where: { slug: 'pipe-repair' },
      update: {},
      create: { name: 'Ремонт труб', slug: 'pipe-repair', categoryId: categories[2].id },
    }),
    prisma.skill.upsert({
      where: { slug: 'installation' },
      update: {},
      create: { name: 'Установка сантехники', slug: 'installation', categoryId: categories[2].id },
    }),
    // Ремонт
    prisma.skill.upsert({
      where: { slug: 'painting' },
      update: {},
      create: { name: 'Покраска', slug: 'painting', categoryId: categories[0].id },
    }),
    prisma.skill.upsert({
      where: { slug: 'tiling' },
      update: {},
      create: { name: 'Укладка плитки', slug: 'tiling', categoryId: categories[0].id },
    }),
    // Клининг
    prisma.skill.upsert({
      where: { slug: 'deep-cleaning' },
      update: {},
      create: { name: 'Генеральная уборка', slug: 'deep-cleaning', categoryId: categories[3].id },
    }),
    // Репетиторы
    prisma.skill.upsert({
      where: { slug: 'english' },
      update: {},
      create: { name: 'Английский язык', slug: 'english', categoryId: categories[4].id },
    }),
    prisma.skill.upsert({
      where: { slug: 'math' },
      update: {},
      create: { name: 'Математика', slug: 'math', categoryId: categories[4].id },
    }),
    // Дизайн
    prisma.skill.upsert({
      where: { slug: '3d-visualization' },
      update: {},
      create: { name: '3D-визуализация', slug: '3d-visualization', categoryId: categories[5].id },
    }),
  ])

  console.log(`✅ Created ${skills.length} skills`)

  console.log('🎉 Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })




