import DataTable from '@/components/DataTable';
import { useCancelarReserva, useReservas, useReservasActivas } from '@/hooks/useReservas';
import { useCrearPrestamo } from '@/hooks/usePrestamos';
import { useEjemplaresDisponibles } from '@/hooks/useEjemplares'; // Nuevo hook para obtener ejemplares
import type { EjemplarDto } from '@/types/ejemplares'; // Asegúrate de importar el tipo
import { usePerfil } from '@/hooks/usePerfil'; // Obtener el ID del usuario logueado
import { useState } from 'react';

export default function AdminReservasPage() {
  const { data: todas } = useReservas();
  const { data: activas } = useReservasActivas();
  const cancelar = useCancelarReserva();
  const { data: me } = usePerfil(); // Obtener datos del usuario logueado
  const [showEjemplares, setShowEjemplares] = useState<number | null>(null); // Estado para mostrar ejemplares
  const [ejemplarSeleccionado, setEjemplarSeleccionado] = useState<number | null>(null); // Ejemplar seleccionado
  const [fechaPrestamo, setFechaPrestamo] = useState<string>(new Date().toISOString().split('T')[0]); // Fecha de préstamo
  const [fechaDevolucion, setFechaDevolucion] = useState<string>(''); // Fecha de devolución
  const [idReserva, setIdReserva] = useState<number | null>(null); // Estado para almacenar la idReserva
  const { data: ejemplaresDisponibles } = useEjemplaresDisponibles(showEjemplares || 0); // Obtener los ejemplares disponibles
  const { mutate: crearPrestamo } = useCrearPrestamo();

  // Función para manejar la creación del préstamo
  const handleCrearPrestamo = async () => {
    if (ejemplarSeleccionado === null) {
      alert('Por favor, selecciona un ejemplar.');
      return;
    }

    if (!fechaDevolucion) {
      alert('Por favor, selecciona una fecha de devolución.');
      return;
    }

    if (idReserva === null) {
      alert('No se ha asociado ninguna reserva.');
      return;
    }

    try {
      // Ejecutar la mutación para crear el préstamo
      await crearPrestamo({
        idUsuario: me?.idUsuario || 0, // Obtener el idUsuario
        idLibro: showEjemplares || 0, // Obtener idLibro
        numeroEjemplar: ejemplarSeleccionado,
        fechaPrestamo: new Date().toISOString().split('T')[0], // Fecha actual
        fechaDevolucionProgramada: fechaDevolucion,
        idReserva: idReserva, // Asociar la reserva
      });

      alert('Préstamo creado con éxito.');
      setShowEjemplares(null); // Cerrar los ejemplares una vez creado el préstamo
      setIdReserva(null); // Limpiar la idReserva
    } catch (error) {
      alert('Error al crear el préstamo.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabla de reservas activas */}
      <section>
        <h1 className="text-xl font-bold mb-2">Reservas activas</h1>
        <DataTable
          rows={activas || []}
          columns={[
            { header: 'ID', render: (r) => r.id },
            { header: 'Libro', render: (r) => `${r.tituloLibro} (${r.isbnLibro})` },
            { header: 'Usuario', render: (r) => r.correoUsuario },
            { header: 'Fecha', render: (r) => new Date(r.fechaReserva).toLocaleDateString() },
            { header: 'Estado', render: (r) => r.estado },
            {
              header: 'Acciones',
              render: (r) => (
                <div>
                  <button
                    className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                    onClick={() => cancelar.mutate(r.id)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-2 py-1 text-xs rounded bg-green-600 text-white ml-2"
                    onClick={() => {
                      setShowEjemplares(r.idLibro); // Mostrar ejemplares al presionar "Crear préstamo"
                      setIdReserva(r.id); // Guardar la idReserva seleccionada
                    }}
                  >
                    Crear préstamo
                  </button>
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* Ejemplares disponibles */}
      {showEjemplares && ejemplaresDisponibles && (
        <section className="border rounded p-4">
          <h2 className="font-semibold text-lg mb-2">Ejemplares disponibles</h2>
          <div className="space-y-2">
            {ejemplaresDisponibles.length === 0 && <div>No hay ejemplares disponibles.</div>}
            {ejemplaresDisponibles.map((ejemplar) => (
              <div key={ejemplar.numero} className="border rounded p-2">
                <div className="flex justify-between">
                  <span>Ejemplar {ejemplar.numero}</span>
                  <button
                    className="text-xs text-white bg-blue-600 rounded px-2 py-1"
                    onClick={() => setEjemplarSeleccionado(ejemplar.numero)} // Seleccionar ejemplar
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Fecha de devolución */}
          <div className="mt-4">
            <label className="block mb-2">Fecha de devolución:</label>
            <input
              type="date"
              value={fechaDevolucion}
              onChange={(e) => setFechaDevolucion(e.target.value)}
              className="border p-2 w-full"
            />
          </div>

          {/* Botón para crear el préstamo */}
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleCrearPrestamo} // Usar la nueva función para crear el préstamo
          >
            Crear préstamo
          </button>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-2">Todas las reservas</h2>
        <DataTable
          rows={todas || []}
          columns={[
            { header: 'ID', render: (r) => r.id },
            { header: 'Libro', render: (r) => r.tituloLibro },
            { header: 'Usuario', render: (r) => r.correoUsuario },
            { header: 'Estado', render: (r) => r.estado },
          ]}
        />
      </section>
    </div>
  );
}
