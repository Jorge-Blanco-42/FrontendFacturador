import { Injectable } from '@angular/core';
import { Certificate } from '../models/certificate';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class CertificateService {
    public url: string;

    constructor(
        public _http: HttpClient
    ) {
        this.url = Global.url;
    }

    getCertificate(idUsuario:string): Observable<any>{

    }

}