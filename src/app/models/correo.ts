export class Correo{

    constructor(
        public to: string, 
        public subject: string,
        public text: string,
        public filename: string,
        public document: string,
        public message: string,
        public base: string,
        ){
    }
}