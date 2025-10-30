import { useEffect, useState } from 'react';
import { httpJson } from '@/api/http';
import { usePerfil } from '@/hooks/usePerfil';

type Prestamo = {
  id: number;
  idUsuario: number;
  idLibro: number;
  numeroEjemplar: number;
  idReserva?: number | null;
  fechaPrestamo: string;
  fechaDevolucionProgramada: string;
  fechaDevolucionReal?: string | null;
  estado: string; // 'activo' | 'retrasado' | 'cerrado' etc.
  tituloLibro: string;
  isbnLibro: string;
  estadoEjemplarActual: string;
};

export default function MisPrestamosPage(){
  const { data: me } = usePerfil();
  const [items, setItems] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!me?.idUsuario) return;
    setLoading(true);
    try {
      const data = await httpJson<Prestamo[]>(`/api/prestamos/usuario/${me.idUsuario}`);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); /* eslint-disable-next-line */}, [me?.idUsuario]);

  if (!me) return <div>Cargando…</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Mis préstamos</h1>
      {loading ? <div>Cargando…</div> : (
        <div className="space-y-2">
          {items.length === 0 && <div className="text-gray-600">Sin préstamos.</div>}
          {items.map(p => (
            <div key={p.id} className="border rounded p-3 grid md:grid-cols-3 gap-3">
              <div>
                <div className="font-semibold">{p.tituloLibro}</div>
                <div className="text-sm text-gray-600">ISBN: {p.isbnLibro}</div>
                <div className="text-sm">Ejemplar N° {p.numeroEjemplar}</div>
                <a className="text-sm underline" href={`/libros/${p.idLibro}`}>Ver libro</a>
              </div>
              <div className="text-sm">
                <div>Prestado: {new Date(p.fechaPrestamo).toLocaleDateString()}</div>
                <div>Devolver hasta: {new Date(p.fechaDevolucionProgramada).toLocaleDateString()}</div>
                <div>Devuelto: {p.fechaDevolucionReal ? new Date(p.fechaDevolucionReal).toLocaleDateString() : '—'}</div>
              </div>
              <div className="text-sm">
                <div>Estado préstamo: <b>{p.estado}</b></div>
                <div>Estado ejemplar: {p.estadoEjemplarActual}</div>
                {p.idReserva && <div>Reserva asociada: #{p.idReserva}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
