export class Usuario {
    constructor(public cedula: string = "",
        public IDUsuario: string,
        public exp: number,
        public nombreDeUsuario: string,
        public password?: string) {

    }

}