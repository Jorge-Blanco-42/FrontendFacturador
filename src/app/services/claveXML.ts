import { Injectable} from '@angular/core';
import { ClaveXML } from '../models/claveXML';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class ServicioClaveXML{

    public url: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
    }

    crearClaveXML(clave: ClaveXML) : Observable<any>{
        let form = new FormData();
        form.append('w', clave.w); 
        form.append('r', clave.r);
        form.append('tipoCedula', clave.tipoCedula);
        form.append('cedula', clave.cedula);
        form.append('situacion', clave.situacion);
        form.append('codigoPais', clave.codigoPais);
        form.append('consecutivo', clave.consecutivo);
        form.append('codigoSeguridad', clave.codigoSeguridad);
        form.append('tipoDocumento', clave.tipoDocumento);
        return this._http.post(this.url,form);
    }



}