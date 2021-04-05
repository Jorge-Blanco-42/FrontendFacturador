export class EnvioXML{

    constructor(
        public w: string, 
        public r: string,
        public token: string,
        public clave: string,
        public fecha: string,
        public emi_tipoIdentificacion: string,
        public emi_numeroIdentificacion: string,
        public recp_tipoIdentificacion: string,
        public recp_numeroIdentificacion: string,
        public comprobanteXml: string,
        public client_id: string,
        ){
    }
}