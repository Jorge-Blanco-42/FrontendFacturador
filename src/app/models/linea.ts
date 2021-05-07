import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export class Linea{

    constructor(
        public producto: string,
        public codigo: string,
        public filtro: {descripcion: string, impuesto: string, codigoBienServicio:string}[],
        public cantidad: number,
        public tipo: string,
        public precioUnitario: number,
        public descuento: number,
        public razon: string,
        public impuesto: string,
        public porcentaje: boolean,
        public base: number,
        public tarifa: number,
        public subtotal: number,
        public total: number
        ){
    }
}