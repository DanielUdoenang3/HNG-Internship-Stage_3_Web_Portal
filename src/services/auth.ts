import api from './api';
import type { User, AuthResponse } from '../types';

const AUTH_BASE = '/auth';

export const authService = {
  // Redirect to GitHub OAuth
  loginWithGitHub: (): void => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    window.location.href = `${apiUrl}${AUTH_BASE}/github`;
  },

  // Check current auth status
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get<AuthResponse>(`${AUTH_BASE}/me`);
      return response.data.user || null;
    } catch {
      return null;
    }
  },

  // Refresh access token
  refreshToken: async (): Promise<boolean> => {
    try {
      await api.post(`${AUTH_BASE}/refresh`, {}, { withCredentials: true });
      return true;
    } catch {
      return false;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post(`${AUTH_BASE}/logout`, {}, { withCredentials: true });
  },
};
