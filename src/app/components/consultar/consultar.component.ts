import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';



const facturas = [
  {
    fecha: "05/05/2021", nombreComercial: "", numeroConsecutivo:"", 
    claveDocumento:"",tipoDocumento:""
  },
  {
    fecha: "05/05/2021", nombreComercial: "", numeroConsecutivo:"", 
    claveDocumento:"",tipoDocumento:""
  },
  {
    fecha: "05/05/2021", nombreComercial: "", numeroConsecutivo:"", 
    claveDocumento:"",tipoDocumento:""
  },
  {
    fecha: "05/05/2021", nombreComercial: "", numeroConsecutivo:"", 
    claveDocumento:"",tipoDocumento:""
  },

]

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent implements OnInit {

  columnasFactura: string[] = ['fecha', 'nombreComercial', 'numeroConsecutivo', 'claveDocumento', 'tipoDocumento', 'notaCredito', 'notaDebito', 'enviarCorreo', 'anular'];
  datosFacturas = new MatTableDataSource(facturas);
  private paginator!: MatPaginator;
  constructor() { }

  @ViewChild('documentosPaginator') set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    if (this.paginator) {
      this.datosFacturas.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosFacturas.filter = filterValue.trim().toLowerCase();
  }

}
