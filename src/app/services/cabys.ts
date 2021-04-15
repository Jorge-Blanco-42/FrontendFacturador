import { Injectable } from '@angular/core';
import { Certificado } from '../models/certificado';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'
import { FormBuilder} from "@angular/forms";

@Injectable()
export class ServicioCaByS {
    public backendUrl: string;

    constructor(
        public _http: HttpClient
    ) {
        this.backendUrl = Global.backendUrl;
    }

    getCaByS(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.backendUrl + 'getImpDesc', { headers: headers });
    }
}