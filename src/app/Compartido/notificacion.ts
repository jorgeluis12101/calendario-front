export interface Notificacion {
    id?: number;
    usuarioId: number; // Este campo es necesario si deseas relacionar la notificación con el usuario
    mensaje: string;
    leido: boolean;
  }