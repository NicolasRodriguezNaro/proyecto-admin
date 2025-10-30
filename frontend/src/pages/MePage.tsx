import { usePerfil } from '@/hooks/usePerfil';

export default function MePage(){
  const { data, isLoading, error } = usePerfil();
  if (isLoading) return <div>Cargando…</div>;
  if (error) return <div>Error</div>;
  if (!data) return null;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Mi perfil</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-3 rounded">
          <h2 className="font-semibold mb-2">Cuenta</h2>
          <div>Correo: {data.correo}</div>
          <div>Estado: {data.estadoUsuario}</div>
          <div>Rol: {data.nombreRol}</div>
          <div>Verificado: {data.correoVerificado ? 'Sí' : 'No'}</div>
        </div>
        <div className="border p-3 rounded">
          <h2 className="font-semibold mb-2">Permisos</h2>
          <div className="flex gap-2 flex-wrap">
            {data.permisos?.map(p => <span key={p} className="px-2 py-1 text-xs bg-gray-200 rounded">{p}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
