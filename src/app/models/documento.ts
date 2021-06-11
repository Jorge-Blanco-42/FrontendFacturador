export class Documento{

    constructor(
        public clave: string, 
        public xml: string,
        public fecha: string,
        public receptor: string,
        public tipoDocumento: string,
        public IDUsuario: string,
        public estadoAceptacion: string,
        public xmlEstadoAceptacion: string
        ){
    }
}