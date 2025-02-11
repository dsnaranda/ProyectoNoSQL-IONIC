export interface Encuesta {
    id: number;
    titulo: string;
    cantidadDeRespuestas: number;
    objetivo: string;
    duracion: String;
    fecha_creacion?: Date;
    preguntas: [];
    estado: string;
}