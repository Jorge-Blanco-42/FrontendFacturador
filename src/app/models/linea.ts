export class Linea{

    constructor(
        public producto: string,
        public cantidad: string,
        public tipo: string,
        public precioUnitario: string,
        public descuento: string,
        public razon: string,
        public impuesto: string,
        public base: string,
        public tarifa: string,
        public subtotal: string,
        public total: string
        ){
    }
}