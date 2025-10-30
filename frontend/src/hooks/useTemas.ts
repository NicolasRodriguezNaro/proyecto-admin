import { useQuery } from '@tanstack/react-query';
import { httpJson } from '@/api/http';

export type TemaLite = { id: number; nombre: string };

export function useTemasPorLibro(idLibro: number) {
  return useQuery({
    queryKey: ['temasLibro', idLibro],
    queryFn: () => httpJson<TemaLite[]>(`/api/temas/libro/${idLibro}`),
  });
}
