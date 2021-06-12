import { Component, OnInit, Inject, ViewChild, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';
import { ServicioCorreo } from 'src/app/services/correo';
import { Correo } from 'src/app/models/correo';
import { CrearNotaComponent } from '../crear-nota/crear-nota.component';
import { ServicioUsuario } from 'src/app/services/usuario';
import { ClaveXML } from 'src/app/models/claveXML';
import { Certificado } from 'src/app/models/certificado';
import { FirmadoXML } from 'src/app/models/firmadoXML';
import { EnvioXML } from 'src/app/models/envioXML';
import { ServicioEscritorXML } from 'src/app/services/escritorXML';
import { ServicioDecodificador } from 'src/app/services/decodificador';
import { ServicioEnvioXML } from 'src/app/services/envioXML';
import { DatePipe } from '@angular/common';
import { ServicioCertificado } from 'src/app/services/certificado';
import { ServicioClaveXML } from 'src/app/services/claveXML';
import { ServicioFirmadoXML } from 'src/app/services/firmadoXML';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { Documento } from 'src/app/models/documento';
import { ServicioConsultas } from 'src/app/services/consultas';
import { ToastrService } from 'ngx-toastr';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css'],
  providers: [ServicioUsuario]
})
export class ConsultarComponent implements OnInit {

  columnasFactura: string[] = ['fecha', 'receptor', 'numeroConsecutivo', 'claveDocumento', 'tipoDocumento', 'estado', 'notaCredito', 'notaDebito', 'enviarCorreo', 'anular'];
  facturas:any[] = [];
  datosFacturas!: MatTableDataSource<any>;
  private paginator!: MatPaginator;
  private sorter!: MatSort;


  @ViewChild('documentosPaginator') set matPaginator(mp: MatPaginator) {
    this.paginator = mp;

  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sorter = ms;

  }

