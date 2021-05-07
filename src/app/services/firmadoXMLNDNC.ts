import { Injectable } from '@angular/core';
import { firmadoXMLNDNC } from '../models/firmadoXMLNDNC';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'
import { formatCurrency } from '@angular/common';

@Injectable()
export class ServicioFirmadoXMLNDNC{

    public url: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
    }

    firmarXMLNDNC(signNDNC: firmadoXMLNDNC) : Observable<any>{
        let form = new FormData();
        form.append('w', signNDNC.w); 
        form.append('r', signNDNC.r);
        form.append('p12Url', signNDNC.p12Url);
        form.append('inXml', signNDNC.inXml);
        form.append('pinP12', signNDNC.pinP12);
        form.append('tipodoc', signNDNC.tipodoc)
        console.log(signNDNC)
        return this._http.post(this.url,form);
    }


}