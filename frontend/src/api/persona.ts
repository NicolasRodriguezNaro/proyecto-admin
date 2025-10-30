import { httpJson } from '@/api/http';

export type PersonaUpdate = Partial<{
  nombreUno: string;
  nombreDos: string | null;
  apellidoUno: string;
  apellidoDos: string | null;
  telefono: string | null;
  direccion: string | null;
  tipoDocumento: string; // si permites cambiarlo
}>;

export async function getPersona(numDocumento: number) {
  return httpJson(`/api/persona/${numDocumento}`);
}

export async function patchPersona(numDocumento: number, data: PersonaUpdate) {
  return httpJson(`/api/persona/${numDocumento}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
