export type PrestamoDto = {
  id: number;
  idUsuario: number;
  idLibro: number;
  numeroEjemplar: number;
  idReserva?: number | null;
  fechaPrestamo: string;
  fechaDevolucionProgramada: string;
  fechaDevolucionReal?: string | null;
  estado: string; // 'activo' | 'retrasado' | 'devuelto' ...
  tituloLibro: string;
  isbnLibro: string;
  estadoEjemplarActual: string;
  correoUsuario: string;
};
