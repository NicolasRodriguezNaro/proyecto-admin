export type MultaDto = {
  num: number;
  idPrestamo: number;
  idTipoMulta: number;
  nombreTipo: string;
  montoTipo: number;
  fechaMulta: string; // ISO
  estado: string;     // 'pendiente' | 'pagada' | 'anulada'
  idUsuario: number;
  correoUsuario: string;
  idLibro: number;
  tituloLibro: string;
  isbnLibro: string;
};
