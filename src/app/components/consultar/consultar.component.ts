import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const LINEAS : Linea[] = JSON.parse('[{"producto":"Aguacate nabal, fresco o refrigerado","codigo":"0131100020500","filtro":[{"impuesto":"1%","descripcion":"Aguacate nabal, fresco o refrigerado","codigoBienServicio":"0131100020500"}],"cantidad":7,"tipo":"Unid","precioUnitario":750,"descuento":1000,"razon":"","impuesto":"01-02","porcentaje":false,"base":0,"tarifa":1.01,"subtotal":5250,"total":4302.5},{"producto":"Chocolate con leche, en bloques, barras o tabletas (que contengan más del 50% del peso en bruto en cacao)","codigo":"2366000000300","filtro":[{"impuesto":"13%","descripcion":"Chocolate con leche, en bloques, barras o tabletas (que contengan más del 50% del peso en bruto en cacao)","codigoBienServicio":"2366000000300"}],"cantidad":6,"tipo":"Unid","precioUnitario":1100,"descuento":0,"razon":"","impuesto":"01-08","porcentaje":false,"base":0,"tarifa":1.13,"subtotal":6600,"total":7457.999999999999},{"producto":"Limones y limas, frescos o refrigerados, n.c.p.","codigo":"0132200009900","filtro":[{"impuesto":"13%","descripcion":"Limones y limas, frescos o refrigerados, n.c.p.","codigoBienServicio":"0132200009900"}],"cantidad":5,"tipo":"Unid","precioUnitario":500,"descuento":0,"razon":"","impuesto":"01-08","porcentaje":false,"base":0,"tarifa":1.13,"subtotal":2500,"total":2824.9999999999995},{"producto":"Mango verde, fresco o refrigerado","codigo":"0131601021700","filtro":[{"impuesto":"1%","descripcion":"Mango verde, fresco o refrigerado","codigoBienServicio":"0131601021700"}],"cantidad":4,"tipo":"Unid","precioUnitario":450,"descuento":0,"razon":"","impuesto":"01-02","porcentaje":false,"base":0,"tarifa":1.01,"subtotal":1800,"total":1818}]');

const OTROS_CARGOS : OtroCargo[] = JSON.parse('[{"tipoDocumento":"04","detalle":"Propina","monto":1000,"porcentaje":false,"tipoIdentificacion":"01","identificacion":"117510169","nombre":"Jorge Blanco","total":1000},{"tipoDocumento":"06","detalle":"Servicio de envio","monto":10,"porcentaje":true,"tipoIdentificacion":"","identificacion":"","nombre":"","total":1500}]');

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  // { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  // { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  // { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  // { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  // { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  // { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  // { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  // { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  // { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  // { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


