import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Correo } from '../models/correo';

@Injectable()
export class ServicioCorreo {
    private backendUrl: string;

    constructor(
        public _http: HttpClient
    ) {
        this.backendUrl = environment.backendUrl;
    }

    enviarCorreo(correo: Correo): Observable<any> {
        let datos = new FormData();
        datos.append("to", correo.to);
        datos.append("text", correo.text);
        datos.append("subject", correo.subject);
        datos.append("filename", correo.filename);
        datos.append("document", correo.document);
        datos.append("message", correo.message);
        datos.append("base", correo.base);
        return this._http.post(this.backendUrl + 'sendEmail', datos);
    }

    enviarCorreoSimple(correo: Correo): Observable<any> {
        let datos = new FormData();
        datos.append("to", correo.to);
        datos.append("text", correo.text);
        datos.append("subject", correo.subject);
        return this._http.post(this.backendUrl + 'correoSimple', datos);
    }

}