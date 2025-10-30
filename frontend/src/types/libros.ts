export type LibroDto = {
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
  temas?: { idTema: number; nombre: string }[];
  autores?: { idAutor: number; nombre: string }[];
};
