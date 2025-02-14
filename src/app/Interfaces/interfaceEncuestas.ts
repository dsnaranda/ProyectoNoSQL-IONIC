export interface Encuesta {
    id: number;
    titulo: string;
    cantidadDeRespuestas: number;
    objetivo: string;
    duracion: string;
    fecha_creacion?: Date;
    preguntas: [];
    estado: string;
    area: string; // Agregar la propiedad area
  }