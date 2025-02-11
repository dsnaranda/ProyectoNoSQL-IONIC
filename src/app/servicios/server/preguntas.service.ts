import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreguntasService {
  //private apiUrl = 'http://localhost:3001/preguntas';
  private apiUrl = 'https://backend-encuestas.vercel.app/preguntas';

  constructor(private http: HttpClient) { }

  obtenerPreguntaDetalles(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/obtenerPreguntaDetalles/${id}`);
  }
}
