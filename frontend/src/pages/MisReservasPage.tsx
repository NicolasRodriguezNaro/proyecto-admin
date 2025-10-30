import { useEffect, useState } from 'react';
import { http, httpJson } from '@/api/http';
import { usePerfil } from '@/hooks/usePerfil';

type Reserva = {
  id: number;
  idUsuario: number;
  idLibro: number;
  fechaReserva: string;
  estado: string; // 'activa' | 'pendiente' | 'cancelada' | etc.
  tituloLibro: string;
  isbnLibro: string;
};

export default function MisReservasPage(){
  const { data: me } = usePerfil();
  const [items, setItems] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!me?.idUsuario) return;
    setLoading(true);
    try {
      const data = await httpJson<Reserva[]>(`/api/reservas/usuario/${me.idUsuario}`);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); /* eslint-disable-next-line */}, [me?.idUsuario]);

  if (!me) return <div>Cargando…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Mis reservas</h1>
      {loading ? <div>Cargando…</div> : (
        <div className="space-y-2">
          {items.length === 0 && <div className="text-gray-600">Sin reservas.</div>}
          {items.map(r => (
            <div key={r.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.tituloLibro}</div>
                <div className="text-sm text-gray-600">ISBN: {r.isbnLibro}</div>
                <div className="text-sm">Fecha: {new Date(r.fechaReserva).toLocaleDateString()}</div>
                <div className="text-sm">Estado: <b>{r.estado}</b></div>
              </div>
              <div className="flex gap-2">
                <a className="px-3 py-1 border rounded" href={`/libros/${r.idLibro}`}>Ver libro</a>
                {(r.estado === 'activa' || r.estado === 'pendiente') && (
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={async ()=>{
                      const res = await http(`/api/reservas/${r.id}/cancelar`, { method:'PATCH' });
                      if (res.ok) load();
                      else alert('No se pudo cancelar');
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
