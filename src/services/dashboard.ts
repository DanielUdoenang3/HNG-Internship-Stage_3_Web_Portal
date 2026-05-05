import api from './api';
import type { DashboardMetrics } from '../types';

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await api.get<DashboardMetrics>('/api/dashboard/metrics');
    return response.data;
  },
};
