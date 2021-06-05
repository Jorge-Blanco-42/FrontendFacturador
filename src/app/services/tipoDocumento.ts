import { Injectable } from '@angular/core';
import { TipoDocumento } from '../models/tipoDocumento';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'
import { environment } from 'src/environments/environment';

@Injectable()
export class ServicioTipoDocumento {
    public url: string;
    public backend: string;

    constructor(
        public _http: HttpClient
    ) {
        this.url = Global.url;
        this.backend = environment.backendUrl;
    }

    getTipoDocumento(IDTipoDocumento: string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.backend + 'getTiposDoc/' + IDTipoDocumento, {headers: headers});
    }
}
