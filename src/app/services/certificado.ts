import { Injectable } from '@angular/core';
import { Certificado } from '../models/certificado';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'
import { FormBuilder} from "@angular/forms";
import { environment } from '../../environments/environment';

@Injectable()
export class ServicioCertificado {
    public url: string;
    public backendUrl: string;

    constructor(
        public _http: HttpClient
    ) {
        this.backendUrl = environment.backendUrl;
        this.url = Global.url;
    }

    getCertificado(id: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.backendUrl + 'get-certificado/' + id, { headers: headers });
    }

    getToken(certificate: Certificado): Observable<any> {
        let form = new FormData();
        form.append("w","token");
        form.append("r","gettoken");
        form.append("grant_type","password");
        form.append("client_id","api-stag");
        form.append("username",certificate.usuario);
        form.append("password", certificate.password);
        return this._http.post(this.url,form);
    }

    refrescarToken(refresh : string): Observable<any>{
        let form = new FormData();
        form.append("w","token");
        form.append("r","refresh");
        form.append("grant_type","refresh_token");
        form.append("client_id","api-stag");
        form.append("refresh_token",refresh);
        return this._http.post(this.url,form);
    }

}