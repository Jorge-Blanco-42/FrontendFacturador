export class Linea{

    constructor(
        public producto: string,
        public cantidad: number,
        public tipo: string,
        public precioUnitario: number,
        public descuento: number,
        public razon: string,
        public impuesto: string,
        public porcentaje: boolean,
        public base: number,
        public tarifa: number,
        public subtotal: string,
        public total: string
        ){
    }
}