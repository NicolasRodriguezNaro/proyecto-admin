import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http, httpJson } from '@/api/http';
import type { ReservaDto } from '@/types/reservas';

export function useReservas() {
  return useQuery({ queryKey: ['reservas'], queryFn: () => httpJson<ReservaDto[]>('/api/reservas') });
}

export function useReserva(id: number) {
  return useQuery({ queryKey: ['reservas', id], queryFn: () => httpJson<ReservaDto>(`/api/reservas/${id}`) });
}

export function useReservasPorUsuario(idUsuario: number) {
  return useQuery({ queryKey: ['reservas','usuario',idUsuario], queryFn: () => httpJson<ReservaDto[]>(`/api/reservas/usuario/${idUsuario}`) });
}

export function useReservasActivasPorUsuario(idUsuario: number) {
  return useQuery({ queryKey: ['reservas','usuario',idUsuario,'activas'], queryFn: () => httpJson<ReservaDto[]>(`/api/reservas/usuario/${idUsuario}/activas`) });
}

export function useReservasPorLibro(idLibro: number) {
  return useQuery({ queryKey: ['reservas','libro',idLibro], queryFn: () => httpJson<ReservaDto[]>(`/api/reservas/libro/${idLibro}`) });
}

// Activas en general (agregaste /api/reservas/activas)
export function useReservasActivas() {
  return useQuery({ queryKey: ['reservas','activas'], queryFn: () => httpJson<ReservaDto[]>(`/api/reservas/activas`) });
}

export function useCrearReserva() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { idUsuario: number; idLibro: number; fecha: string }) =>
      httpJson(`/api/reservas`, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['reservas'] }); qc.invalidateQueries({ queryKey: ['reservas','activas'] }); }
  });
}

export function useCancelarReserva() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => httpJson(`/api/reservas/${id}/cancelar`, { method: 'PATCH' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['reservas'] }); qc.invalidateQueries({ queryKey: ['reservas','activas'] }); }
  });
}
