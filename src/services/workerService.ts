import { api } from './api';
import { Worker } from '../types/worker.types';

export const workerService = {
  async getWorkers(params?: {
    status?: string;
    specialty?: string;
    sortBy?: string;
    order?: string;
  }): Promise<Worker[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.specialty) queryParams.append('specialty', params.specialty);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const response = await api.get(`/workers?${queryParams.toString()}`);
    return response.data.data.workers || [];
  },
};