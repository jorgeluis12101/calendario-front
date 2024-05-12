// Asegúrate de que este tipo esté en un lugar accesible para todos los componentes y servicios que lo usan.
export interface Evento {
    id?: number;
    titulo: string;
    fecha: string;  // Usar string para las fechas para compatibilidad con el backend
    descripcion?: string;
    usuarioId: number;  // Asegúrate de que este campo es requerido si tu backend lo necesita
    hora?: string;  
    tipoEvento?: string;
    completado?: boolean;
    nombreUsuario?: string;
  }
  