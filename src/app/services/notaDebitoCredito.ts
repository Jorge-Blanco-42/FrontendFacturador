import { Injectable } from '@angular/core';
import { notaDebitoCredito } from '../models/notaDebitoCredito';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class ServicioNotaDebitoCredito{

    public url: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
    }

    crearNotaDebitoCredito(notaDevCred: notaDebitoCredito) : Observable<any>{
        let form = new FormData();
        form.append('w', notaDevCred.w); 
        form.append('r', notaDevCred.r);
        form.append('tipoCedula', notaDevCred.tipoCedula);
        form.append('cedula', notaDevCred.cedula);
        form.append('codigoPais', notaDevCred.codigoPais);
        form.append('consecutivo', notaDevCred.consecutivo);
        form.append('situacion', notaDevCred.situacion);   
        form.append('codigoSeguridad', notaDevCred.codigoSeguridad);
        form.append('tipoDocumento', notaDevCred.tipoDocumento);

        console.log(notaDevCred)
        return this._http.post(this.url,form);
    }


}