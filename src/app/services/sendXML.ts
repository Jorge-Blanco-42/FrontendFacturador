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
        let form = new FormData();
        form.append('w', xml.w); 
        form.append('r', xml.r);
        form.append('token', xml.token);
        form.append('clave', xml.clave);
        form.append('fecha', xml.fecha);
        form.append('emi_tipoIdentificacion', xml.emi_tipoIdentificacion);
        form.append('emi_numeroIdentificacion', xml.emi_numeroIdentificacion);
        form.append('recp_tipoIdentificacion', xml.recp_tipoIdentificacion);
        form.append('recp_numeroIdentificacion', xml.recp_numeroIdentificacion);
        form.append('comprobanteXml', xml.comprobanteXml);
        form.append('client_id', xml.client_id);
        return this._http.post(this.url,form);
    }



}