const facturas = [
  {
    fecha: "05/05/2021", nombreComercial: "Jorge Blanco", numeroConsecutivo: "00100001010100012357",
    claveDocumento: "50621042100011751016900100001010100012357198762243", tipoDocumento: "Factura electrónica"
  },
  {
    fecha: "05/05/2021", nombreComercial: "Jorge Blanco", numeroConsecutivo: "00100001010100012358",
    claveDocumento: "50621042100011751016900100001010100012358198762244", tipoDocumento: "Nota de crédito"
  },
  {
    fecha: "05/05/2021", nombreComercial: "Jorge Blanco", numeroConsecutivo: "00100001010100012359",
    claveDocumento: "50621042100011751016900100001010100012359198762244", tipoDocumento: "Nota de débito"
  },
  {
    fecha: "05/05/2021", nombreComercial: "Jorge Blanco", numeroConsecutivo: "00100001010100012357",
    claveDocumento: "50621042100011751016900100001010100012357198762243", tipoDocumento: "Factura electrónica"
  },
  {
    fecha: "05/05/2021", nombreComercial: "Jorge Blanco", numeroConsecutivo: "00100001010100012358",
    claveDocumento: "50621042100011751016900100001010100012358198762244", tipoDocumento: "Nota de crédito"
  },
  {
    fecha: "05/05/2021", nombreComercial: "Jorge Blanco", numeroConsecutivo: "00100001010100012359",
    claveDocumento: "50621042100011751016900100001010100012359198762244", tipoDocumento: "Nota de débito"
  },
  {
    fecha: "05/05/2021", nombreComercial: "Jorge Blanco", numeroConsecutivo: "00100001010100012357",
    claveDocumento: "50621042100011751016900100001010100012357198762243", tipoDocumento: "Factura electrónica"
  },
  {
    fecha: "05/05/2021", nombreComercial: "Jorge Blanco", numeroConsecutivo: "00100001010100012358",
    claveDocumento: "50621042100011751016900100001010100012358198762244", tipoDocumento: "Nota de crédito"
  },
  {
    fecha: "05/05/2021", nombreComercial: "Jorge Blanco", numeroConsecutivo: "00100001010100012359",
    claveDocumento: "50621042100011751016900100001010100012359198762244", tipoDocumento: "Nota de débito"
  },

]
//(click)="openDialog()"
@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent implements OnInit {

  columnasFactura: string[] = ['fecha', 'nombreComercial', 'numeroConsecutivo', 'claveDocumento', 'tipoDocumento', 'notaCredito', 'notaDebito', 'enviarCorreo', 'anular'];
  datosFacturas = new MatTableDataSource(facturas);
  private paginator!: MatPaginator;
  private sorter!: MatSort;

  constructor(public dialog: MatDialog) {

  }

  @ViewChild('documentosPaginator') set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setPaginator();
  }

  // @ViewChild('tablaFacturas') set matSort(sort:MatSort){
  //   this.sorter = sort; 
  // }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sorter = ms;
    this.setSorter();
  }

  setPaginator() {
    if (this.paginator) {
      this.datosFacturas.paginator = this.paginator;
    }
  }

  setSorter() {
    if (this.sorter) {
      this.datosFacturas.sort = this.sorter;
    }
  }

  ngOnInit(): void {
    console.log(OTROS_CARGOS);
  }

  openDialogAnular(): void {
    const dialogRef = this.dialog.open(DialogAnular, {
      width: '80%',
      height: '70%',
      data: ELEMENT_DATA
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosFacturas.filter = filterValue.trim().toLowerCase();
  }

  crearNotaCredito(element: any) {

  }

  crearNotaDebito(element: any) {

  }

  EnviarCorreo(element: any) {

  }

  anularFactura(element: any) {
    this.openDialogAnular();
  }

}

@Component({
  selector: 'app-anular',
  templateUrl: './anular.component.html',
})
export class DialogAnular implements OnInit {

  displayedColumnsLineas: string[] = ['Producto', 'Cantidad', 'PrecioUnitario', 'Descuento', 'Impuestos', 'Subtotal', 'Total'];
  displayedColumnsCargo: string[] = ['TipoDocumento', 'Detalle', 'PorcentajeMonto', 'MontoCargo'];
  datosFactura: MatTableDataSource<Linea> = new MatTableDataSource(LINEAS);
  datosCargo: MatTableDataSource<OtroCargo> = new MatTableDataSource(OTROS_CARGOS);
  private paginatorLineas!: MatPaginator;
  private paginatorCargos!: MatPaginator;

  nombreEmisor = "Rodolfo de Jesus Mora Zamora";
  cedulaEmisor = "113160737";
  correoEmisor = "rodolfo@gmail.com";
  telefonoEmisor = "8888-8888";

  nombreReceptor = "María Fernanda Niño";
  cedulaReceptor = "117170242";
  correoReceptor = "mary@gmail.com";
  telefonoReceptor = "8888-8888";

  constructor(
    public dialogRef: MatDialogRef<DialogAnular>) {
  }

  @ViewChild('lineasPaginator') set matPaginatorLineas(mp: MatPaginator) {
    this.paginatorLineas = mp;
    this.setPaginatorLineas();
  }

  @ViewChild('cargosPaginator') set matPaginatorCargos(mp: MatPaginator) {
    this.paginatorCargos = mp;
    this.setPaginatorCargos();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setPaginatorLineas() {
    if (this.paginatorLineas) {
      this.datosFactura.paginator = this.paginatorLineas;
    }
  }

  setPaginatorCargos() {
    if (this.paginatorCargos) {
      this.datosCargo.paginator = this.paginatorCargos;
    }
  }


  ngOnInit() {

  }


}
