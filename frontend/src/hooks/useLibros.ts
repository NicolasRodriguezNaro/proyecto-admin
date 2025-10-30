import { useQuery } from '@tanstack/react-query';
import { httpJson } from '@/api/http';
import type { LibroDto } from '@/types/libros';

export function useLibros() {
  const url = `/api/libros`; // No hay filtros
  return useQuery({
    queryKey: ['libros'],
    queryFn: () => httpJson<LibroDto[]>(url),
  });
}

export function useLibro(id: number) {
  return useQuery({ queryKey: ['libro', id], queryFn: () => httpJson<LibroDto>(`/api/libros/${id}`) });
}
