import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class ServicioConsultas{

    public aceptacionURL: string;
    public consultaURL: string;

    constructor(
        public _http: HttpClient
    ){
        this.aceptacionURL = Global.haciendaAceptacionURL;
        this.consultaURL = Global.haciendaConsultasURL;
    }

    consultarAceptacion(clave:string, token:string) : Observable<any>{
        let headers = new HttpHeaders().set('Authorization', 'Bearer '+ token);
        return this._http.get(this.aceptacionURL+"clave="+clave, {headers:headers});
    }


}