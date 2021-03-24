import { Injectable} from '@angular/core';
import { CreateXML } from '../models/createXML';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class CreateXMLService{

    public url: string;

    constructor(
        public _http: HttpClient
    ){
        this.url = Global.url;
    }


    createXML(xmlData: CreateXML) : Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        var params = 'w='+xmlData.w + '&r=' + xmlData.r + '&clave=' + xmlData.clave 
        + '&consecutivo=' + xmlData.consecutivo + '&fecha_emision=' + xmlData.fecha_emision 
        + '&emisor_nombre=' + xmlData.emisor_nombre + '&emisor_tipo_indetif=' + xmlData.emisor_tipo_indetif
        + '&emisor_num_identif=' + xmlData.emisor_num_identif + '&nombre_comercial=' + xmlData.nombre_comercial
        + '&emisor_provincia=' + xmlData.emisor_provincia + '&emisor_canton=' + xmlData.emisor_canton
        + '&emisor_distrito=' + xmlData.emisor_distrito + '&emisor_barrio=' + xmlData.emisor_barrio 
        + '&emisor_otras_senas=' + xmlData.emisor_otras_senas + '&emisor_cod_pais_tel' + xmlData.emisor_cod_pais_tel
        + '&emisor_tel=' + xmlData.emisor_tel + '&emisor_cod_pais_fax=' + xmlData.emisor_cod_pais_fax
        + '&emisor_fax=' + xmlData.emisor_fax + '&emisor_email=' + xmlData.emisor_email 
        + '&receptor_nombre=' + xmlData.receptor_nombre + '&receptor_tipo_identif=' + xmlData.receptor_tipo_identif
        + '&receptor_num_identif=' + xmlData.receptor_num_identif + '&receptor_provincia=' + xmlData.receptor_provincia
        + '&receptor_canton=' + xmlData.receptor_canton + '&receptor_distrito=' + xmlData.receptor_distrito
        + '&receptor_barrio=' + xmlData.receptor_barrio + '&receptor_cod_pais_tel=' + xmlData.receptor_cod_pais_tel 
        + '&receptor_tel=' + xmlData.receptor_tel + '&receptor_cod_pais_fax=' + xmlData.receptor_cod_pais_fax
        + '&receptor_fax=' + xmlData.receptor_fax + '&receptor_email=' + xmlData.receptor_email
        + '&condicion_venta=' + xmlData.condicion_venta + '&plazo_credito=' + xmlData.plazo_credito
        + '&medio_pago=' + xmlData.medio_pago + '&cod_moneda=' + xmlData.cod_moneda
        + '&tipo_cambio=' + xmlData.tipo_cambio + '&total_serv_gravados=' + xmlData.total_serv_gravados
        + '&total_serv_exentos=' + xmlData.total_serv_exentos + '&total_merc_gravada=' + xmlData.total_merc_gravada
        + '&total_merc_exenta=' + xmlData.total_merc_exenta + '&total_gravados=' + xmlData.total_gravados
        + '&total_exentos=' + xmlData.total_exentos + '&total_ventas=' + xmlData.total_ventas 
        + '&total_descuentos=' + xmlData.total_descuentos + '&total_ventas_neta=' + xmlData.total_ventas_neta
        + '&total_impuestos=' + xmlData.total_impuestos + '&total_comprobante=' + xmlData.total_comprobante
        + '&otros=' + xmlData.otros + '&otrosType=' + xmlData.otrosType
        + '&detalles=' + xmlData.detalles + '&omitir_receptor' + xmlData.omitir_receptor
        console.log("DIr: ", params)
  
        return this._http.post(this.url,params,{headers:headers});
    }



}