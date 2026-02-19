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
}
