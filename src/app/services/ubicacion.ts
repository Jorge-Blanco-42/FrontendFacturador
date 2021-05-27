import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ServicioUbicacion {

  private backendUrl: string;

  constructor(public _http: HttpClient) {
    this.backendUrl = environment.backendUrl;
   }


   getProvincias(): Observable<any>{
    return this._http.get(this.backendUrl + 'getProvincias');
   }

   getCantones(): Observable<any>{
    return this._http.get(this.backendUrl + 'getCantones');
   }

   getDistritos(): Observable<any>{
     return this._http.get(this.backendUrl + 'getDistritos');
   }
}
