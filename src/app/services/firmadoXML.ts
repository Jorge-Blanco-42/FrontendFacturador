import { Injectable} from '@angular/core';
import { FirmadoXML } from '../models/firmadoXML';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class ServicioFirmadoXML{

    public url: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
    }


    firmarFEXML(sign: FirmadoXML) : Observable<any>{
        let form = new FormData();
        form.append("w", sign.w);
        form.append("r", sign.r);
        form.append("p12Url", sign.p12Url);
        form.append("inXml", sign.inXml);
        form.append("pinP12", sign.pinP12);
        form.append("tipodoc", sign.tipodoc);
        // console.log(sign);
        return this._http.post(this.url,form);
    }



}