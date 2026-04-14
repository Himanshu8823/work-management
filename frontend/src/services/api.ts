import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 - try to refresh token (but not for auth endpoints)
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth')) {
          originalRequest._retry = true;
          try {
            await this.refreshToken();
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // ============ Auth ============
  async login(email: string, password: string) {
    const response = await this.axiosInstance.post('/auth/login', { email, password });
    if (response.data.data.accessToken) {
      Cookies.set('accessToken', response.data.data.accessToken, {
        secure: import.meta.env.PROD,
        sameSite: 'Lax',
      });
    }
    return response.data;
  }

  async refreshToken() {
    const response = await this.axiosInstance.post('/auth/refresh');
    if (response.data.data.accessToken) {
      Cookies.set('accessToken', response.data.data.accessToken, {
        secure: import.meta.env.PROD,
        sameSite: 'Lax',
      });
    }
    return response.data;
  }

  async logout() {
    try {
      await this.axiosInstance.post('/auth/logout');
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  }

  async getCurrentAdmin() {
    const response = await this.axiosInstance.get('/auth/me');
    return response.data;
  }

  // ============ Clients ============
  async getClients(config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.get('/clients', config);
    return response.data;
  }

  async getClientById(id: string) {
    const response = await this.axiosInstance.get(`/clients/${id}`);
    return response.data;
  }

  async getClientWithTasks(id: string) {
    const response = await this.axiosInstance.get(`/clients/${id}/tasks`);
    return response.data;
  }

  async getClientStats(id: string) {
    const response = await this.axiosInstance.get(`/clients/${id}/stats`);
    return response.data;
  }

  async createClient(data: any) {
    const response = await this.axiosInstance.post('/clients', data);
    return response.data;
  }

  async updateClient(id: string, data: any) {
    const response = await this.axiosInstance.patch(`/clients/${id}`, data);
    return response.data;
  }

  async deleteClient(id: string) {
    const response = await this.axiosInstance.delete(`/clients/${id}`);
    return response.data;
  }

  // ============ Tasks ============
  async getTasks(config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.get('/tasks', config);
    return response.data;
  }

  async getTaskById(id: string) {
    const response = await this.axiosInstance.get(`/tasks/${id}`);
    return response.data;
  }

  async createTask(data: any) {
    const response = await this.axiosInstance.post('/tasks', data);
    return response.data;
  }

  async updateTask(id: string, data: any) {
    const response = await this.axiosInstance.patch(`/tasks/${id}`, data);
    return response.data;
  }

  async updateTaskStatus(id: string, status: string) {
    const response = await this.axiosInstance.patch(`/tasks/${id}/status`, { status });
    return response.data;
  }

  async deleteTask(id: string) {
    const response = await this.axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  }

  // ============ Dashboard ============
  async getDashboardStats() {
    const response = await this.axiosInstance.get('/dashboard');
    return response.data;
  }
}

export const apiService = new ApiService();
