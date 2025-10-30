import { useQuery } from '@tanstack/react-query';
import { httpJson } from '@/api/http';
import type { EjemplarDto } from '@/types/ejemplares'; // Asegúrate de importar el tipo adecuado

export function useEjemplaresDisponibles(idLibro: number) {
  return useQuery<EjemplarDto[]>({
    queryKey: ['ejemplares', idLibro],
    queryFn: () => httpJson(`/api/libros/${idLibro}/ejemplares/disponibles`),
  });
}