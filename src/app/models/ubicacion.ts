export class Provincia{

    constructor(public codigo_provincia: number, 
        public nombre_provincia: string){

    }
}

export class Canton{

    constructor(public codigo_canton: number,
        public codigo_provincia: number,
        public nombre_canton: string){

        }
}

export class Distrito{
    
    constructor(codigo_distrito: number,
        public codigo_canton: number,
        public nombre_distrito: string){
            
        }
}