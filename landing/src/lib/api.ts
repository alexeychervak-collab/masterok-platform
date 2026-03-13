const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('masterok_auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('masterok_auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('masterok_auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle 401 — token may be expired
      if (response.status === 401) {
        this.clearToken();
        return {
          error: 'Unauthorized — please log in again',
          status: 401,
        };
      }

      let data: any;
      try {
        data = await response.json();
      } catch {
        // Response is not valid JSON (e.g. HTML error page, empty body)
        return {
          error: response.ok ? undefined : `Server error (${response.status})`,
          status: response.status,
          ...(response.ok ? { data: null as unknown as T } : {}),
        };
      }

      if (!response.ok) {
        return {
          error: data.detail || data.message || 'Something went wrong',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0,
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ access_token: string; token_type: string; user: any }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) {
    return this.request<{ access_token: string; token_type: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.request('/users/me', {
      method: 'GET',
    });
  }

  // Categories endpoints
  async getCategories() {
    return this.request('/categories/', {
      method: 'GET',
    });
  }

  async getCategoryById(id: string) {
    return this.request(`/categories/${id}`, {
      method: 'GET',
    });
  }

  // Specialists endpoints
  async getSpecialists(params?: {
    category_id?: string;
    search?: string;
    min_rating?: number;
    max_price?: number;
    verified?: boolean;
    skip?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = `/specialists/${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint, {
      method: 'GET',
    });
  }

  async getSpecialistById(id: string) {
    return this.request(`/specialists/${id}`, {
      method: 'GET',
    });
  }

  async createSpecialist(data: any) {
    return this.request('/specialists/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSpecialist(id: string, data: any) {
    return this.request(`/specialists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Services endpoints
  async getServices(specialistId?: string) {
    const endpoint = specialistId
      ? `/services/?specialist_id=${specialistId}`
      : '/services/';

    return this.request(endpoint, {
      method: 'GET',
    });
  }

  async getServiceById(id: string) {
    return this.request(`/services/${id}`, {
      method: 'GET',
    });
  }

  async createService(data: any) {
    return this.request('/services/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Orders endpoints
  async getOrders() {
    return this.request('/orders/', {
      method: 'GET',
    });
  }

  async getOrderById(id: string) {
    return this.request(`/orders/${id}`, {
      method: 'GET',
    });
  }

  async createOrder(data: {
    service_id: string;
    description: string;
    budget?: number;
    deadline?: string;
  }) {
    return this.request('/orders/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Reviews endpoints
  async getReviews(specialistId: string, page: number = 1, perPage: number = 20) {
    return this.request(`/reviews/specialist/${specialistId}?page=${page}&per_page=${perPage}`, {
      method: 'GET',
    });
  }

  async createReview(data: {
    specialist_id: string;
    order_id: string;
    rating: number;
    comment: string;
  }) {
    return this.request('/reviews/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Search
  async search(query: string, filters?: any) {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return this.request(`/search/?${params.toString()}`, {
      method: 'GET',
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
