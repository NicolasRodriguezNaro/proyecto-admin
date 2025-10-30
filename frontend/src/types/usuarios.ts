export type EstadoUsuario = 'activo' | 'inactivo' | 'suspendido';

export interface UsuarioAdminDto {
  idUsuario: number;
  correo: string;
  estadoUsuario: EstadoUsuario;
  idRol: number;
  nombreRol: string;
  correoVerificado: boolean;
  tokenVersion: number;
  // (Opcional) info de persona si la agregaste en tu vista:
  numDocumento?: number;
  nombreUno?: string;
  nombreDos?: string;
  apellidoUno?: string;
  apellidoDos?: string;
}
