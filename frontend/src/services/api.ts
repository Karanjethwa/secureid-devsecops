import { User, LoginActivity, SecurityAlert, AuditLog, SecurityAnalysis, AdminStats } from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    credentials: 'include', // sends HTTP-only secure cookie
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const authApi = {
  register: (payload: any) =>
    request<{ success: boolean; message: string; userId: number }>('/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { identifier: string; password: string }) =>
    request<{ success: boolean; message: string; user: User; token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<{ success: boolean; message: string }>('/logout', {
      method: 'POST',
    }),

  getSession: () =>
    request<{ success: boolean; user: User | null }>('/session'),
};

export const userApi = {
  getProfile: () =>
    request<{ success: boolean; user: User }>('/profile'),

  updateProfile: (payload: Partial<User>) =>
    request<{ success: boolean; message: string; user: User }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

export const activityApi = {
  getList: (params: { search?: string; status?: string; page?: number; limit?: number; all?: boolean } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.all) query.set('all', 'true');
    return request<{ success: boolean; activity: LoginActivity[]; pagination: any }>(`/activity?${query.toString()}`);
  },

  getById: (id: number) =>
    request<{ success: boolean; activity: LoginActivity }>(`/activity/${id}`),
};

export const securityApi = {
  getStats: () =>
    request<{ success: boolean; stats: any }>('/security/stats'),

  getAlerts: () =>
    request<{ success: boolean; alerts: SecurityAlert[] }>('/security/alerts'),

  simulateSuspicious: () =>
    request<{ success: boolean; message: string; alertId: number }>('/security/simulate-suspicious', {
      method: 'POST',
    }),

  getAnalysis: () =>
    request<{ success: boolean; analysis: SecurityAnalysis }>('/security-analysis'),
};

export const adminApi = {
  getStats: () =>
    request<{ success: boolean; stats: AdminStats }>('/admin/stats'),

  getUsers: (params: { search?: string; role?: string; status?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.role) query.set('role', params.role);
    if (params.status) query.set('status', params.status);
    return request<{ success: boolean; users: User[] }>(`/admin/users?${query.toString()}`);
  },

  updateUserStatus: (id: number, status: 'Active' | 'Suspended') =>
    request<{ success: boolean; message: string }>(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  deleteUser: (id: number) =>
    request<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  getAuditLogs: () =>
    request<{ success: boolean; logs: AuditLog[] }>('/admin/audit-logs'),
};
