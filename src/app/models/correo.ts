export class Correo{

    constructor(
        public to: string, 
        public subject: string,
        public text: string,
        public filename: string,
        public attachmentContent: string,
        public base: string,
        ){
    }
}