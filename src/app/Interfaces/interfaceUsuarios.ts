export interface UserProfile {
    id?: number;
    nombre: string;
    apellido: string;
    usuario: string;
    clave: string;
    correo: string;
    telefono: string;
    rol: string;
    foto?: string;
    validacion: boolean;
  }
  