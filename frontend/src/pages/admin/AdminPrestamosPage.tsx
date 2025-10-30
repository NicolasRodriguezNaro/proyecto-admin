import DataTable from '@/components/DataTable';
import { usePrestamos, usePrestamosActivos, useActualizarEstadoPrestamo } from '@/hooks/usePrestamos';

export default function AdminPrestamosPage(){
  const { data: activos } = usePrestamosActivos();
  const { data: todos } = usePrestamos();
  const actualizar = useActualizarEstadoPrestamo();

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-bold mb-2">Préstamos activos</h1>
        <DataTable
          rows={activos || []}
          columns={[
            { header: 'ID', render: r => r.id },
            { header: 'Libro', render: r => r.tituloLibro },
            { header: 'Usuario', render: r => r.correoUsuario },
            { header: 'F. límite', render: r => new Date(r.fechaDevolucionProgramada).toLocaleDateString() },
            { header: 'Estado', render: r => r.estado },
            { header: 'Acciones', render: r => (
              <div className="flex gap-2">
                <button className="px-2 py-1 text-xs bg-emerald-600 text-white rounded"
                  onClick={()=>actualizar.mutate({ id: r.id, estado: 'devuelto', fechaDevolucionReal: new Date().toISOString().slice(0,10) })}
                >
                  Marcar devuelto
                </button>
                <button className="px-2 py-1 text-xs bg-amber-600 text-white rounded"
                  onClick={()=>actualizar.mutate({ id: r.id, estado: 'retrasado', fechaDevolucionReal: new Date().toISOString().slice(0,10) })}
                >
                  Marcar retrasado
                </button>
                <button className="px-2 py-1 text-xs bg-amber-600 text-white rounded"
                  onClick={()=>actualizar.mutate({ id: r.id, estado: 'deterioro', fechaDevolucionReal: new Date().toISOString().slice(0,10) })}
                >
                  Marcar deterioro
                </button>
                <button className="px-2 py-1 text-xs bg-amber-600 text-white rounded"
                  onClick={()=>actualizar.mutate({ id: r.id, estado: 'perdido', fechaDevolucionReal: new Date().toISOString().slice(0,10) })}
                >
                  Marcar perdido
                </button>
              </div>
            )},
          ]}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Todos los préstamos</h2>
        <DataTable
          rows={todos || []}
          columns={[
            { header: 'ID', render: r => r.id },
            { header: 'Libro', render: r => r.tituloLibro },
            { header: 'Usuario', render: r => r.correoUsuario },
            { header: 'Estado', render: r => r.estado },
          ]}
        />
      </section>
    </div>
  );
}
