import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Certificado } from 'src/app/models/certificado';
import { ClaveXML } from 'src/app/models/claveXML';
import { CreacionXML } from 'src/app/models/creacionXML';
import { EnvioXML } from 'src/app/models/envioXML';
import { FirmadoXML } from 'src/app/models/firmadoXML';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';
import { ServicioCaByS } from 'src/app/services/cabys';
import { ServicioCertificado } from 'src/app/services/certificado';
import { ServicioClaveXML } from 'src/app/services/claveXML';
import { ServicioDecodificador } from 'src/app/services/decodificador';
import { ServicioEnvioXML } from 'src/app/services/envioXML';
import { ServicioEscritorXML } from 'src/app/services/escritorXML';
import { ServicioFirmadoXML } from 'src/app/services/firmadoXML';
import { ServicioUsuario } from 'src/app/services/usuario';

const replacer = new RegExp('\"', 'g');

//export const servicio 

@Component({
  selector: 'app-crear-nota',
  templateUrl: './crear-nota.component.html',
  styleUrls: ['./crear-nota.component.css'],
  providers: [ServicioCaByS, ServicioUsuario, ServicioEscritorXML, ServicioDecodificador,
    ServicioEnvioXML, ServicioCertificado, ServicioFirmadoXML, ServicioClaveXML, DatePipe]
})
export class CrearNotaComponent implements OnInit {

  nombreEmisor = "";
  tipoIdentEmisor = "";
  cedulaEmisor = "";
  correoEmisor = "";
  telefonoEmisor = "";

  nombreReceptor = "";
  tipoIdentReceptor = "";
  cedulaReceptor = "";
  correoReceptor = "";
  telefonoReceptor = "";
  claveNueva = "";
  clave = "";
  fechaEmision = "";

  xml: string;

  public total_OtrosCargos: number;
  public impuestoTarifa: Map<string, number>;

  public lineas: Linea[] = [];
  public otrosCargos: OtroCargo[] = [];
  public datosXML: CreacionXML;

  public isCollapsedResumenData: boolean = true;

  cabys: { impuesto: string, descripcion: string, codigoBienServicio: string }[] = [];
  dataSourceResumen!: MatTableDataSource<Linea>;
  displayedColumnsResumen: string[] = ['productoLinea', 'cantidadProductoLinea', 'totalLinea'];

