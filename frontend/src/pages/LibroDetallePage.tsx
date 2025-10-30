import { useParams } from 'react-router-dom';
import { useLibro } from '@/hooks/useLibros';
import { useMediaLibro } from '@/hooks/useMedia';
import { useResenasPorLibro, useCrearResena, useResponderResena, useEliminarResena } from '@/hooks/useResenas';
import { useAutoresPorLibro } from '@/hooks/useAutores';
import { useTemasPorLibro } from '@/hooks/useTemas';
import { useState } from 'react';
import { httpJson, http } from '@/api/http';
import { usePerfil } from '@/hooks/usePerfil';

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

function ResenasPanel({ idLibro }: { idLibro: number }) {
  const { data, refetch } = useResenasPorLibro(idLibro);
  const crear = useCrearResena(idLibro);
  const responder = useResponderResena(idLibro);
  const eliminar = useEliminarResena(idLibro);

  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);

  return (
    <div className="border rounded p-3 space-y-3">
      <div className="flex gap-2">
        <input className="border p-2 flex-1" placeholder="Tu reseña" value={comentario} onChange={e=>setComentario(e.target.value)}/>
        <select className="border p-2" value={calificacion} onChange={e=>setCalificacion(Number(e.target.value))}>
          {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
        </select>
        <button
          className="px-3 py-1 bg-black text-white rounded"
          onClick={async()=>{ if(!comentario.trim()) return; await crear.mutateAsync({ comentario, calificacion }); setComentario(''); refetch(); }} >
          Publicar
        </button>
      </div>

      <div className="space-y-3">
        {data?.map(r => (
          <div key={r.id} className="border rounded p-2">
            <div className="flex justify-between">
              <div className="font-medium">⭐ {r.calificacion} — {new Date(r.fecha).toLocaleString()}</div>
              <button className="text-red-600 text-sm" onClick={async()=>{ await eliminar.mutateAsync(r.id); refetch(); }}>
                Eliminar
              </button>
            </div>
            <p className="mt-1">{r.comentario}</p>

            <Responder idResena={r.id} onOk={refetch}/>
            <div className="mt-2 space-y-1">
              {r.respuestas?.map((x,i)=>( 
                <div key={i} className="text-sm text-gray-700">
                  ↳ <span className="font-medium">({new Date(x.fecha).toLocaleString()})</span> {x.comentario}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Responder({ idResena, onOk }:{ idResena:string; onOk:()=>void }) {
  const [txt,setTxt]=useState('');
  const responder = useResponderResena(0 as any); // hook ignora idLibro
  return (
    <div className="flex gap-2 mt-2">
      <input className="border p-1 flex-1" placeholder="Responder..." value={txt} onChange={e=>setTxt(e.target.value)}/>
      <button
        className="px-2 py-1 text-xs bg-gray-800 text-white rounded"
        onClick={async()=>{ if(!txt.trim()) return; await responder.mutateAsync({ idResena, comentario: txt }); setTxt(''); onOk(); }}>
        Responder
      </button>
    </div>
  );
}

function SubirPortada({
  idLibro,
  onDone,
}: {
  idLibro: number;
  onDone: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('tipoArchivo', 'imagen_portada');
    fd.append('descripcion', 'Portada del libro');

    try {
      setSubiendo(true);
      const res = await http(`/api/media/libro/${idLibro}/upload`, {
        method: 'POST',
        body: fd, // 👈 multipart/form-data (NO poner Content-Type manual)
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `HTTP ${res.status}`);
      }
      onDone(); // volver a cargar la media
    } catch (e: any) {
      alert(e?.message || 'No se pudo subir la portada');
    } finally {
      setSubiendo(false);
      setFile(null);
    }
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-sm"
      />
      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || subiendo}
        className="px-3 py-1 bg-black text-white rounded disabled:opacity-50"
      >
        {subiendo ? 'Subiendo…' : 'Subir portada'}
      </button>
    </div>
  );
}

export default function LibroDetallePage() {
  const { id } = useParams();
  const idLibro = Number(id);
  const { data: libro, isLoading } = useLibro(idLibro);
  const { data: autores } = useAutoresPorLibro(idLibro);
  const { data: temas } = useTemasPorLibro(idLibro);
  const { data: me } = usePerfil(); // ← para obtener idUsuario desde /me
  const { data: media, refetch: refetchMedia } = useMediaLibro(idLibro);

  const [reservando, setReservando] = useState(false);
  const [fechaReserva] = useState<string>(todayISO()); // YYYY-MM-DD seguro

  if (isLoading || !libro) return <div>Cargando…</div>;

  const portada = media?.find(m => m.tipoArchivo === 'imagen_portada');

  const reservarLibro = async () => {
    if (!me?.idUsuario) { alert('No se pudo identificar el usuario.'); return; }
    try {
      setReservando(true);
      await httpJson(`/api/reservas`, {
        method: 'POST',
        body: JSON.stringify({
          idUsuario: me.idUsuario,   // ← viene del perfil
          idLibro: idLibro,
          fecha: fechaReserva,       // ← "YYYY-MM-DD"
        }),
      });
      alert('¡Reserva creada!');
    } catch (e:any) {
      alert(e?.message || 'Error al realizar la reserva');
    } finally {
      setReservando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera con portada e info básica */}
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 items-start relative">
        <div>
          {portada ? (
            <img src={`/api/media/${portada.id}/archivo`} alt="Portada" className="w-44 h-64 object-cover border rounded" />
          ) : (
            <div className="w-44 h-64 border rounded flex items-center justify-center italic text-gray-500">
              Sin portada
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{libro.titulo}</h1>
          <div className="text-sm text-gray-700">
            <div><span className="font-semibold">Categoría:</span> {libro.nombreCategoria}</div>
            <div><span className="font-semibold">ISBN:</span> {libro.isbn}</div>
            <div><span className="font-semibold">Año de publicación:</span> {libro.anioPublicacion}</div>
            <div><span className="font-semibold">Prestabilidad:</span> {libro.prestable ? 'Prestable' : 'Solo consulta en sala'}</div>
            <div><span className="font-semibold">Ejemplares registrados:</span> {libro.cantidadEjemplares}</div>
            {libro.editorial && <div><span className="font-semibold">Editorial:</span> {libro.editorial}</div>}

            {/* ⬇️ Botón para subir portada debajo de “Editorial” */}
            <SubirPortada
              idLibro={idLibro}
              onDone={() => {
                refetchMedia(); // vuelve a pedir la media y refresca la portada en pantalla
              }}
            />
          
          </div>
        </div>

        {/* Botón de reservar */}
        {libro.prestable && (
          <button
            className="absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            onClick={reservarLibro}
            disabled={reservando}
          >
            {reservando ? 'Reservando…' : 'Reservar libro'}
          </button>
        )}
      </div>

      {/* Descripción */}
      {libro.descripcion && (
        <section className="border rounded p-4">
          <h2 className="font-semibold text-lg mb-2">Descripción</h2>
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">{libro.descripcion}</p>
        </section>
      )}

      {/* Autores y Temas */}
      <section className="grid md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Autores</h3>
          {autores && autores.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {autores.map(a => <li key={a.id}>{a.nombres}</li>)}
            </ul>
          ) : <div className="text-sm text-gray-500">Sin autores asociados</div>}
        </div>

        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">Temas</h3>
          {temas && temas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {temas.map(t => (
                <span key={t.id} className="px-2 py-1 text-sm bg-gray-100 border rounded">
                  {t.nombre}
                </span>
              ))}
            </div>
          ) : <div className="text-sm text-gray-500">Sin temas asociados</div>}
        </div>
      </section>

      {/* Reseñas */}
      <section className="border rounded p-4">
        <h2 className="font-semibold text-lg mb-2">Reseñas</h2>
        <ResenasPanel idLibro={idLibro} />
      </section>
    </div>
  );
}
