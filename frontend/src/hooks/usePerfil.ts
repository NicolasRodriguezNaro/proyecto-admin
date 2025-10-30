import { useQuery, useMutation } from '@tanstack/react-query';
import { httpJson } from '@/api/http';
import type { Perfil } from '@/types/perfil';

export function usePerfil() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => httpJson<Perfil>('/me'),
  });
}

export function usePermisos() {
  return useQuery({
    queryKey: ['perms'],
    queryFn: () => httpJson<string[]>('/me/permisos'),
  });
}

export function useHasPerm(perm: string) {
  const { data } = usePermisos();
  return !!data?.includes(perm);
}


