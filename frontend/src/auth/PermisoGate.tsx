import { useQuery } from '@tanstack/react-query';
import { getPerfil } from '@/hooks/usePerfil';

export default function PermisoGate({ permiso, children }:{ permiso: string; children: React.ReactNode }) {
  const { data } = useQuery({ queryKey: ['me'], queryFn: getPerfil });
  if (!data?.permisos?.includes(permiso)) return null;
  return <>{children}</>;
}
