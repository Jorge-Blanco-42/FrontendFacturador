import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioActividadEconomica {

  private backendUrl: string;

  constructor(public _http: HttpClient) {
    this.backendUrl = environment.backendUrl;
   }

   getActividadEconomica(): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
     return this._http.get(this.backendUrl + 'getActividadEconomica', {headers: headers});
   }

   
}
