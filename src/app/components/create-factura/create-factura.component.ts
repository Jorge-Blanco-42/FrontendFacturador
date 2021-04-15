import { Component, OnInit } from '@angular/core';
import { ServicioFirmadoXML } from '../../services/firmadoXML';
import { ServicioClaveXML } from '../../services/claveXML'
import { ServicioCreacionXML } from '../../services/creacionXML';
import { ServicioCaByS } from '../../services/cabys'
import { FirmadoXML } from '../../models/firmadoXML';
import { CreacionXML } from '../../models/creacionXML';
import { ServicioEnvioXML } from '../../services/envioXML';
import { EnvioXML } from '../../models/envioXML';
import { ClaveXML } from '../../models/claveXML';
import { TipoCambio } from '../../models/tipoCambio';
import { ServicioTipoCambio } from '../../services/tipoCambioXML';
import { DatePipe } from '@angular/common'
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';

//inicio mary
export interface Clientes {
  nombre: string;
  identificacion: number;
  correo: string;
}

const ELEMENT_DATA: Clientes[] = [
  { nombre: 'Daniel Riquelme Argüello', identificacion: 123456789, correo: 'example@example.com' },
  { nombre: 'Josué Siles Durán ', identificacion: 123456789, correo: 'example@example.com' },
  { nombre: 'Pedro Melendez Melendez', identificacion: 123456789, correo: 'example@example.com' },
  { nombre: 'Sebastían Rojas Lora', identificacion: 123456789, correo: 'example@example.com' },
  { nombre: 'Andres Gómez Sanchez', identificacion: 123456789, correo: 'example@example.com' },
  { nombre: 'Dennis Angulo Fuentes', identificacion: 123456789, correo: 'example@example.com' },
  { nombre: 'José Martinez Garay', identificacion: 123456789, correo: 'example@example.com' },
  { nombre: 'Esteban Gonzalez Matamoros', identificacion: 123456789, correo: 'example@example.com' },
  { nombre: 'Alejandra Rivera Alvarado', identificacion: 123456789, correo: 'example@example.com' },
  { nombre: 'Daniel Vargas Camacho', identificacion: 123456789, correo: 'example@example.com' },
];
//fin mary

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrls: ['./create-factura.component.css'],
  providers: [DatePipe, ServicioTipoCambio, ServicioCaByS]
})
export class CreateFacturaComponent implements OnInit {

  displayedColumns: string[] = ['busquedaNombreCliente', 'busquedaIdentificacionCliente', 'busquedaCorreoCliente'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  private paginator: MatPaginator | undefined;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

  }


  public isCollapsedEmisorData = true;
  public isCollapsedReceptorData = true;
  public emisorDeshabilitado = true;
  public receptorDeshabilitado = true;
  public tipoReceptor: string;
  impuestoTarifa: Map<string, number>;
  public datosXML: CreacionXML;
  public cambio: TipoCambio;
  public tipo_cambio: Number;
  public maxDate = new Date();
  public lineas: Linea[] = [];
  public otrosCargos: OtroCargo[] = [];
  cabys: { impuesto: string, descripcion: string }[] = [];
  streets: string[] = ['Champs-Élysées', 'Lombard Street', 'Abbey Road', 'Fifth Avenue', 'Lombard Street', 'Abbey Road', 'Fifth Avenue', 'Lombard Street', 'Abbey Road', 'Fifth Avenue', 'Lombard Street', 'Abbey Road', 'Fifth Avenue'];
  descripciones: { descripcion: string, impuesto: string }[] = [];
  clienteSeleccionado = false;
  receptorDatosImportantes = true;


  constructor(public datepipe: DatePipe, private _servicioTipoCambio: ServicioTipoCambio, private _servicioCaByS: ServicioCaByS) {
    this.datosXML = new CreacionXML("genXML", "gen_xml_fe", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "CRC", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "");
    this.cambio = new TipoCambio("", "", "");
    this.tipo_cambio = 0;
    this.tipoReceptor = "REGISTRADO";
    this.impuestoTarifa = new Map();

  }


  ngOnInit(): void {
    this.datosXML.condicion_venta = "Contado";
    this.datosXML.medio_pago = "Efectivo";
    this.tipoReceptor = "REGISTRADO";
    this.actualizarTipoCambio(this.maxDate);
    this.getCabys();
    this.impuestoTarifa.set("01-01", 0);
    this.impuestoTarifa.set("01-02", 1.01);
    this.impuestoTarifa.set("01-03", 1.02);
    this.impuestoTarifa.set("01-04", 1.04);
    this.impuestoTarifa.set("01-05", 0);
    this.impuestoTarifa.set("01-06", 1.02);
    this.impuestoTarifa.set("01-07", 1.04);
    this.impuestoTarifa.set("01-08", 1.13);
    this.impuestoTarifa.set("07", 0);
    this.impuestoTarifa.set("08", 0);
  }

  private _filter(value: string): { descripcion: string, impuesto: string }[] {
    if (value) {
      const filterValue = this._normalizeValue(value);
      if (filterValue.length > 3) {
        return this.cabys.filter(cabys => this._normalizeValue(cabys.descripcion).includes(filterValue));
      }
      return this.cabys.slice(0, 50);
    } else {
      return this.cabys.slice(0, 50);
    }
    //return this.descripciones.filter(descripcion => this._normalizeValue(descripcion).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    //console.log("normalize value ",value);
    return value.toLowerCase().replace(/\s/g, '');
  }

