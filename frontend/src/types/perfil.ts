export type Perfil = {
  idUsuario: number;
  correo: string;
  estadoUsuario: 'activo' | 'inactivo' | 'suspendido';
  idRol: number;
  nombreRol: string;
  correoVerificado: boolean;
  tokenVersion: number;
  permisos: string[];
};
