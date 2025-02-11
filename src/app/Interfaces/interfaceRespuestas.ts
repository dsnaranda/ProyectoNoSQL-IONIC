export interface Respuestas {
    id_encuesta?: number,
    id_pregunta: string,
    fecha_respuesta: Date,
    id_usuario: string ,
    tipo: String,
    respuesta: { [key: string]: string },  
    tiempo_total: number,
    cantidadUsuarios?: number
}