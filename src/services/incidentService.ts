import { api } from './api';
import { Incident, CreateIncidentData, UpdateIncidentData } from '../types/incident.types';

export const incidentService = {
  async getIncidents(filters?: {
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
  }): Promise<Incident[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);

    const response = await api.get(`/incidents?${params.toString()}`);
    return response.data.data.incidents || [];
  },

  async getIncidentById(id: string): Promise<Incident> {
    const response = await api.get(`/incidents/${id}`);
    return response.data.data;
  },

  async createIncident(data: CreateIncidentData & { 
    images?: string[];  // ✅ Cambiar a plural y array
  }): Promise<Incident> {
    const payload: any = {
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      location: data.location,
      images: data.images || []  // ✅ Siempre enviar array
    };

    console.log('📤 Service enviando:', {
      ...payload,
      images: `[${payload.images.length} imagen(es)]`
    });

    const response = await api.post('/incidents', payload);
    return response.data.data;
  },

  async updateIncident(id: string, data: UpdateIncidentData): Promise<void> {
    await api.put(`/incidents/${id}`, data);
  },

  async assignWorker(incidentId: string, workerId: string): Promise<void> {
    await api.post(`/incidents/${incidentId}/assign`, { workerId });
  },
};