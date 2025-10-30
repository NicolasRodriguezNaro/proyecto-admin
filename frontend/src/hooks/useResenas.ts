import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http, httpJson } from '@/api/http';
import type { ResenaDoc } from '@/types/resenas';

export function useResenasPorLibro(idLibro: number) {
  return useQuery({ queryKey: ['resenas','libro',idLibro], queryFn: () => httpJson<ResenaDoc[]>(`/api/resenas/libro/${idLibro}`) });
}

export function useCrearResena(idLibro: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { comentario: string; calificacion: number }) =>
      httpJson(`/api/resenas/libro/${idLibro}`, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resenas','libro',idLibro] })
  });
}

export function useResponderResena(idLibro: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { idResena: string; comentario: string }) =>
      httpJson(`/api/resenas/${payload.idResena}/responder`, { method: 'POST', body: JSON.stringify({ comentario: payload.comentario }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resenas','libro',idLibro] })
  });
}

export function useEliminarResena(idLibro: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (idResena: string) => http(`/api/resenas/${idResena}`, { method: 'DELETE' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resenas','libro',idLibro] })
  });
}
