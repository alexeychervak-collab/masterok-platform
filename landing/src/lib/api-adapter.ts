import api from './api'
import { specialistsMock, categoriesMock, ordersMock, reviewsMock, blogArticlesMock, faqMock } from './mock-data'

// Adapter: try API first, fallback to mock data

export async function fetchSpecialists(params?: {
  category?: string
  search?: string
  city?: string
  minRating?: number
  verified?: boolean
  page?: number
  perPage?: number
  sortBy?: string
}): Promise<{ specialists: any[]; total: number }> {
  try {
    const apiParams: any = {}
    if (params?.category) apiParams.category = params.category
    if (params?.search) apiParams.search = params.search
    if (params?.minRating) apiParams.min_rating = params.minRating
    if (params?.verified) apiParams.verified_only = params.verified
    if (params?.page) apiParams.page = params.page
    if (params?.perPage) apiParams.per_page = params.perPage
    if (params?.sortBy) apiParams.sort_by = params.sortBy

    const response = await api.getSpecialists(apiParams)
    if (response.data && Array.isArray((response.data as any).items)) {
      const data = response.data as any
      return {
        specialists: data.items.map(mapApiSpecialist),
        total: data.total || data.items.length,
      }
    }
    if (response.data && Array.isArray(response.data)) {
      return { specialists: (response.data as any[]).map(mapApiSpecialist), total: (response.data as any[]).length }
    }
  } catch (e) {
    console.warn('API unavailable, using mock data', e)
  }

  // Fallback
  let filtered = [...specialistsMock]
  if (params?.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.title.toLowerCase().includes(q) || s.skills.some((sk: string) => sk.toLowerCase().includes(q)))
  }
  if (params?.city) filtered = filtered.filter(s => s.city === params.city || s.location === params.city)
  if (params?.minRating) filtered = filtered.filter(s => s.rating >= params.minRating!)
  if (params?.verified) filtered = filtered.filter(s => s.verified)
  return { specialists: filtered, total: filtered.length }
}

export async function fetchCategories(): Promise<any[]> {
  try {
    const response = await api.getCategories()
    if (response.data && Array.isArray(response.data)) {
      return (response.data as any[]).map(c => ({
        id: c.slug || c.id,
        name: c.name,
        count: c.skills?.length ? c.skills.length * 150 : 500,
        icon: c.icon || '🔧',
        image: c.image || '',
        popular: (c.order || 0) <= 3,
      }))
    }
  } catch (e) {
    console.warn('API unavailable for categories', e)
  }
  return categoriesMock
}

export async function fetchSpecialist(id: string): Promise<any | null> {
  try {
    const response = await api.getSpecialistById(id)
    if (response.data) return mapApiSpecialist(response.data as any)
  } catch (e) {
    console.warn('API unavailable for specialist', e)
  }
  return specialistsMock.find(s => s.id === id) || null
}

export async function fetchReviews(specialistId: string): Promise<any[]> {
  try {
    const response = await api.getReviews(specialistId)
    if (response.data && Array.isArray(response.data)) {
      return (response.data as any[]).map(r => ({
        id: r.id,
        specialistId: r.specialist_id,
        clientName: r.user?.name || 'Клиент',
        clientAvatar: r.user?.avatar || `https://i.pravatar.cc/100?u=${r.user_id}`,
        rating: r.rating,
        comment: r.comment,
        pros: r.pros,
        cons: r.cons,
        date: r.created_at,
        response: r.response,
      }))
    }
  } catch (e) {
    console.warn('API unavailable for reviews', e)
  }
  return reviewsMock.filter(r => r.specialistId === specialistId)
}

export async function fetchOrders(): Promise<any[]> {
  try {
    const response = await api.getOrders()
    if (response.data && Array.isArray(response.data)) {
      return response.data as any[]
    }
  } catch (e) {
    console.warn('API unavailable for orders', e)
  }
  return ordersMock
}

export async function fetchBlogArticles(): Promise<any[]> {
  // Blog articles are currently static mock data only
  // API endpoint can be added here when backend supports it
  return blogArticlesMock
}

export async function fetchFaq(): Promise<any[]> {
  // FAQ items are currently static mock data only
  // API endpoint can be added here when backend supports it
  return faqMock
}

function mapApiSpecialist(s: any) {
  return {
    id: s.id,
    name: s.user_name || s.user?.name || 'Специалист',
    title: s.title || '',
    rating: s.rating || 0,
    reviewCount: s.review_count || 0,
    completedJobs: s.completed_orders || 0,
    hourlyRate: 0,
    location: s.city || '',
    city: s.city || '',
    experienceYears: s.experience || 0,
    initials: (s.user_name || s.user?.name || 'СП').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
    avatarUrl: s.user_avatar || s.user?.avatar || `https://i.pravatar.cc/200?u=${s.id}`,
    verified: s.is_verified || false,
    topRated: (s.rating || 0) >= 4.8,
    responseTime: s.response_time ? `${s.response_time} мин` : '1 час',
    skills: s.skills?.map((sk: any) => sk.skill?.name || sk.name || sk) || [],
    availability: s.is_available ? 'online' : 'offline',
    description: s.description || '',
    portfolio: [],
    premium: s.is_premium || false,
  }
}
