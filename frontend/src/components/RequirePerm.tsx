import { ReactNode } from 'react';
import { useHasPerm } from '@/hooks/usePerfil';

export default function RequirePerm({ perm, children }: { perm: string; children: ReactNode }) {
  const ok = useHasPerm(perm);
  if (!ok) return null; // o renderiza deshabilitado si prefieres
  return <>{children}</>;
}
