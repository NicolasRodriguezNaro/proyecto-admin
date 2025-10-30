import { useEffect, useMemo, useState } from 'react';
import { http, httpJson } from '@/api/http';
import { usePerfil } from '@/hooks/usePerfil';

type Multa = {
  num: number;
  idPrestamo: number;
  idTipoMulta: number;
  nombreTipo: string;
  montoTipo: number;
  fechaMulta: string;
  estado: string; // 'pendiente' | 'pagada' | 'anulada'
  idUsuario: number;
  correoUsuario: string;
  idLibro: number;
  tituloLibro: string;
  isbnLibro: string;
};

export default function MisMultasPage(){
  const { data: me } = usePerfil();
  const [items, setItems] = useState<Multa[]>([]);
  const [loading, setLoading] = useState(false);

  const pendientes = useMemo(()=> items.filter(m=>m.estado==='pendiente'), [items]);

  async function load() {
    if (!me?.idUsuario) return;
    setLoading(true);
    try {
      const data = await httpJson<Multa[]>(`/api/multas/usuario/${me.idUsuario}`);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); /* eslint-disable-next-line */}, [me?.idUsuario]);

  if (!me) return <div>Cargando…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Mis multas</h1>

      {loading ? <div>Cargando…</div> : (
        <>
          <section className="border rounded p-3">
            <h2 className="font-semibold mb-2">Pendientes</h2>
            {pendientes.length === 0 && <div className="text-gray-600">Sin multas pendientes.</div>}
            <div className="space-y-2">
              {pendientes.map(m=>(
                <div key={`${m.idPrestamo}-${m.num}`} className="border rounded p-2 flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-semibold">{m.tituloLibro}</div>
                    <div>{m.nombreTipo} — ${m.montoTipo} — {new Date(m.fechaMulta).toLocaleDateString()}</div>
                  </div>
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={async()=>{
                      const res = await http(`/api/multas/prestamo/${m.idPrestamo}/num/${m.num}/pagar`, { method:'PATCH' });
                      if (res.ok) load(); else alert('No se pudo pagar la multa');
                    }}
                  >
                    Pagar
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="border rounded p-3">
            <h2 className="font-semibold mb-2">Histórico</h2>
            <div className="space-y-2">
              {items.map(m=>(
                <div key={`hist-${m.idPrestamo}-${m.num}`} className="border rounded p-2 grid md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="font-semibold">{m.tituloLibro}</div>
                    <div>ISBN: {m.isbnLibro}</div>
                  </div>
                  <div>
                    <div>Tipo: {m.nombreTipo}</div>
                    <div>Monto: ${m.montoTipo}</div>
                    <div>Fecha: {new Date(m.fechaMulta).toLocaleDateString()}</div>
                  </div>
                  <div>
                    Estado: <b>{m.estado}</b>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
