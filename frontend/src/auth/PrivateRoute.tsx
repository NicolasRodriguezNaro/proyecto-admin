import { Navigate } from 'react-router-dom';
import { useAuthCtx } from './AuthProvider';
import type { ReactNode, ReactElement } from 'react';

export default function PrivateRoute({ children }: { children: ReactNode }): ReactElement {
  const { isAuth } = useAuthCtx();
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
