
export class CreateXML{

    constructor(public w: string, public r: string,
        public clave: string, public consecutivo: string, 
        public fecha_emision: string, public emisor_nombre: string,
        public emisor_tipo_indetif: string, public emisor_num_identif: string, 
        public nombre_comercial: string, public emisor_provincia: string,
        public emisor_canton: string, public emisor_distrito: string,
        public emisor_barrio: string, public emisor_otras_senas: string, 
        public emisor_cod_pais_tel: string, public emisor_tel: string, 
        public emisor_cod_pais_fax: string, public emisor_fax: string, 
        public emisor_email: string, public receptor_nombre: string,
        public receptor_tipo_identif: string, public receptor_num_identif: string,
        public receptor_provincia: string, public receptor_canton: string,
        public receptor_distrito: string, public receptor_barrio: string, 
        public receptor_cod_pais_tel: string, public receptor_tel: string,
        public receptor_cod_pais_fax: string, public receptor_fax: string, 
        public receptor_email: string, public condicion_venta: string, 
        public plazo_credito: string, public medio_pago: string, 
        public cod_moneda: string, public tipo_cambio: string,
        public total_serv_gravados: string, public total_serv_exentos: string, 
        public total_merc_gravada: string, public total_merc_exenta: string, 
        public total_gravados: string, public total_exentos: string,
        public total_ventas: string, public total_descuentos: string,
        public total_ventas_neta: string, public total_impuestos: string,
        public total_comprobante: string, public otros: string, 
        public otrosType: string, public detalles: string,
        public omitir_receptor: string
        ){

    }


}