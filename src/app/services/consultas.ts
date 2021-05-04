import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class ServicioConsultas{

    public url: string;
    public consultaURL: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
        this.consultaURL = Global.haciendaConsultasURL;
    }

    consultarAceptacion(clave:string, token:string) : Observable<any>{
        let datos = new FormData();
        datos.append("w","consultar");
        datos.append("r","consultarCom");
        datos.append("token",token);
        datos.append("clave",clave);
        datos.append("client_id","api-stag");
        return this._http.post(this.url,datos);
    }

    consultarFacturas(token:string): Observable<any>{
        console.log(token);
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer '+ token);
        headers = headers.append("Cache-Control","no-cache");
        headers = headers.append("Content-Type","application/x-www-form-urlencoded");
        headers = headers.append("Postman-Token","bf8dc171-5bb7-fa54-7416-56c5cda9bf5c");
        
        console.log(headers);
        return this._http.get(this.consultaURL,{headers:headers});
    }


}