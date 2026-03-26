import axios, { AxiosInstance, AxiosResponse } from 'axios'

const API_BASE_URL = 'http://localhost:5000'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Generic request methods
  async get<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url)
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url)
    return response.data
  }
}

// Auth service
export const authService = {
  login: async (email: string, password: string) => {
    const api = new ApiService()
    return await api.post('/api/auth/login', { email, password })
  },

  getMe: async (token: string) => {
    const api = new ApiService()
    return await api.get('/api/auth/me')
  },

  forgotPassword: async (email: string) => {
    const api = new ApiService()
    return await api.post('/api/auth/forgot-password', { email })
  },

  resetPassword: async (token: string, password: string) => {
    const api = new ApiService()
    return await api.post('/api/auth/reset-password', { token, password })
  }
}

// Users service
export const usersService = {
  getAll: async () => {
    const api = new ApiService()
    return await api.get('/api/users')
  },

  getById: async (id: string) => {
    const api = new ApiService()
    return await api.get(`/api/users/${id}`)
  },

  create: async (data: any) => {
    const api = new ApiService()
    return await api.post('/api/users', data)
  },

  update: async (id: string, data: any) => {
    const api = new ApiService()
    return await api.put(`/api/users/${id}`, data)
  },

  delete: async (id: string) => {
    const api = new ApiService()
    return await api.delete(`/api/users/${id}`)
  }
}

// Ambulances service
export const ambulancesService = {
  getAll: async () => {
    const api = new ApiService()
    return await api.get('/api/ambulances')
  },

  getById: async (id: string) => {
    const api = new ApiService()
    return await api.get(`/api/ambulances/${id}`)
  },

  create: async (data: any) => {
    const api = new ApiService()
    return await api.post('/api/ambulances', data)
  },

  update: async (id: string, data: any) => {
    const api = new ApiService()
    return await api.put(`/api/ambulances/${id}`, data)
  },

  delete: async (id: string) => {
    const api = new ApiService()
    return await api.delete(`/api/ambulances/${id}`)
  },

  updateStatus: async (id: string, status: string) => {
    const api = new ApiService()
    return await api.put(`/api/ambulances/${id}/status`, { status })
  }
}

// Patients service
export const patientsService = {
  getAll: async () => {
    const api = new ApiService()
    return await api.get('/api/patients')
  },

  getById: async (id: string) => {
    const api = new ApiService()
    return await api.get(`/api/patients/${id}`)
  },

  create: async (data: any) => {
    const api = new ApiService()
    return await api.post('/api/patients', data)
  },

  update: async (id: string, data: any) => {
    const api = new ApiService()
    return await api.put(`/api/patients/${id}`, data)
  },

  delete: async (id: string) => {
    const api = new ApiService()
    return await api.delete(`/api/patients/${id}`)
  }
}

// Emergency requests service
export const emergencyRequestsService = {
  getAll: async () => {
    const api = new ApiService()
    return await api.get('/api/emergency-requests')
  },

  getById: async (id: string) => {
    const api = new ApiService()
    return await api.get(`/api/emergency-requests/${id}`)
  },

  create: async (data: any) => {
    const api = new ApiService()
    return await api.post('/api/emergency-requests', data)
  },

  update: async (id: string, data: any) => {
    const api = new ApiService()
    return await api.put(`/api/emergency-requests/${id}`, data)
  },

  delete: async (id: string) => {
    const api = new ApiService()
    return await api.delete(`/api/emergency-requests/${id}`)
  },

  assignAmbulance: async (id: string, ambulanceId: string, driverId: string) => {
    const api = new ApiService()
    return await api.put(`/api/emergency-requests/${id}/assign`, { ambulanceId, driverId })
  },

  updateStatus: async (id: string, status: string) => {
    const api = new ApiService()
    return await api.put(`/api/emergency-requests/${id}/status`, { status })
  }
}

// Referrals service
export const referralsService = {
  getAll: async () => {
    const api = new ApiService()
    return await api.get('/api/referrals')
  },

  getById: async (id: string) => {
    const api = new ApiService()
    return await api.get(`/api/referrals/${id}`)
  },

  create: async (data: any) => {
    const api = new ApiService()
    return await api.post('/api/referrals', data)
  },

  update: async (id: string, data: any) => {
    const api = new ApiService()
    return await api.put(`/api/referrals/${id}`, data)
  },

  delete: async (id: string) => {
    const api = new ApiService()
    return await api.delete(`/api/referrals/${id}`)
  }
}

// Reports service
export const reportsService = {
  getDashboardStats: async () => {
    const api = new ApiService()
    return await api.get('/api/reports/dashboard')
  },

  getEmergencyRequests: async (filters?: any) => {
    const api = new ApiService()
    return await api.post('/api/reports/emergency-requests', filters)
  },

  getAmbulancePerformance: async (filters?: any) => {
    const api = new ApiService()
    return await api.post('/api/reports/ambulance-performance', filters)
  },

  getStaffPerformance: async (filters?: any) => {
    const api = new ApiService()
    return await api.post('/api/reports/staff-performance', filters)
  }
}
