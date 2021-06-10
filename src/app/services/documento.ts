import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioDocumento {

  private backendUrl: string;

  constructor(public _http: HttpClient) { 
    this.backendUrl = environment.backendUrl;
  }

  getDocumentos(idUsuario: string): Observable<any>{
    return this._http.get(this.backendUrl + 'getDocumentos/'+ idUsuario);
  }

  
}