  constructor(
    public dialogRef: MatDialogRef<CrearNotaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tipoNota: string, xml: string }, private _servicioCaByS: ServicioCaByS,
    private _servicioUsuario: ServicioUsuario, private _servicioEscritorXML: ServicioEscritorXML,
    private _servicioDecodificador: ServicioDecodificador, private _servicioEnvio: ServicioEnvioXML,
    private _servicioFirma: ServicioFirmadoXML, private _servicioCertificado: ServicioCertificado,
    public datepipe: DatePipe, private _servicioClave: ServicioClaveXML) {
    this.total_OtrosCargos = 0;
    this.impuestoTarifa = new Map();
    this.datosXML = new CreacionXML("genXML", "gen_xml_fe", "", "", new Date().toString(),
      this.nombreEmisor, "01", this.cedulaEmisor, "n/a",
      "1", "10", "04", "04", "Mi casa", "506", this.telefonoEmisor,
      "506", "00000000", this.correoEmisor, this.nombreReceptor, "", this.cedulaReceptor,
      "", "", "", "", "506", this.telefonoReceptor, "506", "", this.correoReceptor, "01", "0", "01", "CRC",
      "", "", "", "", "", "", "", "", "", "", "", "", "nada", "nada", "", "False");
    this.xml = data.xml;
    this.convertirXML()
      .then((res) => {
        var datos = JSON.parse(res);
        this.tipoIdentEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Identificacion[0].Tipo[0]
        this.tipoIdentReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Identificacion[0].Tipo[0]
        this.clave = datos.jsonData.FacturaElectronica.Clave[0]
        this.fechaEmision = datos.jsonData.FacturaElectronica.FechaEmision[0];
        this.nombreEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Nombre;
        this.cedulaEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Identificacion[0].Numero;
        this.correoEmisor = datos.jsonData.FacturaElectronica.Emisor[0].CorreoElectronico;
        this.telefonoEmisor = datos.jsonData.FacturaElectronica.Emisor[0].Telefono[0].NumTelefono;
        this.nombreReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Nombre;
        this.cedulaReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Identificacion[0].Numero;
        this.correoReceptor = datos.jsonData.FacturaElectronica.Receptor[0].CorreoElectronico;
        this.telefonoReceptor = datos.jsonData.FacturaElectronica.Receptor[0].Telefono[0].NumTelefono;
        this.lineas = [];
        var lineasJSON = datos.jsonData.FacturaElectronica.DetalleServicio;

        for (let index = 0; index < lineasJSON.length; index++) {
          const lineaJson = lineasJSON[index];
          //
          let linea = new Linea("", "", [{ descripcion: "", impuesto: "", codigoBienServicio: "" }], 0, "", 0, 0, "", "", false, 0, 0, 0, 0);
          linea.producto = lineaJson.LineaDetalle[0].Detalle[0];
          linea.codigo = lineaJson.LineaDetalle[0].Codigo[0];
          linea.filtro[0].descripcion = lineaJson.LineaDetalle[0].Detalle;
          linea.filtro[0].impuesto = lineaJson.LineaDetalle[0].Impuesto[0].Tarifa[0];
          linea.filtro[0].codigoBienServicio = lineaJson.LineaDetalle[0].Codigo;
          linea.cantidad = Number(lineaJson.LineaDetalle[0].Cantidad);
          linea.tipo = lineaJson.LineaDetalle[0].UnidadMedida[0];
          linea.precioUnitario = Number(lineaJson.LineaDetalle[0].PrecioUnitario);
          if (lineaJson.LineaDetalle[0].Descuento) {
            linea.descuento = Number(lineaJson.LineaDetalle[0].Descuento[0].MontoDescuento);
            linea.razon = lineaJson.LineaDetalle[0].Descuento[0].NaturalezaDescuento;
          }
          linea.base = Number(lineaJson.LineaDetalle[0].BaseImponible);
          linea.tarifa = Number(lineaJson.LineaDetalle[0].Impuesto[0].Tarifa);
          linea.subtotal = Number(lineaJson.LineaDetalle[0].SubTotal);
          linea.total = Number(lineaJson.LineaDetalle[0].MontoTotalLinea); //no se estan usando todos los campos del xml
          //
          console.log(linea)
          this.lineas.push(linea);
        }
        this.dataSourceResumen = new MatTableDataSource(this.lineas);

        this.otrosCargos = [];
        var cargosJSON = datos.jsonData.FacturaElectronica.OtrosCargos;
        if (cargosJSON) {
          for (let index = 0; index < cargosJSON.length; index++) {
            const cargoJSON = cargosJSON[index];

            let cargo = new OtroCargo("", "", 0, false, "", "", "", 0);
            cargo.tipoDocumento = cargoJSON.TipoDocumento[0];
            cargo.detalle = cargoJSON.Detalle[0];
            cargo.monto = Number(cargoJSON.Porcentaje[0]);
            cargo.total = Number(cargoJSON.MontoCargo[0]);
            if (cargo.total === cargo.monto) {
              cargo.porcentaje = true;
            }
            if (cargo.tipoDocumento === "04") {
              cargo.tipoIdentificacion = "01";
              cargo.identificacion = cargoJSON.NumeroIdentidadTercero[0];
              cargo.nombre = cargoJSON.NombreTercero[0];

            }
            this.otrosCargos.push(cargo);

          }
        }
        this.calcularTotales();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  @ViewChild('resumenPaginator')
  paginatorResumen!: MatPaginator;

  ngOnInit(): void {
    this.getCabys();
    this.impuestoTarifa.set("01-01", 1.0);
    this.impuestoTarifa.set("01-02", 1.01);
    this.impuestoTarifa.set("01-03", 1.02);
    this.impuestoTarifa.set("01-04", 1.04);
    this.impuestoTarifa.set("01-05", 1.0);
    this.impuestoTarifa.set("01-06", 1.02);
    this.impuestoTarifa.set("01-07", 1.04);
    this.impuestoTarifa.set("01-08", 1.13);
    this.impuestoTarifa.set("07-02", 1.01);
    this.impuestoTarifa.set("07-03", 1.02);
    this.impuestoTarifa.set("07-04", 1.04);
    this.impuestoTarifa.set("07-05", 1.0);
    this.impuestoTarifa.set("07-06", 1.02);
    this.impuestoTarifa.set("07-07", 1.04);
    this.impuestoTarifa.set("07-08", 1.13);
    this.impuestoTarifa.set("08", 0);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleResumen() {
    this.isCollapsedResumenData = !this.isCollapsedResumenData;
    // this.emisorDeshabilitado = true;
  }

  enviarNota() {
    this.crearClave()
    .then((res) => {
      console.log(res.resp)
      this.claveNueva = res.resp.clave;
      this.crearNota()
      .then((res) => {
        this.xml = res.xmlencoded;
        this.firmar()
          .then((res) => {
            this.xml = res;
            this.enviar()
              .then((res) => { console.log(res) })
              .catch((err) => { console.error(err) })
          })
          .catch((err) => { console.error(err) })
      })
      .catch((err) => { console.error(err) })
    })
    .catch((err) => { console.error(err) })
    
    
  }



  filtroCabys(evt: string, linea: Linea) {
    linea.filtro = this._filter(evt);
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
          //console.log("traido", this.descripciones[0]);
        },
        error => {
          //console.log(<any>error)
        }
      );
    }
    ////console.log(this.streets);
  }

  setCabys(linea: Linea, cabys: { descripcion: string, impuesto: string, codigoBienServicio: string }) {
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
    linea.codigo = cabys.codigoBienServicio;
    this.actualizarTarifaLinea(linea);
  }

  actualizarTarifaLinea(linea: Linea) {
    let tarifa = this.impuestoTarifa.get(linea.impuesto);
    //console.log(tarifa);
    if (tarifa != undefined) {
      linea.tarifa = tarifa;
    }
    //console.log(linea);
    this.calcularTotalesLinea(linea);
  }

  calcularTotalesLinea(linea: Linea) {
    linea.subtotal = linea.cantidad * linea.precioUnitario
    //console.log(linea.porcentaje);
    let montoImpuesto = 0;
    let montoDescuento = 0;
    if (linea.impuesto.slice(0, 2) === '07') {
      montoImpuesto = (linea.tarifa - 1) * linea.base;
    } else {
      montoImpuesto = (linea.tarifa - 1) * linea.subtotal;
    }
    if (linea.porcentaje) {
      montoDescuento = (linea.subtotal * (linea.descuento / 100));
    } else {
      montoDescuento = linea.descuento;
    }
    linea.total = linea.subtotal + montoImpuesto - montoDescuento;
    //console.log(linea.total, montoImpuesto, montoDescuento);
    this.calcularTotales();
  }

  calcularTotales() {
    //console.log("suelte la harina, pa");
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
      if (linea.impuesto.slice(0, 2) === '07') {
        total_impuestos += (linea.tarifa - 1) * linea.base;
      } else {
        total_impuestos += (linea.tarifa - 1) * linea.subtotal;
      }
    });
    total_ventas = total_gravados + total_exentos + total_exonerados;
    this.datosXML.total_ventas = total_ventas.toString();
    this.otrosCargos.forEach(cargo => {
      //console.log("cargo");
      this.actualizarCargo(cargo);
    });
    total_ventas_neta = total_ventas - total_descuentos;
    total_comprobante = total_ventas_neta + total_impuestos + this.total_OtrosCargos;
    //console.log(this.total_OtrosCargos)
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

  private _filter(value: string): { descripcion: string, impuesto: string, codigoBienServicio: string }[] {
    if (value) {
      const filterValue = this._normalizeValue(value);
      if (filterValue.length > 3) {
        return this.cabys.filter(cabys => this._normalizeValue(cabys.descripcion).includes(filterValue));
      }
      return this.cabys.slice(0, 50);
    } else {
      return this.cabys.slice(0, 50);
    }
  }

  private _normalizeValue(value: string): string {
    //console.log("normalize value ",value);
    return value.toLowerCase().replace(/\s/g, '');
  }

  nuevoCargo() {
    this.otrosCargos.push(new OtroCargo("", "", 1, false, "", "", "", 0));
  }

  borrarCargo(index: number) {
    this.otrosCargos.splice(index, 1);
  }

  setMontoCargo(cargo: OtroCargo) {
    if (cargo.tipoDocumento === "06") {
      cargo.porcentaje = true;
      cargo.monto = 10;
    }
    this.actualizarCargo(cargo);
  }

  actualizarCargo(cargo: OtroCargo) {
    //console.log("UPDATE");
    if (cargo.porcentaje) {
      cargo.total = Number(this.datosXML.total_ventas) * (cargo.monto / 100);
    } else {
      cargo.total = cargo.monto;
    }
    this.total_OtrosCargos = 0;

    this.otrosCargos.forEach(cargo => {
      console.log(cargo)
      this.total_OtrosCargos += cargo.total;
      console.log(this.total_OtrosCargos);
    });
  }

  nuevaLinea() {
    var filtro = this._filter("");
    this.lineas.push(new Linea("", "", filtro, 1, "Sp", 5, 0, "", "01-08", false, 0, 1.13, 0, 0));
    this.dataSourceResumen.data = this.lineas;
    this.dataSourceResumen.connect().next(this.lineas);
    if (this.paginatorResumen) {
      this.paginatorResumen._changePageSize(this.paginatorResumen.pageSize);
      //console.log("caca")
    }
    this.setDataSourceResumenAttributes()
    console.log(this.dataSourceResumen);
  }

  borrarLinea(index: number) {
    this.lineas.splice(index, 1)
    this.dataSourceResumen.data = this.dataSourceResumen.data;
    this.setDataSourceResumenAttributes()
  }

  setDataSourceResumenAttributes() {
    if (this.paginatorResumen) {
      this.dataSourceResumen.paginator = this.paginatorResumen;
    }
  }

  lineaNormal(linea: Linea): string {
    let producto = linea.producto.replace(replacer, "&quot;");
    return '{"cantidad":"' + linea.cantidad + '","unidadMedida":"' + linea.tipo + '","detalle":"' + producto +
      '","precioUnitario":"' + linea.precioUnitario + '","montoTotal":"' + linea.total + '","subTotal":"' + linea.subtotal +
      '","montoTotalLinea":"' + linea.total + '"';
  }

  lineaConDescuento(linea: Linea) {
    let lineaStr = this.lineaNormal(linea);
    if (linea.porcentaje) {
      lineaStr += ',"montoDescuento":"' + ((linea.descuento / 100) * linea.subtotal) + '","naturalezaDescuento":"' + linea.razon + '"';
    } else {
      lineaStr += ',"montoDescuento":"' + linea.descuento + '","naturalezaDescuento":"' + linea.razon + '"';
    }
    return lineaStr;
  }

  lineaConImpuesto(linea: Linea, lineaStr: string): string {
    let impuesto = linea.impuesto.slice(0, 2);
    lineaStr += ',"impuesto":';
    lineaStr += '{"1":{"codigo":"' + linea.impuesto.slice(0, 2);
    if (impuesto === '01' || impuesto === '07') { //IVA
      lineaStr += '","codigoTarifa":"' + linea.impuesto.slice(3, 5) +
        '","tarifa":"' + Math.round((linea.tarifa - 1) * 100) + '"';
      if (impuesto === '01') {
        lineaStr += ',"monto":"' + Math.round((linea.tarifa - 1) * linea.subtotal * 100) / 100 + '"}}';
      } else {
        lineaStr += '","monto":"' + Math.round((linea.tarifa - 1) * linea.base * 100) / 100 + '"}}';
      }
    } else {
      lineaStr += '","Factor IVA":"' + Math.round((linea.tarifa - 1) * 100) +
        '","monto":"' + Math.round((linea.tarifa - 1) * linea.subtotal * 100) / 100 + '"}}';
    }
    return lineaStr;
  }

  convertirXML(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._servicioUsuario.convertirXML(this.xml).subscribe(
        result => { resolve(JSON.stringify(result)); },
        err => { reject(err); }
      )
    })
  }

  crearClave(): Promise<any> {
    return new Promise((resolve, reject) => {
      let clave = new ClaveXML("clave","clave",this.tipoIdentEmisor,this.cedulaEmisor,
      "normal","506","010002375","98862261",this.data.tipoNota);
      this._servicioClave.crearClaveXML(clave).subscribe(
        result => { resolve(result); },
        err => { reject(err); }
      )
    })
  }

  crearNota(): Promise<any> {
    let data = { tipoDoc: '01', numero: this.clave, fechaEmision: this.fechaEmision, codigo: '02', razon: "Corrige Monto" }
    return new Promise((resolve, reject) => {
      this._servicioDecodificador.decodificarXML(this.xml).subscribe(
        result1 => {
          let fecha = this.datepipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ssZZZZZ');
          
          this._servicioEscritorXML.crearNota(result1.xmlDecoded, this.data.tipoNota, data, this.claveNueva , fecha?fecha:"").subscribe(
            result2 => {
              this._servicioDecodificador.codificarXML(result2.xmlFile).subscribe(
                res => { resolve(res); },
                err => { reject(err); }
              )
            },
            err => { reject(err); }
          )
        },
        err => { reject(err); }
      )

    })
  }

  firmar(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._servicioCertificado.getCertificado("2").subscribe(
        result => {
          let certificado: Certificado = result;
          let firma = new FirmadoXML("signXML", "signFE", certificado.archivo, this.xml, certificado.pin, this.data.tipoNota)
          this._servicioFirma.firmarFEXML(firma).subscribe(
            res => { resolve(res.resp.xmlFirmado); },
            err => { reject(err); }
          )
        },
        error => { reject(error); });
    });

  }

  enviar(): Promise<any> {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem("token")
      let envio = new EnvioXML("send", "json", token ? token : "", this.claveNueva, this.fechaEmision,
        this.tipoIdentEmisor, this.cedulaEmisor, this.tipoIdentReceptor,
        this.cedulaReceptor, this.xml, "api-stag");
      console.log(envio);
      this._servicioEnvio.enviarFEXML(envio).subscribe(
        res => { resolve(res); },
        err => { reject(err); }
      )
    });

  }

}
