import { httpJson, setAccessToken, setRefreshToken } from './http';

export async function login(correo: string, password: string) {
  const data = await httpJson<{ accessToken: string; refreshToken: string }>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ correo, password }),
  });
  setAccessToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  return data;
}
export function logout() {
  setAccessToken(null);
  setRefreshToken(null);
}

export async function register(payload: {
  numDocumento: number;
  nombreUno: string;
  nombreDos?: string;
  apellidoUno: string;
  apellidoDos?: string;
  telefono: string;
  direccion: string;
  tipoDocumento: string;
  correo: string;
  password: string;
  idRol: number;
}) {
  // Tu endpoint ya llama PersonaService + AuthService
  return httpJson(`/auth/register`, { method: 'POST', body: JSON.stringify(payload) });
}