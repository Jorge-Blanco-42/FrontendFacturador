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

    arreglosGenerales(xml: string, actividad:string): Observable<any> {
        let datos = new FormData();
        datos.append("xmlDecoded", xml);
        datos.append("CodigoActividad", actividad);
        return this._http.post(this.backendUrl + 'arreglosGeneralesXML', datos);
    }

    arreglarLineas(xml:string, lineas:string): Observable<any>{
        let datos = new FormData();
        datos.append("xmlDecoded", xml);
        datos.append("lineas", lineas);
        return this._http.post(this.backendUrl + 'arreglarLineasXML', datos);
    }

    addOtrosCargos(xml: string, cargos: string): Observable<any> {
        let datos = new FormData();
        datos.append("xmlDecoded", xml);
        datos.append("otrosCargos", cargos);
        console.log(cargos);
        return this._http.post(this.backendUrl + 'agregarCargosXML', datos);
    }

    crearNota(xml: string, tipoNota: string, data: object): Observable<any> {
        let datos =  new FormData();
        
        datos.append('data', JSON.stringify(data));
        datos.append('xmlDecoded', xml);
        datos.append('tipoNota', tipoNota);
        return this._http.post(this.backendUrl + 'crearNota', datos);
    }
}