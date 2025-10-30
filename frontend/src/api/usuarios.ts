// src/api/usuarios.ts
import { httpJson } from '@/api/http';
import type { UsuarioAdminDto, EstadoUsuario } from '@/types/usuarios';

const BASE = '/usuarios';

export async function fetchUsuarios(
  estado?: EstadoUsuario | 'all',
  q?: string
): Promise<UsuarioAdminDto[]> {
  const params = new URLSearchParams();
  if (estado && estado !== 'all') params.set('estado', estado);
  if (q && q.trim()) params.set('q', q.trim());

  return httpJson<UsuarioAdminDto[]>(
    `${BASE}${params.toString() ? `?${params.toString()}` : ''}`
  );
}

export async function patchEstadoUsuario(id: number, estado: EstadoUsuario): Promise<void> {
  await httpJson(`${BASE}/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado }),
  });
}

export async function patchContrasenaUsuario(id: number, nuevaContrasena: string): Promise<void> {
  await httpJson(`${BASE}/${id}/contrasena`, {
    method: 'PATCH',
    body: JSON.stringify({ nuevaContrasena }),
  });
}
