export interface Pregunta {
    id?: string;
    enunciado: string;
    id_tipo_pregunta: string;
    tipoPregunta?: string;
    id_encuesta: string;
    obligatorio?: boolean;
    esTextoLargo?: boolean;
    configuracion: {
        opciones?: string[];
        filas?: string[];
        columnas?: string[];
    };
}
