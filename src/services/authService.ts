import { api } from './api';
import { AuthResponse, RegisterData, User } from '../types/user.types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(data: RegisterData): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};