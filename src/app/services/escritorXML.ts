import { Injectable } from '@angular/core';
import { Certificado } from '../models/certificado';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'
import { FormBuilder} from "@angular/forms";
import { environment } from '../../environments/environment';

@Injectable()
export class ServicioEscritorXML {
    public backendUrl: string;

    constructor(
        public _http: HttpClient
    ) {
        this.backendUrl = environment.backendUrl;
    }

    

    addOtrosCargos(xml: string, cargos: string): Observable<any> {
        let datos = new FormData();
        datos.append("xmlDecoded", xml);
        datos.append("otrosCargos", cargos);
        return this._http.post(this.backendUrl + 'agregarCargosXML', datos);
    }
}