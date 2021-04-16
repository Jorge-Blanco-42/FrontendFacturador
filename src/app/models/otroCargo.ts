export class OtroCargo{

    constructor(
        public tipoDocumento: string,
        public detalle: string,
        public monto: number,
        public porcentaje: boolean,
        public tipoIdentificacion: string,
        public identificacion: string,
        public nombre: string,
        public total: number
        ){
    }
}