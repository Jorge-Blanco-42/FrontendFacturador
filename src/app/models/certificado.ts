export class Certificado{

    constructor(public IDCertificado: string, public archivoURL: string,
        public usuario: string, public password: string,
        public pin:string, public archivo?:File){
    }

}