import { Injectable} from '@angular/core';
import { SendXML } from '../models/sendXML';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class SendXMLService{

    public url: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
    }


    sendFEXML(xml: SendXML) : Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        var params = 
            "w=" + xml.w + 
            "&r=" + xml.r + 
            "&token=" + xml.token +
            "&clave=" + xml.clave + 
            "&fecha=" + xml.fecha + 
            "&emi_tipoIdentificacion=" + xml.emi_tipoIdentificacion +
            "&emi_numeroIdentificacion=" + xml.emi_numeroIdentificacion +
            "&recp_tipoIdentificacion=" + xml.recp_tipoIdentificacion +
            "&recp_numeroIdentificacion=" + xml.recp_numeroIdentificacion +
            "&comprobanteXml=" + xml.comprobanteXml +
            "&client_id=" + xml.client_id;
        return this._http.post(this.url,params,{headers:headers});
    }



}