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

  // Milestones endpoints
  async getMilestones(orderId: string) {
    return this.request(`/orders/${orderId}/milestones`, { method: 'GET' });
  }

  async createMilestone(orderId: string, data: any) {
    return this.request(`/orders/${orderId}/milestones`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async fundMilestone(milestoneId: string) {
    return this.request(`/milestones/${milestoneId}/fund`, { method: 'POST' });
  }

  async submitMilestone(milestoneId: string) {
    return this.request(`/milestones/${milestoneId}/submit`, { method: 'POST' });
  }

  async approveMilestone(milestoneId: string) {
    return this.request(`/milestones/${milestoneId}/approve`, { method: 'POST' });
  }

  // Recommended specialists
  async getRecommendedSpecialists(orderId: string) {
    return this.request(`/orders/${orderId}/recommended-specialists`, { method: 'GET' });
  }

  async getRecommendedByParams(params: Record<string, any>) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value.toString());
    });
    return this.request(`/specialists/recommended?${queryParams.toString()}`, { method: 'GET' });
  }

  // Progress updates
  async getProgressUpdates(orderId: string) {
    return this.request(`/orders/${orderId}/progress`, { method: 'GET' });
  }

  async createProgressUpdate(orderId: string, data: any) {
    return this.request(`/orders/${orderId}/progress`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Portfolio
  async getPortfolio(specialistId: string) {
    return this.request(`/specialists/${specialistId}/portfolio`, { method: 'GET' });
  }

  async createPortfolioProject(specialistId: string, data: any) {
    return this.request(`/specialists/${specialistId}/portfolio`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Verification
  async submitVerification(data: any) {
    return this.request('/verification/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyVerification() {
    return this.request('/verification/me', { method: 'GET' });
  }

  // Disputes
  async openDispute(orderId: string, reason: string) {
    return this.request(`/orders/${orderId}/dispute`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async addDisputeEvidence(disputeId: string, data: any) {
    return this.request(`/disputes/${disputeId}/evidence`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDispute(disputeId: string) {
    return this.request(`/disputes/${disputeId}`, { method: 'GET' });
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.request('/admin/dashboard', { method: 'GET' });
  }

  async getAdminUsers(params?: { search?: string; role?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const qs = queryParams.toString();
    return this.request(`/admin/users${qs ? `?${qs}` : ''}`, { method: 'GET' });
  }

  async updateUser(userId: string, data: any) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getAdminOrders(params?: { status?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const qs = queryParams.toString();
    return this.request(`/admin/orders${qs ? `?${qs}` : ''}`, { method: 'GET' });
  }

  async getAdminDisputes(params?: { status?: string; page?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const qs = queryParams.toString();
    return this.request(`/admin/disputes${qs ? `?${qs}` : ''}`, { method: 'GET' });
  }

  async resolveDispute(disputeId: string, resolution: string) {
    return this.request(`/admin/disputes/${disputeId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ resolution }),
    });
  }

  async getAdminVerifications(params?: { status?: string; page?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const qs = queryParams.toString();
    return this.request(`/admin/verifications${qs ? `?${qs}` : ''}`, { method: 'GET' });
  }

  async approveVerification(verificationId: string) {
    return this.request(`/admin/verifications/${verificationId}/approve`, { method: 'POST' });
  }

  async rejectVerification(verificationId: string, reason: string) {
    return this.request(`/admin/verifications/${verificationId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getAnalytics() {
    return this.request('/admin/analytics', { method: 'GET' });
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
