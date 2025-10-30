export type ReservaDto = {
  id: number;
  idUsuario: number;
  idLibro: number;
  fechaReserva: string; // ISO
  estado: string;       // 'activa' | 'pendiente' | 'cancelada' ...
  tituloLibro: string;
  isbnLibro: string;
  correoUsuario: string;
};
