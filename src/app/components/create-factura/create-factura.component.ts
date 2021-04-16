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
  receptor_tipo_identif: string, identificacion: string,
  receptor_provincia: string, receptor_canton: string,
  receptor_distrito: string, receptor_barrio: string,
  receptor_cod_pais_tel: string, receptor_tel: string,
  receptor_cod_pais_fax: string, receptor_fax: string,
  correo: string

}

const ELEMENT_DATA: Clientes[] = [
  {
    nombre: "David Gónzalez", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "1", receptor_distrito: "1", receptor_barrio: "1",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "Jorge Blanco Cordero", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "1", receptor_distrito: "1", receptor_barrio: "1",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "María Fernanda Niño Ramírez", receptor_tipo_identif: "01", identificacion: "117170242",
    receptor_provincia: "1", receptor_canton: "1", receptor_distrito: "1", receptor_barrio: "1",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "José Martinez Garay", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "1", receptor_distrito: "1", receptor_barrio: "1",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "Daniel Vargas Camacho", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "1", receptor_distrito: "1", receptor_barrio: "1",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "Usuario de prueba 1", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "1", receptor_distrito: "1", receptor_barrio: "1",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "Usuario de prueba 2", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "1", receptor_distrito: "1", receptor_barrio: "1",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "Usuario de prueba 3", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "1", receptor_distrito: "1", receptor_barrio: "1",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
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
  public radioCliente: number = 0;
  public impuestoTarifa: Map<string, number>;
  public datosXML: CreacionXML;
  public cambio: TipoCambio;
  public tipo_cambio: Number;
  public total_OtrosCargos: number;
  public maxDate = new Date();
  public lineas: Linea[] = [];
  public otrosCargos: OtroCargo[] = [];
  cabys: { impuesto: string, descripcion: string }[] = [];
  descripciones: string[] = [];
  clienteSeleccionado = false;
  receptorDatosImportantes = true;
  public lineasJSON: {}[] = [];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSourceResumen: MatTableDataSource<Linea> = new MatTableDataSource(this.lineas);
  claveXML: ClaveXML;
  signXML: FirmadoXML;
  sendXML: EnvioXML;


  constructor(public datepipe: DatePipe, private _servicioTipoCambio: ServicioTipoCambio, private _servicioCaByS: ServicioCaByS,
              private _signXMLService: ServicioFirmadoXML, private _createXMLService: ServicioCreacionXML,
              private _sendXMLService: ServicioEnvioXML, private _servicioClaveXML: ServicioClaveXML,) {
    this.claveXML = new ClaveXML("clave", "clave", "fisico", "117510169", "normal", "506", "86153313", "81726354", "FE");
    this.datosXML = new CreacionXML("genXML", "gen_xml_fe", "", "", new Date().toString(), "Jorge Blanco Cordero", "01", "117510169", "Jorge Blanco Cordero", "1", "10", "4", "4", "Mi casa", "506", "86153313",
      "506", "00000000", "jorgeblanco@estudiantec.cr", "", "", "", "", "", "", "", "506", "", "506", "", "", "01",
      "0", "01", "CRC", "", "", "", "", "", "", "", "", "", "", "", "", "",
      "", "", "");
    this.signXML = new FirmadoXML("signXML", "signFE",
      "67d23a034ddf5991e5a8e9a72e708f4c", "",
      "2021", "FE");
    this.sendXML = new EnvioXML("send", "json", "this.token.access_token", "50626032100011751016900100001011522773402174658321", 
      "", "01", "117510169", "01", "114480790", "","api-stag");
    this.cambio = new TipoCambio("", "", "");
    this.tipo_cambio = 0;
    this.impuestoTarifa = new Map();
    this.total_OtrosCargos = 0;
    

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

  inputEnter() {
    console.log("puto el que submit");
  }

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
    this.lineas.forEach(linea => {
      if (linea.descuento > 0) {
        if (linea.tarifa > 0) {//Linea con descuento y tarifa
          console.log("Tarifa+descuento");
          this.lineasJSON.push({ cantidad: linea.cantidad, unidadMedida: linea.tipo, detalle: linea.producto,
            precioUnitario: linea.precioUnitario, montoTotal: linea.total, subTotal: linea.subtotal, 
            montoTotalLinea: linea.total, montoDescuento: linea.descuento, naturalezaDescuento: linea.razon, 
            impuesto: [{ codigo: linea.impuesto.slice(0, 2), tarifa: ((linea.tarifa - 1) * 100), 
            monto: (linea.tarifa - 1) * linea.subtotal }] });
        }else{//Linea con solo descuento
          console.log("descuento");
          this.lineasJSON.push({ cantidad: linea.cantidad, unidadMedida: linea.tipo, detalle: linea.producto, 
            precioUnitario: linea.precioUnitario, montoTotal: linea.total, subTotal: linea.subtotal, 
            montoTotalLinea: linea.total, montoDescuento: linea.descuento, naturalezaDescuento: linea.razon });
        }
      }else if (linea.tarifa > 0){//Linea con solo tarifa
        console.log("Tarifa");
        this.lineasJSON.push({ cantidad: linea.cantidad, unidadMedida: linea.tipo, detalle: linea.producto,
          precioUnitario: linea.precioUnitario, montoTotal: linea.total, subTotal: linea.subtotal, 
          montoTotalLinea: linea.total, impuesto: [{ codigo: linea.impuesto.slice(0, 2), 
          tarifa: ((linea.tarifa - 1) * 100), monto: (linea.tarifa - 1) * linea.subtotal }] });
      }else{//Linea solo con productos
        console.log("Nada");
        this.lineasJSON.push({ cantidad: linea.cantidad, unidadMedida: linea.tipo, detalle: linea.producto, 
          precioUnitario: linea.precioUnitario, montoTotal: linea.total, subTotal: linea.subtotal, 
          montoTotalLinea: linea.total});
      }
      
    });
    console.log(this.lineasJSON);
    this.datosXML.detalles = JSON.stringify(this.lineasJSON);
    this._servicioClaveXML.crearClaveXML(this.claveXML).subscribe(
      result => {
        console.log("CLAVE XML ", <any>result);
        this.datosXML.clave = result.clave;
        this.datosXML.consecutivo = result.consecutivo;
        this._createXMLService.crearXML(this.datosXML).subscribe(
          result2 => {
            console.log("XML Creado", <any>result2);
            this.signXML.inXml = result2.xml;
            this._signXMLService.firmarFEXML(this.signXML).subscribe(
              result3 =>{
                console.log("XML FIRMADO", <any>result3);
                let token = localStorage.getItem("token");
                if(token){
                  this.sendXML.token = token;
                }else{
                  console.log("SE DESPICHO EL TOKEN");
                }
                this.sendXML.fecha = this.datosXML.fecha_emision;
                this.sendXML.comprobanteXml = result3.xmlFirmado;
                this._sendXMLService.enviarFEXML(this.sendXML).subscribe(
                  result4 => {
                    console.log(<any>result4);
                    alert("Factura creada y enviada correctamente :D");
                  },
                  error4 =>{
                    alert("Hubo un error al enviar la factura :c");
                    console.log(<any>error4);
                  }
                )
                
              },
              error3 =>{
                alert("Hubo un error firmar el XML :c");
                console.log(<any>error3);
              }
            )
          },
          error2 =>{
            alert("Hubo un error al crear el XML :c");
            console.log(<any>error2);
          }
        )
      },
      error => {
        alert("Hubo un error al crear la clave del XML :c");
        console.log(<any>error)
      }
    );
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
  actualizarTarifaLinea(linea: Linea) {
    let tarifa = this.impuestoTarifa.get(linea.impuesto);
    console.log(tarifa);
    if (tarifa != undefined) {
      linea.tarifa = tarifa;
    }
    console.log(linea);
    this.calcularTotalesLinea(linea);
  }

  calcularTotalesLinea(linea: Linea) {
    linea.subtotal = linea.cantidad * linea.precioUnitario
    console.log(linea.porcentaje);
    if (linea.porcentaje) {
      if (linea.tarifa != 0) {
        linea.total = linea.subtotal * linea.tarifa - (linea.subtotal * (linea.descuento / 100))
      } else {
        linea.total = linea.subtotal - (linea.subtotal * (linea.descuento / 100))
      }

    } else {
      if (linea.tarifa != 0) {
        linea.total = linea.subtotal * linea.tarifa - linea.descuento
      } else {
        linea.total = linea.subtotal - linea.descuento
      }

    }
    this.calcularTotales();
  }

  calcularTotales() {
    console.log("suelte la harina, pa");
    this.total_OtrosCargos = 0;
    let total_comprobante = 0;
    let total_serv_gravados = 0;
    let total_serv_exentos = 0;
    let total_serv_exonerados = 0;
    let total_merc_gravada = 0;
    let total_merc_exenta = 0;
    let total_merc_exonerados = 0;
    let total_gravados = 0;
    let total_exentos = 0;
    let total_exonerados = 0;
    let total_ventas = 0;
    let total_descuentos = 0;
    let total_ventas_neta = 0;
    let total_impuestos = 0;
    this.lineas.forEach(linea => {
      if (linea.impuesto === "01-01" || linea.impuesto === '01-05') {//Exento
        if (linea.tipo === 'Sp' || linea.tipo === 'St' || linea.tipo === 'Os') {
          total_serv_exentos += linea.subtotal;
        } else {
          total_merc_exenta += linea.subtotal;
        }
        total_exentos += linea.subtotal;
      } else {//gravado
        if (linea.tipo === 'Sp' || linea.tipo === 'St' || linea.tipo === 'Os') {
          total_serv_gravados += linea.subtotal;
        } else {
          total_merc_gravada += linea.subtotal;
        }
        total_gravados += linea.subtotal;
      }
      if (linea.porcentaje) {
        total_descuentos += linea.subtotal * (linea.descuento / 100);
      } else {
        total_descuentos += linea.descuento;
      }
      total_impuestos += linea.subtotal * (linea.tarifa - 1);
    });
    total_ventas = total_gravados + total_exentos + total_exonerados;
    this.datosXML.total_ventas = total_ventas.toString();
    this.otrosCargos.forEach(cargo => {
      console.log("cargo");
      this.actualizarCargo(cargo);
    });
    total_ventas_neta = total_ventas - total_descuentos;
    total_comprobante = total_ventas_neta + total_impuestos + this.total_OtrosCargos;
    this.datosXML.total_comprobante = total_comprobante.toString();
    this.datosXML.total_serv_gravados = total_serv_gravados.toString();
    this.datosXML.total_serv_exentos = total_serv_exentos.toString();
    this.datosXML.total_merc_gravada = total_merc_gravada.toString();
    this.datosXML.total_merc_exenta = total_merc_exenta.toString();
    this.datosXML.total_gravados = total_gravados.toString();
    this.datosXML.total_exentos = total_exentos.toString();

    this.datosXML.total_descuentos = total_descuentos.toString();
    this.datosXML.total_ventas_neta = total_ventas_neta.toString();
    this.datosXML.total_impuestos = total_impuestos.toString();


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
    this.otrosCargos.push(new OtroCargo("", "", 1, false, "", "", "", 0));
  }

  borrarCargo(index: number) {
    this.otrosCargos.splice(index, 1);
  }

  setMontoCargo(cargo: OtroCargo) {
    if (cargo.tipoDocumento === "Impuesto de servicio 10%") {
      cargo.porcentaje = true;
      cargo.monto = 10;
    }
    this.actualizarCargo(cargo);
  }

  actualizarCargo(cargo: OtroCargo) {
    console.log("UPDATE");
    if (cargo.porcentaje) {
      cargo.total = Number(this.datosXML.total_ventas) * (cargo.monto / 100);
    } else {
      cargo.total = cargo.monto;
    }
    this.total_OtrosCargos = 0;
    this.otrosCargos.forEach(cargo => {
      this.total_OtrosCargos += cargo.total;
    });
  }

  nuevaLinea() {
    var control = new FormControl();
    var filtro = control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.lineas.push(new Linea("", control, filtro, 1, "Sp", 5, 0, "", "01-08", false, 0, 1.13, 0, 0));
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
    this.calcularTotalesLinea(linea);
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