  enviar(form: any): void {
    console.log(form);

  }

  cambioFecha(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.actualizarTipoCambio(event.value);
    }
  }

  actualizarTipoCambio(fecha: Date) {
    let latest_date = this.datepipe.transform(fecha, 'yyyy-MM-dd');
    console.log(latest_date);
    let arrayfecha = [];
    if (latest_date) {
      arrayfecha = latest_date.split("-");
      this.cambio.año = arrayfecha[0];
      this.cambio.mes = arrayfecha[1];
      this.cambio.dia = arrayfecha[2];
    }
    this._servicioTipoCambio.getTipoCambio(this.cambio).subscribe(
      result => {
        console.log("Tipo de cambio: ", <any>result)
        this.tipo_cambio = result.venta;
        this.datosXML.tipo_cambio = this.tipo_cambio.toString();
      },
      error => {
        console.log(<any>error)
      }
    );
  }
  actualizarTarifa(linea: Linea) {
    let tarifa = this.impuestoTarifa.get(linea.impuesto);
    console.log(tarifa);
    if (tarifa != undefined) {
      linea.tarifa = tarifa;
    }
    console.log(linea);
  }

  calcularTotales(linea: Linea) {
    let subtotal = linea.cantidad * linea.precioUnitario
    linea.subtotal = (subtotal).toString();
    console.log(linea.porcentaje);
    if (linea.porcentaje) {
      if (linea.tarifa != 0) {
        linea.total = (subtotal * linea.tarifa - (subtotal * (linea.descuento / 100))).toString();
      } else {
        linea.total = (subtotal - (subtotal * (linea.descuento / 100))).toString();
      }

    } else {
      if (linea.tarifa != 0) {
        linea.total = (subtotal * linea.tarifa - linea.descuento).toString();
      } else {
        linea.total = (subtotal - linea.descuento).toString();
      }

    }

  }

  getCabys() {
    let cabysS = localStorage.getItem("cabys");
    if (cabysS) {
      this.cabys = JSON.parse(cabysS);
      let descripcionesS = localStorage.getItem("cabys");
    } else {
      this._servicioCaByS.getCaByS().subscribe(
        result => {
          this.cabys = result;
          localStorage.setItem("cabys", JSON.stringify(result))
          localStorage.setItem("descripciones", JSON.stringify(this.cabys))
          console.log("traido", this.descripciones[0]);
        },
        error => {
          console.log(<any>error)
        }
      );
    }
    //this.streets.concat(this.descripciones);
    //console.log(this.streets);
  }

  nuevoCargo() {
    this.otrosCargos.push(new OtroCargo("", "", "", "", "", "", ""));
  }

  borrarCargo(index: number) {
    this.otrosCargos.splice(index, 1);
  }

  nuevaLinea() {
    var control = new FormControl();
    var filtro = control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.lineas.push(new Linea("", control, filtro, 0, "Sp", 0, 0, "", "01-08", false, 0, 1.13, "", ""));
  }

  setImpuesto(linea:Linea, cabys: { descripcion: string, impuesto: string }) {
    let impuesto = cabys.impuesto;
    switch (impuesto) {
      case "1%":
        linea.impuesto = "01-02"
        break;
      case "2%":
        linea.impuesto = "01-03"
        break;
      case "4%":
        linea.impuesto = "01-04"
        break;
      case "13%":
        linea.impuesto = "01-08"
        break;
      default:
        linea.impuesto = "01-01"
        break;
    }
  }

  modificarEmisor() {
    this.emisorDeshabilitado = false;
  }

  cancelarEmisor() {
    this.emisorDeshabilitado = true;
  }

  guardarEmisor() {
    console.log("PENDIENTE")
  }

  guardarReceptor() {
    console.log("PENDIENTE")
  }

  borrarLinea(index: number) {
    this.lineas.splice(index, 1)
  }

  toggle() {
    this.isCollapsedEmisorData = !this.isCollapsedEmisorData;
    this.emisorDeshabilitado = true;
  }

  toggleReceptor() {
    this.isCollapsedReceptorData = !this.isCollapsedReceptorData;
    // this.emisorDeshabilitado = true;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRecord(row: any) {
    this.clienteSeleccionado = true;
    this.datosXML.receptor_nombre = row.nombre;
    console.log(row);
  }

  // aqui hay algo raro.. TIPORECEPTOR AL REVES
  seleccionarTipoCliente() {
    this.clienteSeleccionado = false;
    console.log(this.tipoReceptor);
    if (this.tipoReceptor === "REGISTRADO") {
      this.receptorDatosImportantes = false;
      this.receptorDeshabilitado = false;
      this.isCollapsedReceptorData = false;
      this.datosXML.receptor_nombre = "";
    } else {
      this.receptorDatosImportantes = true;
      this.receptorDeshabilitado = true;
      this.isCollapsedReceptorData = true;
    }
  }

  modificarReceptor() {
    this.receptorDeshabilitado = false;
  }

  actualizarReceptor() {
    this.receptorDeshabilitado = true;
  }

  cancelarReceptor() {
    this.receptorDeshabilitado = true;
  }
}
