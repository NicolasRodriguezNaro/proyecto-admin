import { createContext, useContext, useMemo, useState } from 'react';
import { setAccessToken } from '@/api/http';

type AuthCtx = {
  isAuth: boolean;
  setIsAuth: (v: boolean) => void;
};
const Ctx = createContext<AuthCtx>({ isAuth: false, setIsAuth: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access_token'));
  const value = useMemo(() => ({ isAuth, setIsAuth }), [isAuth]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuthCtx() { return useContext(Ctx); }

export function forceLogout() {
  setAccessToken(null);
  window.location.href = '/login';
}
