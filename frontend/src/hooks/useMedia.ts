import { useQuery } from '@tanstack/react-query';
import { httpJson } from '@/api/http';

export type MediaDoc = {
  id: string; idLibro: number; tipoArchivo: string;
  nombreArchivo: string; contentType: string; fechaSubida: string;
  descripcion?: string; gridFsId: string; metadatos?: Record<string, any>;
};

export function useMediaLibro(idLibro: number) {
  return useQuery({
    queryKey: ['media', idLibro],
    queryFn: () => httpJson<MediaDoc[]>(`/api/media/libro/${idLibro}`)
  });
}
