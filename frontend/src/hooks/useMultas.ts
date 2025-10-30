import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { httpJson } from '@/api/http';
import type { MultaDto } from '@/types/multas';

export function useMultas() {
  return useQuery({ queryKey: ['multas'], queryFn: () => httpJson<MultaDto[]>(`/api/multas`) });
}

export function useMultasPorPrestamo(idPrestamo: number) {
  return useQuery({ queryKey: ['multas','prestamo',idPrestamo], queryFn: () => httpJson<MultaDto[]>(`/api/multas/prestamo/${idPrestamo}`) });
}

export function useMultasPorUsuario(idUsuario: number) {
  return useQuery({ queryKey: ['multas','usuario',idUsuario], queryFn: () => httpJson<MultaDto[]>(`/api/multas/usuario/${idUsuario}`) });
}

export function useMultasPendientesPorUsuario(idUsuario: number) {
  return useQuery({ queryKey: ['multas','usuario',idUsuario,'pendientes'], queryFn: () => httpJson<MultaDto[]>(`/api/multas/usuario/${idUsuario}/pendientes`) });
}

export function useMultasPorLibro(idLibro: number) {
  return useQuery({ queryKey: ['multas','libro',idLibro], queryFn: () => httpJson<MultaDto[]>(`/api/multas/libro/${idLibro}`) });
}

export function usePagarMulta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { idPrestamo: number; num: number }) =>
      httpJson(`/api/multas/prestamo/${payload.idPrestamo}/num/${payload.num}/pagar`, { method: 'PATCH' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['multas'] })
  });
}

export function useAnularMulta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { idPrestamo: number; num: number }) =>
      httpJson(`/api/multas/prestamo/${payload.idPrestamo}/num/${payload.num}/anular`, { method: 'PATCH' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['multas'] })
  });
}
