import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpJson } from '@/api/http';
import type { PrestamoDto } from '@/types/prestamos';

export function usePrestamos() {
  return useQuery({ queryKey: ['prestamos'], queryFn: () => httpJson<PrestamoDto[]>('/api/prestamos') });
}

export function usePrestamo(id: number) {
  return useQuery({ queryKey: ['prestamos', id], queryFn: () => httpJson<PrestamoDto>(`/api/prestamos/${id}`) });
}

export function usePrestamosPorUsuario(idUsuario: number) {
  return useQuery({ queryKey: ['prestamos','usuario',idUsuario], queryFn: () => httpJson<PrestamoDto[]>(`/api/prestamos/usuario/${idUsuario}`) });
}

export function usePrestamosActivosPorUsuario(idUsuario: number) {
  return useQuery({ queryKey: ['prestamos','usuario',idUsuario,'activos'], queryFn: () => httpJson<PrestamoDto[]>(`/api/prestamos/usuario/${idUsuario}/activos`) });
}

export function usePrestamosRetrasadosPorUsuario(idUsuario: number) {
  return useQuery({ queryKey: ['prestamos','usuario',idUsuario,'retrasados'], queryFn: () => httpJson<PrestamoDto[]>(`/api/prestamos/usuario/${idUsuario}/retrasados`) });
}

export function usePrestamosPorLibro(idLibro: number) {
  return useQuery({ queryKey: ['prestamos','libro',idLibro], queryFn: () => httpJson<PrestamoDto[]>(`/api/prestamos/libro/${idLibro}`) });
}

// Activos en general (agregaste /api/prestamos/activos)
export function usePrestamosActivos() {
  return useQuery({ queryKey: ['prestamos','activos'], queryFn: () => httpJson<PrestamoDto[]>(`/api/prestamos/activos`) });
}

export function useCrearPrestamo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      idUsuario: number; idLibro: number; numeroEjemplar: number;
      fechaPrestamo: string; fechaDevolucionProgramada: string; idReserva?: number | null;
    }) => httpJson(`/api/prestamos`, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['prestamos'] }); qc.invalidateQueries({ queryKey: ['prestamos','activos'] }); }
  });
}

export function useActualizarEstadoPrestamo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; estado: string; fechaDevolucionReal?: string | null }) =>
      httpJson(`/api/prestamos/${payload.id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado: payload.estado, fechaDevolucionReal: payload.fechaDevolucionReal ?? null }) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['prestamos'] }); qc.invalidateQueries({ queryKey: ['prestamos','activos'] }); }
  });
}
