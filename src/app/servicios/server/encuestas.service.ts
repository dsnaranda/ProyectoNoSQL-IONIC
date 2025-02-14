import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardHomeService {
  private apiUrl = 'https://backend-encuestas.vercel.app/encuestas'; 
  //private apiUrl = 'http://localhost:3001/encuestas';

  constructor(private http: HttpClient) {}

  obtenerEncuestasPorUsuario(id_usuario: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/encuestasUsuario/${id_usuario}`);
  }

  obtenerEncuestasPorID(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/encuesta/${id}`);
  }
  
  cambiarEstadoID(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cambiarEstado/${id}`, {});
  }
  
  // Método para obtener las encuestas por área
  obtenerEncuestasPorArea(area: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/devolverArea/${area}`);
  }
}