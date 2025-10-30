import { useLibros } from '@/hooks/useLibros';
import { Link } from 'react-router-dom';

export default function CatalogoPage(){
  const { data, isLoading } = useLibros();  // Sin parámetros de filtro

  return (
    <div>
      <h1 className="text-xl font-bold mb-3">Catálogo</h1>
      {isLoading ? 'Cargando…' : (
        <div className="grid md:grid-cols-3 gap-3">
          {data?.map(libro => (
            <Link to={`/libros/${libro.id}`} key={libro.id} className="border p-3 rounded hover:bg-gray-50">
              <div className="font-semibold">{libro.titulo}</div>
              <div className="text-sm text-gray-600">{libro.nombreCategoria}</div>
              <div className="text-xs mt-1">{libro.prestable ? 'Prestable' : 'Solo sala'}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
