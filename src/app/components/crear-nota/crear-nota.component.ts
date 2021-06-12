import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Certificado } from 'src/app/models/certificado';
import { ClaveXML } from 'src/app/models/claveXML';
import { Correo } from 'src/app/models/correo';
import { CreacionXML } from 'src/app/models/creacionXML';
import { Documento } from 'src/app/models/documento';
import { EnvioXML } from 'src/app/models/envioXML';
import { FirmadoXML } from 'src/app/models/firmadoXML';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { ServicioCaByS } from 'src/app/services/cabys';
import { ServicioCertificado } from 'src/app/services/certificado';
import { ServicioClaveXML } from 'src/app/services/claveXML';
import { ServicioConsultas } from 'src/app/services/consultas';
import { ServicioCorreo } from 'src/app/services/correo';
import { ServicioDecodificador } from 'src/app/services/decodificador';
import { ServicioEnvioXML } from 'src/app/services/envioXML';
import { ServicioEscritorXML } from 'src/app/services/escritorXML';
import { ServicioFirmadoXML } from 'src/app/services/firmadoXML';
import { ServicioUsuario } from 'src/app/services/usuario';
import { ToastrService } from 'ngx-toastr';

const replacer = new RegExp('\"', 'g');

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

  consecutivo: number = 0;
  strConsecutivo: string = "";
  codigoSeguridad: string = "";
  claveMayor: string = "";

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
    public datepipe: DatePipe, private _servicioClave: ServicioClaveXML, private _servicioAutenticacion: ServicioAutenticacion,
    private _servicioConsultas: ServicioConsultas, private _servicioCorreo: ServicioCorreo, private toastr: ToastrService) {
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
        let tipo;
        if (datos.jsonData.FacturaElectronica) tipo = "FacturaElectronica";
        else if (datos.jsonData.NotaDebitoElectronica) tipo = "NotaDebitoElectronica";
        else tipo = "NotaCreditoElectronica";
        this.tipoIdentEmisor = datos.jsonData[tipo].Emisor[0].Identificacion[0].Tipo[0];
        this.tipoIdentReceptor = datos.jsonData[tipo].Receptor[0].Identificacion[0].Tipo[0];
        this.clave = datos.jsonData[tipo].Clave[0];
        this.fechaEmision = datos.jsonData[tipo].FechaEmision[0];
        this.nombreEmisor = datos.jsonData[tipo].Emisor[0].Nombre;
        this.cedulaEmisor = datos.jsonData[tipo].Emisor[0].Identificacion[0].Numero;
        this.correoEmisor = datos.jsonData[tipo].Emisor[0].CorreoElectronico;
        this.telefonoEmisor = datos.jsonData[tipo].Emisor[0].Telefono[0].NumTelefono;
        this.nombreReceptor = datos.jsonData[tipo].Receptor[0].Nombre;
        this.cedulaReceptor = datos.jsonData[tipo].Receptor[0].Identificacion[0].Numero;
        this.correoReceptor = datos.jsonData[tipo].Receptor[0].CorreoElectronico;
        this.telefonoReceptor = datos.jsonData[tipo].Receptor[0].Telefono[0].NumTelefono;
        this.lineas = [];
        var lineasJSON = datos.jsonData[tipo].DetalleServicio;
        if (lineasJSON) {
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
            if (lineaJson.LineaDetalle[0].BaseImponible)
              linea.base = Number(lineaJson.LineaDetalle[0].BaseImponible[0]);
            linea.tarifa = Number(lineaJson.LineaDetalle[0].Impuesto[0].Tarifa[0]);
            linea.subtotal = Number(lineaJson.LineaDetalle[0].SubTotal[0]);
            linea.total = Number(lineaJson.LineaDetalle[0].MontoTotalLinea[0]); //no se estan usando todos los campos del xml
            //
            // console.log(linea)
            this.lineas.push(linea);
          }
        }
        this.dataSourceResumen = new MatTableDataSource(this.lineas);

        this.otrosCargos = [];
        var cargosJSON = datos.jsonData[tipo].OtrosCargos;
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
        this.toastr.error('No se cargaron los datos', 'Error');
        // console.log(err);
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
    let usuario = this._servicioAutenticacion.obtenerDatosUsuario().IDUsuario;
    this._servicioUsuario.getUltimoDocumento(usuario).subscribe(res => {
      this.claveMayor = res.doc.claveDocumento;
      this.consecutivo = parseInt(this.claveMayor.substr(31, 10));
      // console.log(this.consecutivo)
      this.consecutivo += 1;
      this.strConsecutivo = this.consecutivo.toString().padStart(10, "0");
      this.codigoSeguridad = Math.floor(Math.random() * 99999999).toString().padStart(8, "0");
    }, err => {
      // console.log(err);
      this.toastr.error('No se puede crear la nota', 'Error');
    })
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
        // console.log(res.resp)
        this.claveNueva = res.resp.clave;
        this.crearNota()
          .then((res) => {
            this.xml = res.xmlencoded;
            this.firmar()
              .then((res) => {
                this.xml = res;
                this.enviar()
                  .then((respEnvio) => {
                    if (respEnvio.resp.Status === 202) {
                      // console.log("esperar");
                      setTimeout(() => {
                        let token = localStorage.getItem("token");
                        this._servicioConsultas.consultarAceptacion(this.claveNueva, token ? token : "").subscribe(
                          resp => {
                            // console.log("", resp);

                            let correo = new Correo(this.correoReceptor, "Factura electrónica " + this.nombreEmisor,
                              "Se adjunta factura electrónica", "Factura " + this.nombreEmisor + ".xml",
                              this.xml, resp.resp["respuesta-xml"], "base64");
                            // console.log(correo);
                            this._servicioCorreo.enviarCorreo(correo).subscribe(
                              res => {
                                // console.log("correo enviado", correo);
                                let fechaBD = this.datepipe.transform(this.fechaEmision, "dd/MM/yyyy")
                                let usuario = this._servicioAutenticacion.obtenerDatosUsuario().IDUsuario;
                                let aceptacion;
                                // console.log(fecha, fechaBD);
                                // if(resp.resp["ind-estado"] === "rechazado") aceptacion = "3";
                                // else if(resp.resp["ind-estado"] === "aceptado") aceptacion = "1";
                                // else aceptacion = "2"
                                aceptacion = "2";
                                let documento = new Documento(this.claveNueva, this.xml,
                                  fechaBD ? fechaBD : "", this.nombreReceptor, this.data.tipoNota === "NC" ? "3" : "2", usuario,
                                  aceptacion, resp.resp["respuesta-xml"]);
                                this._servicioUsuario.insertDocumento(documento).subscribe(estadoFinal => {
                                  // console.log(estadoFinal);
                                  this.toastr.success('Enviando a Hacienda', 'Nota creada');
                                  this.dialogRef.close();
                                  // console.log(res)
                                }, errorBD => {
                                  // console.log("error en base de datos", errorBD);
                                  this.toastr.error('No se pudo crear la nota', 'Error');
                                })

                              },
                              error => {
                                // console.log("No se pudo enviar el correo");
                                this.toastr.error('No se pudo crear la nota', 'Error');
                              }
                            );
                          },
                          error => {
                            // console.log("error en consulta");
                            this.toastr.error('No se pudo crear la nota', 'Error');
                          }
                        )
                      }, 30000);
                    }
                  })
                  .catch((err) => { 
                    // console.error(err) 
                    this.toastr.error('No se pudo crear la nota', 'Error');
                  })
              })
              .catch((err) => { 
                // console.error(err)
                this.toastr.error('No se pudo crear la nota', 'Error');
              })
          })
          .catch((err) => { 
            // console.error(err) 
            this.toastr.error('No se pudo crear la nota', 'Error');
          })
      })
      .catch((err) => {
        //  console.error(err) 
         this.toastr.error('No se pudo crear la nota', 'Error');
        })


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
    // console.log(this.total_OtrosCargos);
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
    this.calcularTotales();
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
      this.total_OtrosCargos += cargo.total;
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
    // console.log(this.dataSourceResumen);
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
      let clave = new ClaveXML("clave", "clave", this.tipoIdentEmisor, this.cedulaEmisor,
        "normal", "506", this.strConsecutivo, this.codigoSeguridad, this.data.tipoNota);
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

          this._servicioEscritorXML.crearNota(result1.xmlDecoded, this.data.tipoNota, data, this.claveNueva, fecha ? fecha : "").subscribe(
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
      let cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
      this._servicioCertificado.getCertificado(cedula).subscribe(
        result => {
          let certificado: Certificado = result;
          let firma = new FirmadoXML("signXML", "signFE", certificado.archivoURL, this.xml, certificado.pin, this.data.tipoNota)
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
      // console.log(envio);
      this._servicioEnvio.enviarFEXML(envio).subscribe(
        res => { resolve(res); },
        err => { reject(err); }
      )
    });

  }

}
