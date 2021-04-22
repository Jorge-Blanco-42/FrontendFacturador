import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ServicioDecodificador {
    private backendUrl: string;

    constructor(
        public _http: HttpClient
    ) {
        this.backendUrl = environment.backendUrl;
    }

    decodificarXML(xmlEncoded: string): Observable<any> {
        let xml = new FormData();
        xml.append("xmlEncoded", xmlEncoded);
        return this._http.post(this.backendUrl + 'decodificarXML', xml);
    }
}