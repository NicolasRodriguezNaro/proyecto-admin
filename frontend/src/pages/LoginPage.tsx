import { useState } from 'react';
import { login } from '@/api/auth';
import { useAuthCtx } from '@/auth/AuthProvider';

export default function LoginPage(){
  const { setIsAuth } = useAuthCtx();
  const [correo,setCorreo]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState<string|null>(null);
  return (
    <div className="max-w-sm mx-auto mt-24">
      <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>
      {err && <div className="text-red-600 mb-3">{err}</div>}
      <input className="border p-2 w-full mb-2" placeholder="Correo" value={correo}
             onChange={e=>setCorreo(e.target.value)}/>
      <input className="border p-2 w-full mb-4" type="password" placeholder="Contraseña" value={password}
             onChange={e=>setPassword(e.target.value)}/>
      <button className="px-4 py-2 bg-black text-white rounded"
              onClick={async ()=>{
                try { await login(correo,password); setIsAuth(true); location.href='/'; }
                catch(e:any){ setErr(e.message || 'Error de autenticación'); }
              }}>
        Entrar
      </button>
    </div>
  );
}