  constructor(public dialog: MatDialog, private _servicioUsuario: ServicioUsuario,
    private _servicioAutenticacion: ServicioAutenticacion, private toastr: ToastrService) {
    this.cargarDocumentos()
      .then((res) => {
        let resp = JSON.parse(res);
        // console.log(resp)
        let documentos = resp.docs;
        let estados = resp.estados;
        documentos.forEach((doc: any) => {
          let clave: string = doc.claveDocumento;
          let consecutivo = clave.substr(21, 20);
          let tipoDocumento = "";
          let estado = "";
          if (doc.IDTipoDocumento === 1) tipoDocumento = "Factura Electrónica";
          else if (doc.IDTipoDocumento === 2) tipoDocumento = "Nota de débito";
          else if (doc.IDTipoDocumento === 3) tipoDocumento = "Nota de crébito";
          else if (doc.IDTipoDocumento === 4) tipoDocumento = "Tiquete Electrónico";
          estados.forEach((estadoAceptacion: { IDEstadoAceptacion: number; estadoAceptacion: string; }) => {
            if (doc.estadoAceptacion === estadoAceptacion.IDEstadoAceptacion) estado = estadoAceptacion.estadoAceptacion;
          });
          this.facturas.push({
            fecha: doc.fechaDocumento.substr(0, 10), nombreComercial: doc.nombreReceptor,
            numeroConsecutivo: consecutivo, claveDocumento: clave, tipoDocumento: tipoDocumento, estado: estado, xml: doc.xml,
            xmlEstadoAceptacion: doc.xmlEstadoAceptacion
          });
        });
        this.datosFacturas = new MatTableDataSource(this.facturas);
        this.setPaginator();
        this.setSorter();
        this.toastr.success('Documentos cargados correctamente');
      })
      .catch((err) => { 
        // console.error(err);
        this.toastr.error('No se cargaron los documentos', 'Error');
      })
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


  cargarDocumentos(): Promise<string> {
    return new Promise((resolve, reject) => {
      let idUsuario = this._servicioAutenticacion.obtenerDatosUsuario().IDUsuario;
      this._servicioUsuario.getDocumentos(idUsuario).subscribe(
        result => { resolve(JSON.stringify(result)); },
        err => { reject(err); }
      )
    })
  }

  openDialogAnular(xml: string): void {
    const dialogRef = this.dialog.open(DialogResumen, {
      width: '80%',
      height: '70%',
      data: {
        anular: true,
        xml: xml
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  openDialogCorreo(xml: string,
    xmlEstadoAceptacion:string): void {
    const dialogRef = this.dialog.open(DialogResumen, {
      width: '80%',
      height: '70%',
      data: {
        anular: false,
        xml: xml,
        xmlEstadoAceptacion: xmlEstadoAceptacion
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  openDialogNota(tipoNota: string, xml: string): void {
    const dialogRef = this.dialog.open(CrearNotaComponent, {
      width: '80%',
      height: '80%',
      data: {
        tipoNota: tipoNota,
        xml: xml
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosFacturas.filter = filterValue.trim().toLowerCase();
  }

  crearNotaCredito(element: any) {
    this.openDialogNota("NC", element.xml);
  }

  crearNotaDebito(element: any) {
    this.openDialogNota("ND", element.xml);
  }

  EnviarCorreo(element: any) {
    this.openDialogCorreo(element.xml, element.xmlEstadoAceptacion);
  }

  anularFactura(element: any) {
    this.openDialogAnular(element.xml);
  }

}

@Component({
  selector: 'app-anular',
  templateUrl: './anular.component.html',
  providers: [ServicioUsuario, ServicioEscritorXML, ServicioDecodificador,
    ServicioEnvioXML, ServicioCertificado, ServicioFirmadoXML, ServicioClaveXML, DatePipe,
    ServicioCorreo, ServicioUsuario]
})
export class DialogResumen implements OnInit {

  displayedColumnsLineas: string[] = ['Producto', 'Cantidad', 'PrecioUnitario', 'Descuento', 'Impuestos', 'Subtotal', 'Total'];
  displayedColumnsCargo: string[] = ['TipoDocumento', 'Detalle', 'PorcentajeMonto', 'MontoCargo'];
  datosFactura!: MatTableDataSource<Linea>;
  datosCargo!: MatTableDataSource<OtroCargo>;
  private paginatorLineas!: MatPaginator;
  private paginatorCargos!: MatPaginator;
  checkEmisor: boolean = false;
  checkReceptor: boolean = false;
  checkOtro: boolean = false;
  otraDireccion: string = "";
  xml: string;
  xmlEstadoAceptacion:string;
  anular: boolean;

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
  fecha: string | null = "";

  consecutivo: number = 0;
  strConsecutivo: string = "";
  codigoSeguridad: string = "";
  claveMayor: string = "";

  constructor(
    public dialogRef: MatDialogRef<DialogResumen>,
    @Inject(MAT_DIALOG_DATA) public data: { anular: boolean, xml: string, xmlEstadoAceptacion:string }, private _servicioCorreo: ServicioCorreo,
    private _servicioUsuario: ServicioUsuario, private _servicioEscritorXML: ServicioEscritorXML,
    private _servicioDecodificador: ServicioDecodificador, private _servicioEnvio: ServicioEnvioXML,
    private _servicioFirma: ServicioFirmadoXML, private _servicioCertificado: ServicioCertificado,
    public datepipe: DatePipe, private _servicioClave: ServicioClaveXML, private _servicioAutenticacion: ServicioAutenticacion,
    private _servicioConsultas: ServicioConsultas, private toastr: ToastrService) {
    this.anular = data.anular;
    this.xml = data.xml;
    this.xmlEstadoAceptacion = data.xmlEstadoAceptacion;
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
        this.nombreEmisor = datos.jsonData[tipo].Emisor[0].Nombre[0];
        this.cedulaEmisor = datos.jsonData[tipo].Emisor[0].Identificacion[0].Numero[0];
        this.correoEmisor = datos.jsonData[tipo].Emisor[0].CorreoElectronico[0];
        this.telefonoEmisor = datos.jsonData[tipo].Emisor[0].Telefono[0].NumTelefono[0];
        this.nombreReceptor = datos.jsonData[tipo].Receptor[0].Nombre[0];
        this.cedulaReceptor = datos.jsonData[tipo].Receptor[0].Identificacion[0].Numero[0];
        this.correoReceptor = datos.jsonData[tipo].Receptor[0].CorreoElectronico[0];
        this.telefonoReceptor = datos.jsonData[tipo].Receptor[0].Telefono[0].NumTelefono[0];
        var lineas: Linea[] = [];
        var lineasJSON = datos.jsonData[tipo].DetalleServicio;
        if (lineasJSON) {
          for (let index = 0; index < lineasJSON.length; index++) {
            const lineaJson = lineasJSON[index];
            //
            let linea = new Linea("", "", [{ descripcion: "", impuesto: "", codigoBienServicio: "" }], 0, "", 0, 0, "", "", false, 0, 0, 0, 0);
            linea.producto = lineaJson.LineaDetalle[0].Detalle[0];
            linea.codigo = lineaJson.LineaDetalle[0].Codigo[0];
            linea.filtro[0].descripcion = lineaJson.LineaDetalle[0].Detalle[0];
            linea.filtro[0].impuesto = lineaJson.LineaDetalle[0].Impuesto[0].Tarifa[0];
            linea.filtro[0].codigoBienServicio = lineaJson.LineaDetalle[0].Codigo[0];
            linea.cantidad = Number(lineaJson.LineaDetalle[0].Cantidad);
            linea.tipo = lineaJson.LineaDetalle[0].UnidadMedida[0];
            linea.precioUnitario = Number(lineaJson.LineaDetalle[0].PrecioUnitario[0]);
            if (lineaJson.LineaDetalle[0].Descuento) {
              linea.descuento = Number(lineaJson.LineaDetalle[0].Descuento[0].MontoDescuento[0]);
              linea.razon = lineaJson.LineaDetalle[0].Descuento[0].NaturalezaDescuento[0];
            }
            if (lineaJson.LineaDetalle[0].BaseImponible)
              linea.base = Number(lineaJson.LineaDetalle[0].BaseImponible[0]);
            linea.tarifa = Number(lineaJson.LineaDetalle[0].Impuesto[0].Tarifa[0]);
            linea.subtotal = Number(lineaJson.LineaDetalle[0].SubTotal[0]);
            linea.total = Number(lineaJson.LineaDetalle[0].MontoTotalLinea[0]); //no se estan usando todos los campos del xml
            //
            lineas.push(linea);
          }
        }

        var cargos: OtroCargo[] = [];
        var cargosJSON = datos.jsonData[tipo].OtrosCargos;
        if (cargosJSON) {
          for (let index = 0; index < cargosJSON.length; index++) {
            const cargoJSON = cargosJSON[index];

            let cargo = new OtroCargo("", "", 0, false, "", "", "", 0);
            cargo.tipoDocumento = cargoJSON.TipoDocumento[0];
            cargo.detalle = cargoJSON.Detalle[0];
            cargo.monto = cargoJSON.Porcentaje[0];
            cargo.total = cargoJSON.MontoCargo[0];
            if (cargo.total === cargo.monto) {
              cargo.porcentaje = true;
            }
            if (cargo.tipoDocumento === "04") {
              cargo.tipoIdentificacion = "01";
              cargo.identificacion = cargoJSON.NumeroIdentidadTercero;[0]
              cargo.nombre = cargoJSON.NombreTercero[0];

            }
            cargos.push(cargo);
          }
        }

        this.datosCargo = new MatTableDataSource(cargos);
        this.datosFactura = new MatTableDataSource(lineas);
        this.setPaginatorLineas();
        this.setPaginatorCargos();
      })
      .catch((err) => {
        // console.log(err);
        this.toastr.error('No se cargaron los datos', 'Error');
      })
  }

  @ViewChild('lineasPaginator') set matPaginatorLineas(mp: MatPaginator) {
    this.paginatorLineas = mp;
  }

  @ViewChild('cargosPaginator') set matPaginatorCargos(mp: MatPaginator) {
    this.paginatorCargos = mp;

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

  AnularDocumento() {
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
                                let fechaBD = this.datepipe.transform(this.fecha, "dd/MM/yyyy")
                                let usuario = this._servicioAutenticacion.obtenerDatosUsuario().IDUsuario;
                                let aceptacion;
                                // console.log(fecha, fechaBD);
                                // if(resp.resp["ind-estado"] === "rechazado") aceptacion = "3";
                                // else if(resp.resp["ind-estado"] === "aceptado") aceptacion = "1";
                                // else aceptacion = "2"
                                aceptacion = "2";
                                let documento = new Documento(this.claveNueva, this.xml,
                                  fechaBD ? fechaBD : "", this.nombreReceptor, "2", usuario,
                                  aceptacion, resp.resp["respuesta-xml"]);
                                this._servicioUsuario.insertDocumento(documento).subscribe(estadoFinal => {
                                  // console.log(estadoFinal);
                                  this.toastr.success('Documento anulado correctamente');
                                  this.dialogRef.close();
                                  // console.log(res)
                                }, errorBD => {
                                  // console.log("error en base de datos", errorBD);
                                  this.toastr.error('Error al anular el documento', 'Error');
                                })

                              },
                              error => {
                                // console.log("No se pudo enviar el correo");
                                this.toastr.error('Error al anular el documento', 'Error');
                              }
                            );
                          },
                          error => {
                            // console.log("error en consulta");
                            this.toastr.error('Error al anular el documento', 'Error');
                          }
                        )
                      }, 30000);
                    }

                  })
                  .catch((err) => { 
                    // console.error(err);
                    this.toastr.error('Error al anular el documento', 'Error');
                  })
              })
              .catch((err) => { 
                // console.error(err);
                this.toastr.error('Error al anular el documento', 'Error');
              })
          })
          .catch((err) => { 
            // console.error(err);
            this.toastr.error('Error al anular el documento', 'Error');
          })
      })
      .catch((err) => { 
        // console.error(err);
        this.toastr.error('Error al anular el documento', 'Error');
      })


  }

  enviarCorreo() {
    let correo: Correo = new Correo("", "Factura electrónica " + this.nombreEmisor, "Se adjunta factura eléctronica",
      "Factura.xml", this.xml, this.xmlEstadoAceptacion, "base64");//PONER EL XML DEL MENSAJE DE ACEPTACION
    if (this.checkEmisor) {
      correo.to = this.correoEmisor;
      // console.log(correo);
      this.enviarC(correo);
    }
    if (this.checkReceptor) {
      correo.to = this.correoReceptor;
      // console.log(correo);
      this.enviarC(correo);
    }
    if (this.checkOtro) {
      correo.to = this.otraDireccion;
      // console.log(correo);
      this.enviarC(correo);
    }
    this.dialogRef.close();
  }

  enviarC(correo: Correo) {
    this._servicioCorreo.enviarCorreo(correo).subscribe(
      res => {
        // console.log("correo enviado");
        this.toastr.success('Correo enviado correctamente');
      },
      error => {
        // console.log("No se pudo enviar el correo");
        this.toastr.error('Error al enviar el correo', 'Error');
      }
    );
  }

  convertirXML(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._servicioUsuario.convertirXML(this.xml).subscribe(
        result => { resolve(JSON.stringify(result)); },
        err => { reject(err); }
      )
    })
  }

  tipoDocumento(tipo: string): string {
    if (tipo === "06") {
      return "Impuesto de servicio 10%"
    } else if (tipo === "04") {
      return "Cobro a terceros"
    } else {
      return "Otros"
    }
  }

  crearClave(): Promise<any> {
    return new Promise((resolve, reject) => {
      let clave = new ClaveXML("clave", "clave", this.tipoIdentEmisor, this.cedulaEmisor,
        "normal", "506", this.strConsecutivo, this.codigoSeguridad, "ND");
      this._servicioClave.crearClaveXML(clave).subscribe(
        result => { resolve(result); },
        err => { reject(err); }
      )
    })
  }

  crearNota(): Promise<any> {
    let data = { tipoDoc: '01', numero: this.clave, fechaEmision: this.fechaEmision, codigo: '01', razon: "Anula Documento de Referencia" }
    return new Promise((resolve, reject) => {
      this._servicioDecodificador.decodificarXML(this.xml).subscribe(
        result1 => {
          this.fecha = this.datepipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ssZZZZZ');
          // console.log(this.fecha);
          this._servicioEscritorXML.crearNotaAnular(result1.xmlDecoded, "ND", data, this.claveNueva, this.fecha ? this.fecha : "").subscribe(
            result2 => {

              this._servicioDecodificador.codificarXML(result2.xmlFile).subscribe(
                res => { 
                  // console.log(res); 
                  resolve(res); 
                },
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
          let certificado: Certificado = result[0];
          certificado.archivoURL = result[0].archivo;
          // console.log(result[0])
          let firma = new FirmadoXML("signXML", "signFE", certificado.archivoURL, this.xml, certificado.pin, "ND")
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
      let envio = new EnvioXML("send", "json", token ? token : "", this.claveNueva, this.fecha ? this.fecha : "",
        this.tipoIdentEmisor, this.cedulaEmisor, this.tipoIdentReceptor,
        this.cedulaReceptor, this.xml, "api-stag");
      // console.log(envio);
      this._servicioEnvio.enviarFEXML(envio).subscribe(
        res => { resolve(res); },
        err => { reject(err); }
      )
    });

  }

  ngOnInit() {
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
      this.toastr.error('Error al cargar los datos', 'Error');
    })
  }


}
