import { useQuery, useMutation } from '@tanstack/react-query';
import { httpJson } from '@/api/http';
import type { PersonaUpdate } from '@/api/persona';

export type Persona = {
  numDocumento: number;
  nombreUno: string;
  nombreDos?: string;
  apellidoUno: string;
  apellidoDos?: string;
  telefono?: string;
  direccion?: string;
  tipoDocumento: string; // texto del enum
};

export function usePersona(numDocumento?: number) {
  return useQuery({
    enabled: !!numDocumento,
    queryKey: ['persona', numDocumento],
    queryFn: () => httpJson<Persona>(`/api/persona/${numDocumento}`),
  });
}

export function useActualizarPersona(numDocumento: number) {
  return useMutation({
    mutationFn: (payload: PersonaUpdate) =>
      httpJson(`/api/persona/${numDocumento}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
  });
}
