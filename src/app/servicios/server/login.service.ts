import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
import { UserProfile } from '../../Interfaces/interfaceUsuarios';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //private encryptionKey = nacl.randomBytes(32); 
  //private encryptionKey = util.decodeBase64('RXN0b2VzdW5hcHJ1ZWJh');
  private encryptionKey = naclUtil.decodeBase64('0q8OVoCf+8FmlQkjMLg0xNJH+xdL10itLY2LhaFBPrw=');

  private apiUrl = 'https://backend-encuestas.vercel.app/usuarios';
  //private apiUrl = 'http://localhost:3001/usuarios';
  private apiUrlLocal = 'http://localhost:3001/usuarios';

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  saveUsuario(usuarioData: UserProfile): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.apiUrl}/save`, usuarioData, { headers });
  }

  updateUsuario(id: string, usuarioData: Partial<UserProfile>): Observable<any> {
    const Url = `${this.apiUrl}/${id}`;  // Concatenamos el id con la baseUrl
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.put<any>(Url, usuarioData, { headers }).pipe(
      tap((response) => {
        if (response && response.id) {
          console.log("Usuario actualizado en la API:", response);

          // Guardar la nueva información del usuario en la cookie
          this.updateUserCookie(response);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.warn('Error en la solicitud:', error.message);
        return throwError(() => new Error('Error al actualizar el usuario'));
      })
    );
  }

  updateUserCookie(updatedUser: any): void {
    const existingUser = this.getUser(); // Obtener usuario actual de la cookie

    // Si el nuevo usuario no tiene ID, conservar el ID actual
    if (!updatedUser.id && existingUser?.id) {
      updatedUser.id = existingUser.id;
    }

    // Eliminar la cookie vieja y guardar la nueva con los datos actualizados
    this.cookieService.delete('USER', '/');
    const encryptedUser = this.encryptData(JSON.stringify(updatedUser));
    this.cookieService.set('USER', encryptedUser, 1, '/');
  }


  Loggin(correo: string, password: string): Observable<any> {
    const Url = `${this.apiUrl}/login`;
    const body = { correo, password };
    // const key = nacl.randomBytes(32); 
    // const base64Key = naclUtil.encodeBase64(key);
    // console.log('Clave:', base64Key);

    return this.http.post(Url, body).pipe(
      tap((response: any) => {
        if (response && response.usuario) {
          // Cifrar los datos del usuario antes de guardarlos en la cookie
          const encryptedUser = this.encryptData(JSON.stringify(response.usuario));
          this.cookieService.set('USER', encryptedUser, 1, '/'); // Validez: 1 día
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.warn('Error en la solicitud:', error.message);
        return throwError(() => new Error('Error en la autenticación'));
      })
    );
  }

  cambiarClave(id: string, nuevaClave: string): Observable<any> {
    const Url = `${this.apiUrl}/cambiar/${id}`;  // Concatenamos el endpoint 'cambiar' con la baseUrl
    const body = { nuevaClave };

    return this.http.put(Url, body).pipe(
      tap((response: any) => {
        if (response && response.message === 'Contraseña actualizada correctamente') {
          // Almacenar más cosas si es necesario
          console.log('Contraseña cambiada correctamente.');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.warn('Error en la solicitud:', error.message);
        return throwError(() => new Error('Error al cambiar la contraseña'));
      })
    );
  }

  changePass(correo: string): Observable<any> {
    const Url = `${this.apiUrl}/obtener`;  // Concatenamos el endpoint 'obtener' con la baseUrl
    const body = { correo };

    return this.http.post(Url, body).pipe(
      tap((response: any) => {
        if (response && response.id && response.correo) {
          const encryptedChange = this.encryptData(JSON.stringify({ id: response.id, correo: response.correo }));
          this.cookieService.set('CHANGE', encryptedChange, 1, '/'); // Validez: 1 día
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404 && error.error.message) {
          // Aquí extraemos el mensaje del error enviado desde el backend
          console.warn('Usuario no encontrado:', error.error.message);
          return throwError(() => new Error(error.error.message));  // Reenvía el mensaje del backend
        } else {
          console.error('Error en la solicitud:', error.message);
          return throwError(() => new Error('Error en la autenticación'));
        }
      })
    );
  }

  autoCHANGE() {
    const encryptedUser = this.cookieService.get('CHANGE');
    //console.log('auth',this.encryptionKey);
    if (encryptedUser) {
      const decryptedUser = this.decryptData(encryptedUser);
      if (decryptedUser) {
        return JSON.parse(decryptedUser);
      }
    }
    return null;
  }

  getChange() {
    const userChange = this.autoCHANGE();
    return userChange
  }

  autoLogin() {
    const encryptedUser = this.cookieService.get('USER');
    //console.log('auth',this.encryptionKey);
    if (encryptedUser) {
      const decryptedUser = this.decryptData(encryptedUser);
      if (decryptedUser) {
        return JSON.parse(decryptedUser);
      }
    }
    return null;
  }

  logout(): void {
    this.cookieService.deleteAll('/');
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
    console.log("Sesión cerrada, datos eliminados.");
  }


  deleteCHANGE() {
    this.cookieService.delete('CHANGE', '/');
  }

  getUser() {
    const userData = this.autoLogin();
    return userData;
  }

  private encryptData(data: string): string {
    const encodedData = naclUtil.decodeUTF8(data);
    const nonce = nacl.randomBytes(24);
    const encrypted = nacl.secretbox(encodedData, nonce, this.encryptionKey);
    const encryptedData = new Uint8Array(nonce.length + encrypted.length);
    encryptedData.set(nonce);
    encryptedData.set(encrypted, nonce.length);
    return naclUtil.encodeBase64(encryptedData);
  }

  private decryptData(encryptedData: string): string | null {
    try {
      const encryptedBytes = naclUtil.decodeBase64(encryptedData);
      const nonce = encryptedBytes.slice(0, 24);
      const box = encryptedBytes.slice(24);
      const decrypted = nacl.secretbox.open(box, nonce, this.encryptionKey);
      if (!decrypted) throw new Error('No se pudo descifrar');
      return naclUtil.encodeUTF8(decrypted);
    } catch (e) {
      console.error('Error al descifrar los datos', e);
      return null;
    }
  }


  // Función para subir la imagen con el ID del usuario
  uploadImage(userId: string, file: File): Observable<any> {
    const apiUrl = `${this.apiUrlLocal}/imagenes/single/${userId}`; // Ahora incluye el ID del usuario
    const formData = new FormData();
    formData.append('imagen', file, file.name);

    return this.http.put<any>(apiUrl, formData);
  }

}