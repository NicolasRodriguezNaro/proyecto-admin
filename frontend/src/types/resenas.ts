export type ResenaDoc = {
  id: string;         // ObjectId en string
  idLibro: number;
  usuarioId: number;
  comentario: string;
  calificacion: number;
  fecha: string;      // ISO
  respuestas: { usuarioId: number; comentario: string; fecha: string }[];
};
