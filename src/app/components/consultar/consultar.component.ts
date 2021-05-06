import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



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
  constructor(public dialog: MatDialog) { }

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
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '80%',
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
    this.openDialog();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './anular.component.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>) {


    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  
}
