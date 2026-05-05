import api from './api';
import type { 
  Profile, 
  ProfileFilters, 
  PaginatedResponse, 
  ProfileCreateRequest,
  SearchRequest,
  SearchResult
} from '../types';

const PROFILES_BASE = '/api/profiles';

export const profileService = {
  // Get all profiles with filters and pagination
  getProfiles: async (filters: ProfileFilters = {}): Promise<PaginatedResponse<Profile>> => {
    const params = new URLSearchParams();
    
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.country) params.append('country', filters.country);
    if (filters.age_group) params.append('age_group', filters.age_group);
    if (filters.min_age !== undefined) params.append('min_age', String(filters.min_age));
    if (filters.max_age !== undefined) params.append('max_age', String(filters.max_age));
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.order) params.append('order', filters.order);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const queryString = params.toString();
    const url = queryString ? `${PROFILES_BASE}?${queryString}` : PROFILES_BASE;
    
    const response = await api.get<PaginatedResponse<Profile>>(url);
    return response.data;
  },

  // Get single profile by ID
  getProfile: async (id: string): Promise<Profile> => {
    const response = await api.get<{ status: string; data: Profile }>(`${PROFILES_BASE}/${id}`);
    return response.data.data;
  },

  // Create new profile (admin only)
  createProfile: async (data: ProfileCreateRequest): Promise<Profile> => {
    const response = await api.post<{ status: string; data: Profile }>(PROFILES_BASE, data);
    return response.data.data;
  },

  // Delete profile (admin only)
  deleteProfile: async (id: string): Promise<void> => {
    await api.delete(`${PROFILES_BASE}/${id}`);
  },

  // Search profiles using natural language
  searchProfiles: async (request: SearchRequest): Promise<SearchResult> => {
    const params = new URLSearchParams();
    params.append('q', request.query);
    if (request.page) params.append('page', String(request.page));
    if (request.limit) params.append('limit', String(request.limit));

    const response = await api.get<SearchResult>(`${PROFILES_BASE}/search?${params.toString()}`);
    return response.data;
  },

  // Export profiles as CSV
  exportProfiles: async (filters: ProfileFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append('format', 'csv');
    
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.country) params.append('country', filters.country);
    if (filters.age_group) params.append('age_group', filters.age_group);
    if (filters.min_age !== undefined) params.append('min_age', String(filters.min_age));
    if (filters.max_age !== undefined) params.append('max_age', String(filters.max_age));
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.order) params.append('order', filters.order);

    const response = await api.get(`${PROFILES_BASE}/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Download CSV file
  downloadCSV: (blob: Blob, filename?: string): void => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || `profiles_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
