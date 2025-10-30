import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsuarios, patchContrasenaUsuario, patchEstadoUsuario } from '@/api/usuarios';
import type { EstadoUsuario, UsuarioAdminDto } from '@/types/usuarios';

export function useUsuariosAdmin(estado: EstadoUsuario | 'all', q: string) {
  return useQuery({
    queryKey: ['usuarios-admin', estado, q],
    queryFn: () => fetchUsuarios(estado, q),
  });
}

export function useCambiarEstadoUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoUsuario }) => patchEstadoUsuario(id, estado),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['usuarios-admin'] });
    },
  });
}

export function useCambiarContrasenaUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nuevaContrasena }: { id: number; nuevaContrasena: string }) =>
      patchContrasenaUsuario(id, nuevaContrasena),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['usuarios-admin'] });
    },
  });
}
