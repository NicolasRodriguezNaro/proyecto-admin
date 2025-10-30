import DataTable from '@/components/DataTable';
import { useMultas, useAnularMulta, usePagarMulta } from '@/hooks/useMultas';

export default function AdminMultasPage(){
  const { data } = useMultas();
  const pagar = usePagarMulta();
  const anular = useAnularMulta();

  return (
    <div>
      <h1 className="text-xl font-bold mb-3">Multas</h1>
      <DataTable
        rows={data || []}
        columns={[
          { header: 'Prestamo', render: r => r.idPrestamo },
          { header: 'Num', render: r => r.num },
          { header: 'Usuario', render: r => r.correoUsuario },
          { header: 'Libro', render: r => r.tituloLibro },
          { header: 'Monto', render: r => `$${r.montoTipo}` },
          { header: 'Estado', render: r => r.estado },
          { header: 'Acciones', render: r => (
            <div className="flex gap-2">
              <button className="px-2 py-1 text-xs rounded bg-emerald-600 text-white"
                disabled={r.estado!=='pendiente'}
                onClick={()=>pagar.mutate({ idPrestamo: r.idPrestamo, num: r.num })}
              >
                Pagar
              </button>
              <button className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                disabled={r.estado!=='pendiente'}
                onClick={()=>anular.mutate({ idPrestamo: r.idPrestamo, num: r.num })}
              >
                Anular
              </button>
            </div>
          )},
        ]}
      />
    </div>
  );
}
