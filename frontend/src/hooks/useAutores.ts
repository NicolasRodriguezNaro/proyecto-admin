import { useQuery } from '@tanstack/react-query';
import { httpJson } from '@/api/http';

export type AutorLite = { id: number; nombres: string };

export function useAutoresPorLibro(idLibro: number) {
  return useQuery({
    queryKey: ['autoresLibro', idLibro],
    queryFn: () => httpJson<AutorLite[]>(`/api/autores/libro/${idLibro}`),
  });
}
