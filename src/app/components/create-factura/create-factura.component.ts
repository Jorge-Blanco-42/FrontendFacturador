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
import { ViewChild, AfterViewInit } from '@angular/core';

//inicio mary
export interface Clientes {
  
   nombre: string,
   receptor_tipo_identif: string,  identificacion: string,
   receptor_provincia: string,  receptor_canton: string,
   receptor_distrito: string,  receptor_barrio: string,
   receptor_cod_pais_tel: string,  receptor_tel: string,
   receptor_cod_pais_fax: string,  receptor_fax: string,
   correo : string
   
   /*
   nombre: string;
   identificacion: number;
   correo: string;*/

}

const ELEMENT_DATA: Clientes[] = [
  {nombre: "David Gónzalez",receptor_tipo_identif: "01",  identificacion: "123456789",
   receptor_provincia: "1",  receptor_canton: "1", receptor_distrito: "1",  receptor_barrio: "1",
   receptor_cod_pais_tel: "506",  receptor_tel: "22446688",receptor_cod_pais_fax: "506", 
   receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"},
   {nombre: "Jorge Blanco Cordero",receptor_tipo_identif: "01",  identificacion: "123456789",
   receptor_provincia: "1",  receptor_canton: "1", receptor_distrito: "1",  receptor_barrio: "1",
   receptor_cod_pais_tel: "506",  receptor_tel: "22446688",receptor_cod_pais_fax: "506", 
   receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"},
   {nombre: "María Fernanda Niño Ramírez",receptor_tipo_identif: "01",  identificacion: "123456789",
   receptor_provincia: "1",  receptor_canton: "1", receptor_distrito: "1",  receptor_barrio: "1",
   receptor_cod_pais_tel: "506",  receptor_tel: "22446688",receptor_cod_pais_fax: "506", 
   receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"},
   {nombre: "José Martinez Garay",receptor_tipo_identif: "01",  identificacion: "123456789",
   receptor_provincia: "1",  receptor_canton: "1", receptor_distrito: "1",  receptor_barrio: "1",
   receptor_cod_pais_tel: "506",  receptor_tel: "22446688",receptor_cod_pais_fax: "506", 
   receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"},
   {nombre: "Daniel Vargas Camacho",receptor_tipo_identif: "01",  identificacion: "123456789",
   receptor_provincia: "1",  receptor_canton: "1", receptor_distrito: "1",  receptor_barrio: "1",
   receptor_cod_pais_tel: "506",  receptor_tel: "22446688",receptor_cod_pais_fax: "506", 
   receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"},
   {nombre: "Usuario de prueba 1",receptor_tipo_identif: "01",  identificacion: "123456789",
   receptor_provincia: "1",  receptor_canton: "1", receptor_distrito: "1",  receptor_barrio: "1",
   receptor_cod_pais_tel: "506",  receptor_tel: "22446688",receptor_cod_pais_fax: "506", 
   receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"},
   {nombre: "Usuario de prueba 2",receptor_tipo_identif: "01",  identificacion: "123456789",
   receptor_provincia: "1",  receptor_canton: "1", receptor_distrito: "1",  receptor_barrio: "1",
   receptor_cod_pais_tel: "506",  receptor_tel: "22446688",receptor_cod_pais_fax: "506", 
   receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"},
   {nombre: "Usuario de prueba 3",receptor_tipo_identif: "01",  identificacion: "123456789",
   receptor_provincia: "1",  receptor_canton: "1", receptor_distrito: "1",  receptor_barrio: "1",
   receptor_cod_pais_tel: "506",  receptor_tel: "22446688",receptor_cod_pais_fax: "506", 
   receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"},
];

const ELEMENT_DATA_LINEA: Linea[] = [
  new Linea("", new FormControl, new Observable, 0, "Sp", 0, 0, "", "01-08", false, 0, 1.13, "", ""),
  new Linea("", new FormControl, new Observable, 0, "Sp", 0, 0, "", "01-08", false, 0, 1.13, "", ""),
  new Linea("", new FormControl, new Observable, 0, "Sp", 0, 0, "", "01-08", false, 0, 1.13, "", ""),
  new Linea("", new FormControl, new Observable, 0, "Sp", 0, 0, "", "01-08", false, 0, 1.13, "", ""),
  new Linea("", new FormControl, new Observable, 0, "Sp", 0, 0, "", "01-08", false, 0, 1.13, "", ""),
  new Linea("", new FormControl, new Observable, 0, "Sp", 0, 0, "", "01-08", false, 0, 1.13, "", ""),
  new Linea("", new FormControl, new Observable, 0, "Sp", 0, 0, "", "01-08", false, 0, 1.13, "", ""),
  new Linea("wawacte", new FormControl, new Observable, 0, "Sp", 0, 0, "", "01-08", false, 0, 1.13, "", ""),

];




//fin mary

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrls: ['./create-factura.component.css'],
  providers: [DatePipe, ServicioTipoCambio, ServicioCaByS]
})
export class CreateFacturaComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['busquedaNombreCliente', 'busquedaIdentificacionCliente', 'busquedaCorreoCliente'];
  displayedColumnsResumen: string[] = ['productoLinea', 'cantidadProductoLinea', 'totalLinea'];

  private paginator: MatPaginator | undefined;
  // private paginatorResumen: MatPaginator | undefined;
  public isCollapsedEmisorData = true;
  public isCollapsedReceptorData = true;
  public isCollapsedResumenData = true;
  public emisorDeshabilitado = true;
  public receptorDeshabilitado = true;
  public clienteRegistrado: boolean = true;
  public radioCliente:number= 0;
  impuestoTarifa: Map<string, number>;
  public datosXML: CreacionXML;
  public cambio: TipoCambio;
  public tipo_cambio: Number;
  public maxDate = new Date();
  public lineas: Linea[] = [];
  public otrosCargos: OtroCargo[] = [];
  cabys: { impuesto: string, descripcion: string }[] = [];
  descripciones: string[] = [];
  clienteSeleccionado = false;
  receptorDatosImportantes = true;

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSourceResumen: MatTableDataSource<Linea> = new MatTableDataSource(this.lineas);


  constructor(public datepipe: DatePipe, private _servicioTipoCambio: ServicioTipoCambio, private _servicioCaByS: ServicioCaByS) {

    this.datosXML = new CreacionXML("genXML", "gen_xml_fe", "", "", new Date().toString(), "Jorge Blanco Cordero", "01", "117510169", "Jorge Blanco Cordero", "1", "10", "4", "4", "Mi casa", "506", "86153313",
      "506", "00000000", "jorgeblanco@estudiantec.cr", "", "", "", "", "", "", "", "506", "", "506", "", "", "01",
      "0", "01", "CRC", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "");
    this.cambio = new TipoCambio("", "", "");
    this.tipo_cambio = 0;
    this.impuestoTarifa = new Map();

  }


  ngOnInit(): void {
    this.datosXML.condicion_venta = "01";
    this.datosXML.medio_pago = "01";
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

  @ViewChild('clientesPaginator') set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild('resumenPaginator')
  paginatorResumen!: MatPaginator;

  ngAfterViewInit() {
    if (this.paginatorResumen) {
      this.dataSourceResumen.paginator = this.paginatorResumen;
    }
  }

  // @ViewChild(MatPaginator) set matPaginatorResumen(mp: MatPaginator) {
  //   this.paginatorResumen = mp;
  //   this.setDataSourceResumenAttributes();
  // }

  setDataSourceResumenAttributes() {
    if (this.paginatorResumen) {
      this.dataSourceResumen.paginator = this.paginatorResumen;
    }
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
    this.dataSourceResumen.data = this.lineas;
    this.dataSourceResumen.connect().next(this.lineas);
    if (this.paginatorResumen) {
      this.paginatorResumen._changePageSize(this.paginatorResumen.pageSize);
      console.log("caca")
    }
    this.setDataSourceResumenAttributes()
    console.log(this.dataSourceResumen);
  }

  setImpuesto(linea: Linea, cabys: { descripcion: string, impuesto: string }) {
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
    this.dataSourceResumen.data = this.dataSourceResumen.data;
    this.setDataSourceResumenAttributes()
  }

  toggle() {
    this.isCollapsedEmisorData = !this.isCollapsedEmisorData;
    this.emisorDeshabilitado = true;
  }

  toggleReceptor() {
    this.isCollapsedReceptorData = !this.isCollapsedReceptorData;
    // this.emisorDeshabilitado = true;
  }

  toggleResumen() {
    this.isCollapsedResumenData = !this.isCollapsedResumenData;
    // this.emisorDeshabilitado = true;
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRecord(row: any) {
    this.clienteSeleccionado = true;
    this.datosXML.receptor_nombre = row.nombre;
    this.datosXML.receptor_tipo_identif = row.receptor_tipo_identif;
    this.datosXML.receptor_num_identif = row.identificacion;
    this.datosXML.receptor_email = row.correo;
    this.datosXML.receptor_tel = row.receptor_tel;
    this.datosXML.receptor_fax = row.receptor_fax;
    this.datosXML.receptor_provincia = row.receptor_provincia;
    this.datosXML.receptor_canton = row.receptor_canton;
    this.datosXML.receptor_barrio = row.receptor_barrio;
    this.datosXML.receptor_distrito = row.receptor_distrito;
    console.log(row);
  }

  // aqui hay algo raro.. TIPORECEPTOR AL REVES
  seleccionarTipoCliente(registrado: boolean) {
    this.clienteSeleccionado = false;
    if (registrado) {
      this.clienteRegistrado = true;
      this.receptorDatosImportantes = true;
      this.receptorDeshabilitado = true;
      this.isCollapsedReceptorData = true;
      this.datosXML.receptor_nombre = "";
    } else {
      this.clienteRegistrado = false;
      this.receptorDatosImportantes = false;
      this.receptorDeshabilitado = false;
      this.isCollapsedReceptorData = false;
    }
    console.log(this.clienteRegistrado);

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
