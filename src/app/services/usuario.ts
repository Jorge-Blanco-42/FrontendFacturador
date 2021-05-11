import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'
import { environment } from 'src/environments/environment';

@Injectable()
export class ServicioUsuario {
    public url: string;
    public backend: string;

    constructor(
        public _http: HttpClient
    ) {
        this.url = Global.url;
        this.backend = environment.backendUrl;
    }

    iniciarSesion(user: Usuario): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        var params = "w=" + user.w + "&r=" + user.r + "&userName=" + user.userName + "&pwd=" + user.pwd;
        return this._http.post(this.url, params, { headers: headers });
    }

    getCertificado(id: string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'get-certificate/'+id,{headers:headers});
    }

    getDocumentos(id:string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.backend+'getDocumentos/'+id,{headers:headers});
    }

    convertirXML(xml: string): Observable<any> {
        var data = new FormData();
        data.append('xml', xml);
        return this._http.post(this.backend + 'getXMLData/', data);
    }
}