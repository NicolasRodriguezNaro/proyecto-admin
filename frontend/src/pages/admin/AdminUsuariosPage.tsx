import { useMemo, useState } from 'react';
import { useUsuariosAdmin, useCambiarEstadoUsuario, useCambiarContrasenaUsuario } from '@/hooks/useUsuariosAdmin';
import type { UsuarioAdminDto, EstadoUsuario } from '@/types/usuarios';

const TABS: Array<{key: EstadoUsuario|'all'; label: string}> = [
  { key: 'all', label: 'Todos' },
  { key: 'activo', label: 'Activos' },
  { key: 'inactivo', label: 'Inactivos' },
  { key: 'suspendido', label: 'Suspendidos' },
];

export default function AdminUsuariosPage() {
  const [tab, setTab] = useState<EstadoUsuario|'all'>('all');
  const [q, setQ] = useState('');
  const { data, isLoading, isError, refetch } = useUsuariosAdmin(tab, q);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Administrar usuarios</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.key}
            className={`px-3 py-1 rounded border ${tab===t.key?'bg-black text-white':'bg-white'}`}
            onClick={()=>setTab(t.key)}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <input
            placeholder="Buscar por correo…"
            value={q}
            onChange={e=>setQ(e.target.value)}
            className="border rounded px-3 py-1"
          />
          <button className="px-3 py-1 border rounded" onClick={()=>refetch()}>Buscar</button>
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded overflow-x-auto">
        {isLoading && <div className="p-4">Cargando…</div>}
        {isError && <div className="p-4 text-red-600">Error al cargar usuarios</div>}
        {!isLoading && !isError && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Correo</th>
                <th className="text-left p-2">Rol</th>
                <th className="text-left p-2">Estado</th>
                <th className="text-left p-2">Verificado</th>
                <th className="text-left p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(u => <UsuarioRow key={u.idUsuario} u={u} />)}
              {data?.length===0 && (
                <tr><td className="p-3 italic text-gray-500" colSpan={6}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function UsuarioRow({ u }: { u: UsuarioAdminDto }) {
  const cambiarEstado = useCambiarEstadoUsuario();
  const cambiarPass = useCambiarContrasenaUsuario();

  const [openEstado, setOpenEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoUsuario>(u.estadoUsuario);
  const [openPass, setOpenPass] = useState(false);
  const [pass, setPass] = useState('');

  const opcionesEstado = useMemo<EstadoUsuario[]>(() => ['activo','inactivo','suspendido'], []);

  return (
    <tr className="border-t">
      <td className="p-2">{u.idUsuario}</td>
      <td className="p-2">{u.correo}</td>
      <td className="p-2">{u.nombreRol}</td>
      <td className="p-2"><EstadoBadge estado={u.estadoUsuario}/></td>
      <td className="p-2">{u.correoVerificado ? 'Sí' : 'No'}</td>
      <td className="p-2">
        <div className="flex gap-2">
          <button className="px-2 py-1 border rounded" onClick={()=>{ setNuevoEstado(u.estadoUsuario); setOpenEstado(true); }}>
            Cambiar estado
          </button>
          <button className="px-2 py-1 border rounded" onClick={()=>{ setPass(''); setOpenPass(true); }}>
            Restablecer contraseña
          </button>
        </div>

        {/* Modal cambiar estado */}
        {openEstado && (
          <Modal onClose={()=>setOpenEstado(false)} title={`Cambiar estado (#${u.idUsuario})`}>
            <div className="space-y-3">
              <select className="border rounded px-3 py-2"
                value={nuevoEstado} onChange={e=>setNuevoEstado(e.target.value as EstadoUsuario)}>
                {opcionesEstado.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <div className="flex justify-end gap-2">
                <button className="px-3 py-1 border rounded" onClick={()=>setOpenEstado(false)}>Cancelar</button>
                <button
                  className="px-3 py-1 bg-black text-white rounded disabled:opacity-50"
                  disabled={cambiarEstado.isPending}
                  onClick={async()=>{
                    try{
                      await cambiarEstado.mutateAsync({ id: u.idUsuario, estado: nuevoEstado });
                      setOpenEstado(false);
                    }catch(e:any){ alert(e.message ?? 'Error'); }
                  }}>
                  Guardar
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal reset pass */}
        {openPass && (
          <Modal onClose={()=>setOpenPass(false)} title={`Restablecer contraseña (#${u.idUsuario})`}>
            <div className="space-y-3">
              <input
                type="password"
                className="border rounded px-3 py-2 w-full"
                placeholder="Nueva contraseña"
                value={pass}
                onChange={e=>setPass(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button className="px-3 py-1 border rounded" onClick={()=>setOpenPass(false)}>Cancelar</button>
                <button
                  className="px-3 py-1 bg-black text-white rounded disabled:opacity-50"
                  disabled={!pass || cambiarPass.isPending}
                  onClick={async()=>{
                    try{
                      await cambiarPass.mutateAsync({ id: u.idUsuario, nuevaContrasena: pass });
                      setOpenPass(false);
                    }catch(e:any){ alert(e.message ?? 'Error'); }
                  }}>
                  Guardar
                </button>
              </div>
            </div>
          </Modal>
        )}

      </td>
    </tr>
  );
}

function EstadoBadge({ estado }: { estado: EstadoUsuario }) {
  const cls = estado === 'activo'
    ? 'bg-green-100 text-green-800'
    : estado === 'inactivo'
    ? 'bg-gray-200 text-gray-800'
    : 'bg-yellow-100 text-yellow-800';
  return <span className={`px-2 py-0.5 text-xs rounded ${cls}`}>{estado}</span>;
}

function Modal({ title, children, onClose }:{
  title: string; children: React.ReactNode; onClose: ()=>void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}/>
      <div className="relative bg-white rounded-xl shadow p-4 w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
