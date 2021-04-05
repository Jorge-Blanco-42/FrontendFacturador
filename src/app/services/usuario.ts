import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class ServicioUsuario {
    public url: string;

    constructor(
        public _http: HttpClient
    ) {
        this.url = Global.url;
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
}