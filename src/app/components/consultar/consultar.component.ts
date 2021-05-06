import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
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
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAnular, {
      width: '80%',
      data: {position: ELEMENT_DATA[0].position, name: ELEMENT_DATA[0].name, 
        weight: ELEMENT_DATA[0].weight, symbol: ELEMENT_DATA[0].symbol }
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
export class DialogAnular implements OnInit {

  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  public versions: any[] = [];
  public versionIndex: number = 0;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  constructor(
    public dialogRef: MatDialogRef<DialogAnular>,  @Inject(MAT_DIALOG_DATA) public dataSource: PeriodicElement) {

    }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
    var toAdd : {datas: { position: string; name: string; weight: string; symbol: string; }[]} = {
      datas: []
    };

    toAdd.datas.push({
      position:"feature 1",
      name:"1",
      weight:"1",
      symbol:"1"
    }); 

    toAdd.datas.push({
      position:"feature 2",
      name:"2",
      weight:"2",
      symbol:"2"
    }); 

    toAdd.datas.push({
      position:"feature 3",
      name:"3",
      weight:"3",
      symbol:"3"
    }); 

    toAdd.datas.push({
      position:"feature 4",
      name:"4",
      weight:"4",
      symbol:"4"
    }); 


    this.versions.push(toAdd);
  }

  
}
