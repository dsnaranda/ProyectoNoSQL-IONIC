import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {
  private apiUrl = 'https://backend-encuestas.vercel.app/respuestas';
  private apiUrlTipo = 'https://backend-encuestas.vercel.app/tipopregunta';

  //private apiUrl = 'http://localhost:3001/respuestas';

  constructor(private http: HttpClient) { }

  obtenerRespuestasPorEncuesta(id_ecuesta: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cantidadusuario/${id_ecuesta}`);
  }

  obtenerRespuestaPorIDPregunta(id_pregunta: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/obtenerPreguntaRespuesta/${id_pregunta}`);
  }

  guardarRespuestas(respuestas: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/guardar`, respuestas);
  }

  obtenerPromedio(id_encuesta: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tiempopromedio/${id_encuesta}`);
  }

  cargarOpciones(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/obtenerTiposPreguntas`);
  }

  identificarTipo(selectedId: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrlTipo}/${selectedId}`);
  }

}
