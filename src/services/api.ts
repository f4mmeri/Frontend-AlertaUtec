import { API_BASE_URL } from '../utils/constants';

class ApiService {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la solicitud');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Incidents endpoints
  async listIncidents(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/incidents${query}`);
  }

  async getIncident(id: string) {
    return this.request(`/incidents/${id}`);
  }

  async createIncident(incident: any) {
    return this.request('/incidents', {
      method: 'POST',
      body: JSON.stringify(incident),
    });
  }

  async updateIncident(id: string, updates: any) {
    return this.request(`/incidents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async assignIncident(id: string, workerId: string) {
    return this.request(`/incidents/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ workerId }),
    });
  }

  // Workers endpoints
  async listWorkers(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/workers${query}`);
  }
}

export const api = new ApiService();