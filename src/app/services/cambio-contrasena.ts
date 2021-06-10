import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class servicioCambioContrasena {
  private backendUrl: string;

  constructor(
    public _http: HttpClient
  ) {
    this.backendUrl = environment.backendUrl;
  }

  getToken(cedula: string): Observable<any>{
    let datos = new FormData();
    datos.append('cedula', cedula);
    return this._http.post(this.backendUrl + 'token-contrasena', datos);
  }

  verificarToken(token: string, cedula: string): Observable<any>{
    let datos = new FormData();
    datos.append('cedula', cedula);
    datos.append('token', token)
    return this._http.post(this.backendUrl + 'verificar-token', datos);
  }
  




}
