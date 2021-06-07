export class Persona{

    constructor( 
        public cedula: string = "", 
        public nombre: string = "",
        public email: string = "",
        public nombreComercial: string = "",
        public IDTipoIdentificacion: string = "",
        public IDDistrito: string = "",
        public barrio: string = "",
        public otrasSenas: string = "",
        public telefono: string = "",
        public fax: string = "",
        public ubicacion : any = []
        ){
    }
}