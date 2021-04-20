import { Injectable } from '@angular/core';
import { CreacionXML } from '../models/creacionXML';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class ServicioCreacionXML {

    public url: string;

    constructor(
        public _http: HttpClient
    ) {
        this.url = Global.url;
    }


    crearXML(xmlData: CreacionXML): Observable<any> {
        let form = new FormData();
        form.append("w", xmlData.w);
        form.append("r", xmlData.r);
        form.append("clave", xmlData.clave);
        form.append("consecutivo", xmlData.consecutivo);
        form.append("fecha_emision", xmlData.fecha_emision);
        form.append("emisor_nombre", xmlData.emisor_nombre);
        form.append("emisor_tipo_indetif", xmlData.emisor_tipo_indetif);
        form.append("emisor_num_identif", xmlData.emisor_num_identif);
        form.append("nombre_comercial", xmlData.nombre_comercial);
        form.append("emisor_provincia", xmlData.emisor_provincia);
        form.append("emisor_canton", xmlData.emisor_canton);
        form.append("emisor_distrito", xmlData.emisor_distrito);
        form.append("emisor_barrio", xmlData.emisor_barrio);
        form.append("emisor_otras_senas", xmlData.emisor_otras_senas);
        form.append("emisor_cod_pais_tel", xmlData.emisor_cod_pais_tel);
        form.append("emisor_tel", xmlData.emisor_tel);
        form.append("emisor_cod_pais_fax", xmlData.emisor_cod_pais_fax);
        form.append("emisor_fax", xmlData.emisor_fax);
        form.append("emisor_email", xmlData.emisor_email);
        form.append("receptor_nombre", xmlData.receptor_nombre);
        form.append("receptor_tipo_identif", xmlData.receptor_tipo_identif);
        form.append("receptor_num_identif", xmlData.receptor_num_identif);
        form.append("receptor_provincia", xmlData.receptor_provincia);
        form.append("receptor_canton", xmlData.receptor_canton);
        form.append("receptor_distrito", xmlData.receptor_distrito);
        form.append("receptor_barrio", xmlData.receptor_barrio);
        form.append("receptor_cod_pais_tel", xmlData.receptor_cod_pais_tel);
        form.append("receptor_tel", xmlData.receptor_tel);
        form.append("receptor_cod_pais_fax", xmlData.receptor_cod_pais_fax);
        form.append("receptor_fax", xmlData.receptor_fax);
        form.append("receptor_email", xmlData.receptor_email);
        form.append("condicion_venta", xmlData.condicion_venta);
        form.append("plazo_credito", xmlData.plazo_credito);
        form.append("medio_pago", xmlData.medio_pago);
        form.append("cod_moneda", xmlData.cod_moneda);
        form.append("tipo_cambio", xmlData.tipo_cambio);
        form.append("total_serv_gravados", xmlData.total_serv_gravados);
        form.append("total_serv_exentos", xmlData.total_serv_exentos);
        form.append("total_merc_gravada", xmlData.total_merc_gravada);
        form.append("total_merc_exenta", xmlData.total_merc_exenta);
        form.append("total_gravados", xmlData.total_gravados);
        form.append("total_exentos", xmlData.total_exentos);
        form.append("total_ventas", xmlData.total_ventas);
        form.append("total_descuentos", xmlData.total_descuentos);
        form.append("total_ventas_neta", xmlData.total_ventas_neta);
        form.append("total_impuestos", xmlData.total_impuestos);
        form.append("total_comprobante", xmlData.total_comprobante);
        form.append("otros", xmlData.otros);
        form.append("otrosType", xmlData.otrosType);
        form.append("detalles", xmlData.detalles);
        form.append("omitir_receptor", xmlData.omitir_receptor);

        console.log("DIr: ", xmlData);

        return this._http.post(this.url, form);
    }



}