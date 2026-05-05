import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';

// API base URL - uses proxy in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Version': '1',
  },
  withCredentials: true, // Important for HTTP-only cookies
});

// Request interceptor - can add CSRF token if needed
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add CSRF token from cookie if available
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf_token='))
      ?.split('=')[1];
    
    if (csrfToken && config.headers) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 - Unauthorized (redirect to login)
      if (status === 401) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Handle 403 - Forbidden
      if (status === 403) {
        console.error('Access denied:', data?.message || 'You do not have permission to perform this action');
      }

      // Handle 429 - Rate Limited
      if (status === 429) {
        console.error('Rate limited. Please try again later.');
      }

      // Handle 400 - Missing API version
      if (status === 400 && data?.message?.includes('API version')) {
        console.error('API version header required');
      }
    }

    return Promise.reject(error);
  }
);

// Export typed API client
export default api;

// Helper to extract error message
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
