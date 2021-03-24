export class SendXML{

    constructor(
        public w: string, 
        public r: string,
        public token: string,
        public clave: string,
        public fecha: string,
        public emi_tipoIdentificacion: number,
        public emi_numeroIdentificacion: number,
        public recp_tipoIdentificacion: number,
        public recp_numeroIdentificacion: number,
        public comprobanteXml: string
        ){
    }
}