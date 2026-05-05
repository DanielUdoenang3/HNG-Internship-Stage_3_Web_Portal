// User Types
export interface User {
  id: string;
  github_id: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  role: 'admin' | 'analyst';
  is_active: boolean;
  last_login_at: string;
  created_at: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  user?: User;
  message?: string;
}

// Profile Types
export interface Profile {
  id: string;
  name: string;
  gender: string | null;
  gender_probability: number | null;
  age: number | null;
  age_group: string | null;
  country_id: string | null;
  country_name: string | null;
  country_probability: number | null;
  created_at: string;
}

export interface ProfileFilters {
  gender?: string;
  country?: string;
  age_group?: string;
  min_age?: number;
  max_age?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  status: 'success' | 'error';
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  links: {
    self: string;
    next: string | null;
    prev: string | null;
  };
  data: T[];
  message?: string;
}

export interface ProfileCreateRequest {
  name: string;
}

// Dashboard Types
export interface DashboardMetrics {
  status: 'success' | 'error';
  data: {
    total_profiles: number;
    new_profiles_today: number;
    total_users: number;
    active_sessions: number;
    profiles_by_country: Array<{ country: string; count: number }>;
    profiles_by_age_group: Array<{ age_group: string; count: number }>;
    recent_profiles: Profile[];
  };
  message?: string;
}

// Error Types
export interface ApiError {
  status: 'error';
  message: string;
  code?: string;
}

// Search Types
export interface SearchRequest {
  query: string;
  page?: number;
  limit?: number;
}

export interface SearchResult extends PaginatedResponse<Profile> {
  query: string;
}
