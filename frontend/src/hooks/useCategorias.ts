import { useQuery } from '@tanstack/react-query';
import { httpJson } from '@/api/http';
import type { CategoriaDto } from '@/types/categorias'; // Asegúrate de tener este tipo

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => httpJson<CategoriaDto[]>('/api/categorias'),
  });
}