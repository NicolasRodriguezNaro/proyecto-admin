import { useEffect, useMemo, useState } from 'react';
import { http, httpJson } from '@/api/http';

type Libro = {
  id: number;
  isbn: string;
  titulo: string;
  descripcion: string;
  cantidadEjemplares: number;
  editorial: string;
  anioPublicacion: number;
  prestable: boolean;
  idCategoria: number;
  nombreCategoria: string;
};

export default function AdminLibrosPage(){
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const data = await httpJson<Libro[]>('/api/libros');
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  async function search() {
    if (!q.trim()) return loadAll();
    setLoading(true);
    try {
      const data = await httpJson<Libro[]>(`/api/libros/search?titulo=${encodeURIComponent(q.trim())}`);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ loadAll(); }, []);

  const total = useMemo(()=> items.length, [items]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Administrar libros</h1>

      <div className="flex gap-2">
        <input className="border rounded p-2 flex-1" placeholder="Buscar por título…" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="px-3 py-2 border rounded" onClick={search}>Buscar</button>
        <button className="px-3 py-2 border rounded" onClick={()=>{ setQ(''); loadAll(); }}>Limpiar</button>
      </div>

      {loading ? <div>Cargando…</div> : (
        <div className="border rounded">
          <div className="p-2 text-sm text-gray-600">Total: {total}</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-t">
                <th className="p-2">ID</th>
                <th className="p-2">Título</th>
                <th className="p-2">ISBN</th>
                <th className="p-2">Categoría</th>
                <th className="p-2">Ejemplares</th>
                <th className="p-2">Prestable</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(l=>(
                <tr key={l.id} className="border-t">
                  <td className="p-2">{l.id}</td>
                  <td className="p-2">{l.titulo}</td>
                  <td className="p-2">{l.isbn}</td>
                  <td className="p-2">{l.nombreCategoria}</td>
                  <td className="p-2">{l.cantidadEjemplares}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${l.prestable?'bg-green-100 border border-green-300':'bg-red-100 border border-red-300'}`}>
                      {l.prestable ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <a className="px-2 py-1 border rounded" href={`/libros/${l.id}`}>Abrir</a>
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={async()=>{
                          const res = await http(`/api/libros/${l.id}/prestable`, {
                            method:'PATCH',
                            headers:{ 'Content-Type':'application/json' },
                            body: JSON.stringify({ prestable: !l.prestable }),
                          });
                          if (res.ok) {
                            setItems(prev => prev.map(x => x.id===l.id ? { ...x, prestable: !x.prestable } : x));
                          } else {
                            const txt = await res.text();
                            alert(txt || 'No se pudo cambiar prestabilidad');
                          }
                        }}
                      >
                        {l.prestable ? 'Marcar NO prestable' : 'Marcar prestable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length===0 && (
                <tr><td className="p-4 text-center text-gray-600" colSpan={7}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
