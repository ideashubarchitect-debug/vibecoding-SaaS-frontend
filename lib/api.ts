const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type ApiOptions = Omit<RequestInit, 'body'> & { body?: object };

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vibeable_token');
}

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, ...init } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || res.statusText);
  return data as T;
}

export const auth = {
  register: (email: string, password: string, name?: string) =>
    api<{ token: string; user: User }>('/api/auth/register', { method: 'POST', body: { email, password, name } }),
  login: (email: string, password: string) =>
    api<{ token: string; user: User }>('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: () => api<{ user: User }>('/api/auth/me'),
  logout: () => api('/api/auth/logout', { method: 'POST' }),
};

export const projects = {
  list: () => api<{ projects: Project[] }>('/api/projects'),
  create: (name: string) => api<{ project: Project }>('/api/projects', { method: 'POST', body: { name } }),
  get: (id: number) => api<{ project: Project }>(`/api/projects/${id}`),
  update: (id: number, data: { name?: string; config?: object }) =>
    api<{ project: Project }>(`/api/projects/${id}`, { method: 'PATCH', body: data }),
  delete: (id: number) => api(`/api/projects/${id}`, { method: 'DELETE' }),
  chat: (id: number, message: string) =>
    api<{ reply: string; config?: object; tokens_used?: number }>(`/api/projects/${id}/chat`, { method: 'POST', body: { message } }),
  generate: (id: number, prompt: string) =>
    api<{ config: object; steps?: { title: string; status: string }[]; tokens_used?: number }>(`/api/projects/${id}/generate`, { method: 'POST', body: { prompt } }),
  edit: (id: number, instruction: string, elementId?: string) =>
    api<{ config: object; tokens_used?: number }>(`/api/projects/${id}/edit`, { method: 'POST', body: { instruction, element_id: elementId } }),
  publish: (id: number) => api<{ url: string; subdomain: string }>(`/api/projects/${id}/publish`, { method: 'POST' }),
};

export const plans = {
  list: () => api<{ plans: Plan[] }>('/api/plans'),
};

export const user = {
  credits: () => api<{ credits: number }>('/api/user/credits'),
  usage: () => api<{ usage: { date: string; tokens_used: number }[] }>('/api/user/usage'),
  show: () => api<{ user: User }>('/api/user'),
  update: (data: { name?: string; locale?: string }) =>
    api<{ user: User }>('/api/user', { method: 'PATCH', body: data }),
};

export const subscriptions = {
  list: () => api<{ subscription: Subscription | null }>('/api/subscriptions'),
  create: (planId: number) =>
    api<{ message: string; subscription: unknown }>('/api/subscriptions', { method: 'POST', body: { plan_id: planId } }),
  invoices: () => api<{ invoices: Invoice[] }>('/api/subscriptions/invoices'),
};

export const admin = {
  users: (page = 1, perPage = 20) =>
    api<{ users: AdminUser[]; total: number; page: number }>(`/api/admin/users?page=${page}&per_page=${perPage}`),
  plans: () => api<{ plans: Plan[] }>('/api/admin/plans'),
  updatePlan: (id: number, data: Partial<Plan>) =>
    api<{ plan: Plan }>(`/api/admin/plans/${id}`, { method: 'PATCH', body: data }),
  payments: () => api<{ payments: AdminPayment[] }>('/api/admin/payments'),
  usage: () => api<{ usage: AdminUsage[] }>('/api/admin/usage'),
  activity: () => api<{ logs: ActivityLog[] }>('/api/admin/activity'),
  credits: () => api<{ users: { id: number; email: string; credits: number }[] }>('/api/admin/credits'),
  adjustCredits: (userId: number, delta: number) =>
    api<{ user: { id: number; email: string; credits: number } }>('/api/admin/credits/adjust', {
      method: 'POST',
      body: { user_id: userId, delta },
    }),
  settings: () => api<{ settings: Record<string, string> }>('/api/admin/settings'),
  updateSettings: (data: Record<string, string>) =>
    api<{ message: string }>('/api/admin/settings', { method: 'PATCH', body: data }),
  aiConfig: () => api<{ config: Record<string, string> }>('/api/admin/ai-config'),
  updateAiConfig: (data: Record<string, string>) =>
    api<{ message: string }>('/api/admin/ai-config', { method: 'PATCH', body: data }),
};

export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
}

export interface Project {
  id: number;
  name: string;
  slug: string;
  subdomain: string;
  config?: object;
  published_at?: string;
  updated_at: string;
}

export interface Plan {
  id: number;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  credits_per_month: number;
  features?: string[] | string;
  active?: number;
  sort_order?: number;
}

export interface Subscription {
  id: number;
  plan_id: number;
  status: string;
  current_period_end: string;
  plan_name?: string;
  credits_per_month?: number;
}

export interface Invoice {
  id: number;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name?: string;
  role: string;
  credits: number;
  created_at: string;
}

export interface AdminPayment {
  id: number;
  user_id: number;
  email?: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  created_at: string;
}

export interface AdminUsage {
  date: string;
  tokens: number;
  users: number;
}

export interface ActivityLog {
  id: number;
  user_id?: number;
  action: string;
  entity_type?: string;
  entity_id?: number;
  meta?: string;
  created_at: string;
}
