// src/api/http.ts
const BASE_URL = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080';

let accessToken: string | null = localStorage.getItem('access_token');
let refreshToken: string | null = localStorage.getItem('refresh_token');

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) localStorage.setItem('access_token', token);
  else localStorage.removeItem('access_token');
}
export function setRefreshToken(token: string | null) {
  refreshToken = token;
  if (token) localStorage.setItem('refresh_token', token);
  else localStorage.removeItem('refresh_token');
}

async function refreshTokenFn(): Promise<boolean> {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),     // 👈 usamos el body
    });
    if (!res.ok) return false;
    const data = await res.json(); // { accessToken, refreshToken? }
    setAccessToken(data.accessToken);
    if (data.refreshToken) setRefreshToken(data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export async function http(input: string, init: RequestInit = {}) {
  const url = input.startsWith('http') ? input : `${BASE_URL}${input}`;
  const headers: Record<string,string> = { ...(init.headers as any) };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  let res = await fetch(url, { ...init, headers });
  if (res.status === 401) {
    const ok = await refreshTokenFn();
    if (ok) {
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
      res = await fetch(url, { ...init, headers });
    }
  }
  return res;
}

export async function httpJson<T>(input: string, init: RequestInit = {}) {
  const res = await http(input, {
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}
