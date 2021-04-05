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
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        var params = "w=" + sign.w + "&r=" + sign.r + "&p12Url=" + sign.p12Url + "&inXml=" 
            + sign.inXml + "&pinP12=" + sign.pinP12 + "&tipodoc=" + sign.tipodoc;
        return this._http.post(this.url,params,{headers:headers});
    }



}