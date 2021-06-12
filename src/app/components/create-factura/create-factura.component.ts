import { Component, OnInit } from '@angular/core';
import { ServicioFirmadoXML } from '../../services/firmadoXML';
import { ServicioClaveXML } from '../../services/claveXML'
import { ServicioCreacionXML } from '../../services/creacionXML';
import { ServicioCaByS } from '../../services/cabys';
import { ServicioDecodificador } from '../../services/decodificador';
import { FirmadoXML } from '../../models/firmadoXML';
import { CreacionXML } from '../../models/creacionXML';
import { ServicioEnvioXML } from '../../services/envioXML';
import { EnvioXML } from '../../models/envioXML';
import { ClaveXML } from '../../models/claveXML';
import { TipoCambio } from '../../models/tipoCambio';
import { ServicioTipoCambio } from '../../services/tipoCambioXML';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild, AfterViewInit } from '@angular/core';
import { ServicioCorreo } from 'src/app/services/correo';
import { Correo } from 'src/app/models/correo';
import { ServicioEscritorXML } from 'src/app/services/escritorXML';
import { ServicioConsultas } from 'src/app/services/consultas';
import { ServicioUbicacion } from 'src/app/services/ubicacion';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { ServicioUsuario } from 'src/app/services/usuario';
import { ServicioPersona } from 'src/app/services/persona';
import { Persona } from 'src/app/models/persona';
import { ActividadEconomica } from 'src/app/models/actividadEconomica';
import { textChangeRangeIsUnchanged } from 'typescript';
import { ServicioTipoIdentificacion } from 'src/app/services/tipoIdentificacion';
import { ServicioCertificado } from 'src/app/services/certificado';
import { Certificado } from 'src/app/models/certificado';
import { Router } from '@angular/router';
import { Documento } from 'src/app/models/documento';
import { ToastrService } from 'ngx-toastr';

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
const replacer = new RegExp('\"', 'g');
const ELEMENT_DATA: Clientes[] = [
  {
    nombre: "David Gónzalez", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "01", receptor_distrito: "01", receptor_barrio: "01",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "Jorge Blanco Cordero", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "01", receptor_distrito: "01", receptor_barrio: "01",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "María Fernanda Niño Ramírez", receptor_tipo_identif: "01", identificacion: "117170242",
    receptor_provincia: "1", receptor_canton: "01", receptor_distrito: "01", receptor_barrio: "01",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "José Martinez Garay", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "01", receptor_distrito: "01", receptor_barrio: "01",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "Daniel Vargas Camacho", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "01", receptor_distrito: "01", receptor_barrio: "01",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "Usuario de prueba 1", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "01", receptor_distrito: "01", receptor_barrio: "01",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "Usuario de prueba 2", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "01", receptor_distrito: "01", receptor_barrio: "01",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
  {
    nombre: "Usuario de prueba 3", receptor_tipo_identif: "01", identificacion: "123456789",
    receptor_provincia: "1", receptor_canton: "01", receptor_distrito: "01", receptor_barrio: "01",
    receptor_cod_pais_tel: "506", receptor_tel: "22446688", receptor_cod_pais_fax: "506",
    receptor_fax: "00000000", correo: "jorge.luis1999@hotmail.com"
  },
];
//fin mary

@Component({
  selector: 'app-create-factura',
  templateUrl: './create-factura.component.html',
  styleUrls: ['./create-factura.component.css'],
  providers: []
})
export class CreateFacturaComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['busquedaNombreCliente', 'busquedaIdentificacionCliente', 'busquedaCorreoCliente'];
  displayedColumnsResumen: string[] = ['productoLinea', 'cantidadProductoLinea', 'totalLinea'];
  private paginator!: MatPaginator;
  clientes: Clientes[] = [];
  public isCollapsedEmisorData: boolean = true;
  public isCollapsedReceptorData: boolean = true;
  public isCollapsedResumenData: boolean = true;
  public emisorDeshabilitado: boolean = true;
  public receptorDeshabilitado: boolean = true;
  public clienteRegistrado: boolean = true;
  clienteSeleccionado: boolean = false;
  receptorDatosImportantes: boolean = true;

  codigoActividad!: string;
  actividades: ActividadEconomica[] = [];

  public radioCliente: number = 0;
  public total_OtrosCargos: number;
  public tipo_cambio: Number;

  public impuestoTarifa: Map<string, number>;
  public cambio: TipoCambio;

  public maxDate = new Date();
  cabys: { impuesto: string, descripcion: string, codigoBienServicio: string }[] = [];
  public lineasJSON: {}[] = [];
  public persona: Persona;
  claveMayor: string = "";
  consecutivo: number = 0;
  public datosXML: CreacionXML;
  private copiaReceptor: any;
  public lineas: Linea[] = [];
  public otrosCargos: OtroCargo[] = [];
  claveXML: ClaveXML;
  signXML: FirmadoXML;
  sendXML: EnvioXML;


  public provincias: any[] = [];
  private cantones: any[] = [];
  private distritos: any[] = [];
  public cantonesFiltradosReceptor: any[] = [];
  public distritosFiltradosReceptor: any[] = [];
  public cantonesFiltradosEmisor: any[] = [];
  public distritosFiltradosEmisor: any[] = [];

  public tipoIdentificaciones: any[] = [];

  public emisorGuardado: boolean = false;
  public receptorGuardado: boolean = false;
  public receptorActualizado: boolean = false;
  public receptorInsertado: boolean = false;
  public registradoAntes: boolean = false;

  public otras_senas_receptor: string = "";

  public provinciaSeleccionada: number = 0;

  dataSource = new MatTableDataSource(this.clientes);
  dataSourceResumen: MatTableDataSource<Linea> = new MatTableDataSource(this.lineas);

  constructor(public datepipe: DatePipe, private _servicioTipoCambio: ServicioTipoCambio, private _servicioCaByS: ServicioCaByS,
    private _signXMLService: ServicioFirmadoXML, private _createXMLService: ServicioCreacionXML,
    private _sendXMLService: ServicioEnvioXML, private _servicioClaveXML: ServicioClaveXML, private _servicioDecodificador: ServicioDecodificador,
    private _servicioCorreo: ServicioCorreo, private _servicioEscritorXML: ServicioEscritorXML, private _servicioConsultas: ServicioConsultas,
    private _servicioUbicacion: ServicioUbicacion, private _servicioAutenticacion: ServicioAutenticacion, private _servicioUsuario: ServicioUsuario,
    private _servicioPersona: ServicioPersona, private _servicioTipoIdentificacion: ServicioTipoIdentificacion,
    private _servicioCertificado: ServicioCertificado, private _router: Router, private toastr: ToastrService) {
    this.claveXML = new ClaveXML("clave", "clave", "fisico", "113160737", "normal", "506", "0100012385",
      "98762268", "FE");

    this.datosXML = new CreacionXML("genXML", "gen_xml_fe", "", "", new Date().toString(),
      "", "01", "", "",
      "1", "01", "01", "01", "", "506", "",
      "506", "", "", "", "", "",
      "", "", "", "", "506", "", "506", "", "", "01", "0", "01", "CRC",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "False");

    this.signXML = new FirmadoXML("signXML", "signFE", "", "",
      "", "FE");

    this.sendXML = new EnvioXML("send", "json", "",
      "", "", "01",
      "117510169", "", "", "", "api-stag");

    this.cambio = new TipoCambio("", "", "");
    this.tipo_cambio = 0;
    this.impuestoTarifa = new Map();

    this.persona = new Persona();

    this.total_OtrosCargos = 0;
    this.cargarActividades();



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

  ngOnInit(): void {
    let cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    let usuario = this._servicioAutenticacion.obtenerDatosUsuario().IDUsuario;
    this.sendXML.emi_numeroIdentificacion = cedula;
    this._servicioCertificado.getCertificado(cedula).subscribe(
      result => {
        this.signXML.p12Url = result[0].archivo;
        this.signXML.pinP12 = result[0].pin;
      }, err => {
        // console.log(err);
        this.toastr.error('No se puede firmar el documento', 'Error');
      });

    let token = localStorage.getItem("token");
    this.actualizarTipoCambio(this.maxDate);

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

    this.cargarUbicaciones().then(res => {
      this.cargarUsuario();
      this.cargarClientes();
      this.cargarTipoID();

    }).catch(error => {
      // console.log('Error cargarUbicacion', error);
      this.toastr.error('No se cargaron los datos', 'Error');
    });
    this._servicioUsuario.getUltimoDocumento(usuario).subscribe(res => {
      this.claveMayor = res.doc.claveDocumento;
      let xd = this.claveMayor.substr(21, 20)
      this.consecutivo = parseInt(this.claveMayor.substr(31, 10));
      // console.log(this.consecutivo)
      this.consecutivo += 1;
      this.claveXML.consecutivo = this.consecutivo.toString().padStart(10, "0");
      this.claveXML.codigoSeguridad = Math.floor(Math.random() * 99999999).toString().padStart(8, "0");
    }, err => {
      // console.log(err);
      this.toastr.error('No se pudo crear la factura', 'Error');
    })
    setTimeout(() => {
      // console.log(this.datosXML);
      // console.log(this.claveXML);
      // console.log(this.signXML);
      // console.log(this.sendXML);
    }, 2000);

  }

  ngAfterViewInit() {
    if (this.paginatorResumen) {
      this.dataSourceResumen.paginator = this.paginatorResumen;
    }
  }

  setDataSourceResumenAttributes() {
    if (this.paginatorResumen) {
      this.dataSourceResumen.paginator = this.paginatorResumen;
    }
  }



  enviar(form: any): void {

    let lineasStr = '{"';
    let arregloLineas: { lineas: { codigo: string, subtotal: string }[] } = { lineas: [] };
    this.lineas.forEach((linea, i) => {
      if (i > 0) {
        lineasStr += ',"' + (i + 1) + '":';
      } else {
        lineasStr += i + 1 + '":';
      }
      arregloLineas.lineas.push({ codigo: linea.codigo, subtotal: linea.subtotal.toString() });
      if (linea.descuento > 0) {
        if (linea.tarifa > 1.0) {//Linea con descuento y tarifa
          //console.log("Tarifa+descuento");
          let lineaStr = this.lineaConDescuento(linea);
          lineaStr = this.lineaConImpuesto(linea, lineaStr);
          lineasStr += lineaStr;
        } else {//Linea con solo descuento
          //console.log("descuento");
          let lineaStr = this.lineaConDescuento(linea);
          lineasStr += lineaStr;
        }
      } else if (linea.tarifa > 1.0) {//Linea con solo tarifa
        //console.log("Tarifa");
        let lineaStr = this.lineaNormal(linea);
        lineaStr = this.lineaConImpuesto(linea, lineaStr);
        lineasStr += lineaStr;

      } else {//Linea solo con productos
        //console.log("Nada");
        let lineaStr = this.lineaNormal(linea);
        lineasStr += lineaStr;
      }
      lineasStr += '}';
    });
    // console.log(arregloLineas);
    lineasStr += '}';

    this.datosXML.detalles = lineasStr;

    // console.log(this.datosXML.detalles);
    let otrosCargosStr = '{"otrosCargos":[';
    this.otrosCargos.forEach((cargo, i) => {
      if (i > 0) {
        otrosCargosStr += ",";
      }
      otrosCargosStr += '{"TipoDocumento":"' + cargo.tipoDocumento + '",';
      if (cargo.tipoDocumento === '04') {
        otrosCargosStr += '"NumeroIdentidadTercero":"' + cargo.identificacion +
          '","NombreTercero":"' + cargo.nombre + '",';
      }
      otrosCargosStr += '"Detalle":"' + cargo.detalle + '", "Porcentaje":';
      otrosCargosStr += cargo.monto;
      otrosCargosStr += ', "MontoCargo":"' + cargo.total + '"';
      otrosCargosStr += '}'

    });
    otrosCargosStr += ']}';
    //console.log(otrosCargosStr);
    this.datosXML.otrosType = otrosCargosStr;

    let fecha = this.datepipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ssZZZZZ');
    if (fecha) this.datosXML.fecha_emision = fecha.toString();

    this._servicioClaveXML.crearClaveXML(this.claveXML).subscribe(
      result => {
        //console.log("CLAVE XML ", <any>result);
        this.datosXML.clave = result.resp.clave;
        this.datosXML.consecutivo = result.resp.consecutivo;
        //this._createXMLService.crearXML(this.datosXML).subscribe(
        this._createXMLService.crearXML(this.datosXML).subscribe(
          result2 => {
            //console.log("XML Creado", <any>result2);
            let xml = result2.resp.xml;
            // console.log("XML sin arreglar", xml);
            this._servicioDecodificador.decodificarXML(xml).subscribe(
              decodificado => {
                xml = decodificado.xmlDecoded;
                //console.log("xml inicial", xml);
                this._servicioEscritorXML.arreglosGenerales(xml, this.codigoActividad).subscribe(
                  arreglado => {
                    xml = arreglado.xmlFile;
                    //console.log("arreglos", xml);
                    let terminado = false;
                    this._servicioEscritorXML.addOtrosCargos(xml, this.datosXML.otrosType).subscribe(
                      xmlOtrosCargos => {
                        xml = xmlOtrosCargos.xmlFile;
                        this._servicioEscritorXML.arreglarLineas(xml, JSON.stringify(arregloLineas)).subscribe(
                          xmlFinal => {

                            xml = xmlFinal.xmlFile;
                            //console.log("lineas", xml);
                            this._servicioDecodificador.codificarXML(xml).subscribe(
                              encodedXML => {
                                xml = encodedXML.xmlencoded;
                                // console.log("xml a firmar ",xml);
                                this.signXML.inXml = xml;
                                this._signXMLService.firmarFEXML(this.signXML).subscribe(
                                  result3 => {
                                    let token = localStorage.getItem("token");
                                    if (token) {
                                      this.sendXML.token = token;
                                    } else {
                                      //console.log("Problemas de token");
                                    }
                                    this.sendXML.clave = this.datosXML.clave;
                                    this.sendXML.recp_tipoIdentificacion = this.datosXML.receptor_tipo_identif;
                                    this.sendXML.recp_numeroIdentificacion = this.datosXML.receptor_num_identif;
                                    this.sendXML.fecha = this.datosXML.fecha_emision;

                                    this.sendXML.comprobanteXml = result3.resp.xmlFirmado;
                                    // console.log(this.sendXML.comprobanteXml);
                                    this._sendXMLService.enviarFEXML(this.sendXML).subscribe(
                                      result4 => {
                                        // console.log(<any>result4);
                                        if (result4.resp.Status === 202) {
                                          // console.log("esperar");
                                          setTimeout(() => {
                                            let token = localStorage.getItem("token");
                                            this._servicioConsultas.consultarAceptacion(this.sendXML.clave, token ? token : "").subscribe(
                                              resp => {
                                                // console.log("", resp);

                                                let correo = new Correo(this.datosXML.receptor_email, "Factura electrónica " + this.datosXML.emisor_nombre,
                                                  "Se adjunta factura electrónica", "Factura " + this.datosXML.emisor_nombre + ".xml",
                                                  this.sendXML.comprobanteXml, resp.resp["respuesta-xml"], "base64");
                                                // console.log(correo);
                                                this._servicioCorreo.enviarCorreo(correo).subscribe(
                                                  res => {
                                                    // console.log("correo enviado", correo);
                                                    let fechaBD = this.datepipe.transform(fecha, "dd/MM/yyyy")
                                                    let usuario = this._servicioAutenticacion.obtenerDatosUsuario().IDUsuario;
                                                    let aceptacion;
                                                    // console.log(fecha, fechaBD);
                                                    // if(resp.resp["ind-estado"] === "rechazado") aceptacion = "3";
                                                    // else if(resp.resp["ind-estado"] === "aceptado") aceptacion = "1";
                                                    // else aceptacion = "2"
                                                    aceptacion = "1";
                                                    let documento = new Documento(this.sendXML.clave, this.sendXML.comprobanteXml,
                                                      fechaBD ? fechaBD : "", this.datosXML.receptor_nombre, "1", usuario,
                                                      aceptacion, resp.resp["respuesta-xml"]);
                                                    this._servicioUsuario.insertDocumento(documento).subscribe(estadoFinal => {
                                                      // console.log(estadoFinal);
                                                      this.toastr.success('Enviando a Hacienda', 'Factura creada');
                                                    }, errorBD => {
                                                      // console.log("error en base de datos", errorBD);
                                                      this.toastr.error('No se pudo crear la factura', 'Error');
                                                    })

                                                  },
                                                  error => {
                                                    // console.log("No se pudo enviar el correo");
                                                    this.toastr.error('No se pudo crear la factura', 'Error');
                                                  }
                                                );
                                              },
                                              error => {
                                                // console.log("error en consulta");
                                                this.toastr.error('No se pudo crear la factura', 'Error');
                                              }
                                            )
                                          }, 30000);
                                        }
                                      },
                                      error4 => {
                                        //console.log(<any>error4);
                                        this.toastr.error('No se pudo crear la factura', 'Error');
                                      }
                                    )

                                  },
                                  error3 => {
                                    //console.log(<any>error3);
                                    this.toastr.error('No se pudo crear la factura', 'Error');
                                  }
                                )
                              },
                              error => {
                                // console.log(error);
                                this.toastr.error('No se pudo crear la factura', 'Error');
                              }
                            );
                          },
                          error => {
                            // console.log(error);
                            this.toastr.error('No se pudo crear la factura', 'Error');
                          }
                        );
                      },
                      error => {
                        // console.log(error);
                        this.toastr.error('No se pudo crear la factura', 'Error');
                      }
                    )

                  },
                  error => {
                    // console.log(error);
                    this.toastr.error('No se pudo crear la factura', 'Error');
                  }
                );
              },
              error => {
                // console.log(error);
                this.toastr.error('No se pudo crear la factura', 'Error');
              }
            )

          },
          error2 => {
            //console.log(<any>error2);
            this.toastr.error('No se pudo crear la factura', 'Error');
          }
        )
      },
      error => {
        //alert(<any>error);
        //console.log(<any>error)
        this.toastr.error('No se pudo crear la factura', 'Error');
      }
    );
    //console.log(form);
  }

  cambioFecha(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.actualizarTipoCambio(event.value);
    }
  }

  actualizarTipoCambio(fecha: Date) {
    let latest_date = this.datepipe.transform(fecha, 'yyyy-MM-dd');
    //console.log(latest_date);
    let arrayfecha = [];
    if (latest_date) {
      arrayfecha = latest_date.split("-");
      this.cambio.año = arrayfecha[0];
      this.cambio.mes = arrayfecha[1];
      this.cambio.dia = arrayfecha[2];
    }
    this._servicioTipoCambio.getTipoCambio(this.cambio).subscribe(
      result => {
        //console.log("Tipo de cambio: ", <any>result)
        this.tipo_cambio = result.venta;
        this.datosXML.tipo_cambio = this.tipo_cambio.toString();
      },
      error => {
        //console.log(<any>error)
      }
    );
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

  filtroCabys(evt: string, linea: Linea) {
    linea.filtro = this._filter(evt);
  }

  nuevaLinea() {
    var control = new FormControl();
    var filtro = this._filter("");
    this.lineas.push(new Linea("", "", filtro, 1, "Sp", 5, 0, "", "01-08", false, 0, 1.13, 0, 0));
    this.dataSourceResumen.data = this.lineas;
    this.dataSourceResumen.connect().next(this.lineas);
    if (this.paginatorResumen) {
      this.paginatorResumen._changePageSize(this.paginatorResumen.pageSize);
    }
    this.setDataSourceResumenAttributes()
    //console.log(this.dataSourceResumen);
  }

  borrarLinea(index: number) {
    this.lineas.splice(index, 1)
    this.dataSourceResumen.data = this.dataSourceResumen.data;
    this.setDataSourceResumenAttributes()
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

  modificarEmisor() {
    this.copiaReceptor = this.datosXML;
    this.emisorDeshabilitado = false;
  }

  cancelarEmisor() {
    this.datosXML = this.copiaReceptor;
    this.emisorDeshabilitado = true;
  }

  guardarEmisor() {
    this.actualizarEmisor();
    this.emisorDeshabilitado = true;
  }

  guardarReceptor() {
    var persona = new Persona();
    persona.cedula = this.datosXML.receptor_num_identif;
    persona.nombre = this.datosXML.receptor_nombre;
    persona.email = this.datosXML.receptor_email;
    persona.nombreComercial = this.datosXML.receptor_nombre;
    persona.IDTipoIdentificacion = this.datosXML.receptor_tipo_identif;
    persona.IDDistrito = this.datosXML.receptor_distrito;
    persona.barrio = this.datosXML.receptor_barrio;
    persona.otrasSenas = this.otras_senas_receptor;
    persona.telefono = this.datosXML.receptor_tel;
    persona.fax = this.datosXML.receptor_fax;
    /*
        var data: object = {
          cedula: this.datosXML.receptor_num_identif,
          nombre: this.datosXML.receptor_nombre,
          email: this.datosXML.receptor_email,
          nombreComercial: this.datosXML.nombre_comercial,
          IDTipoIdentificacion: this.datosXML.receptor_tipo_identif,
          IDDistrito: this.datosXML.receptor_distrito,
          barrio: this.datosXML.receptor_barrio,
          otrasSenas: this.otras_senas_receptor,
          telefono: this.datosXML.receptor_tel,
          fax: this.datosXML.receptor_fax
        };
    */
    let cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    this._servicioUsuario.insertCliente(cedula, persona).subscribe(
      res => {
        // console.log('Actualizado', res);
        let clienteNuevo: Clientes = {
          nombre: persona.nombre,
          receptor_tipo_identif: persona.IDTipoIdentificacion, identificacion: persona.cedula,
          receptor_provincia: this.datosXML.receptor_provincia, receptor_canton: this.datosXML.receptor_canton,
          receptor_distrito: persona.IDDistrito, receptor_barrio: persona.barrio,
          receptor_cod_pais_tel: "506", receptor_tel: persona.telefono,
          receptor_cod_pais_fax: "506", receptor_fax: persona.fax,
          correo: persona.email
        }
        this.clientes.push(clienteNuevo);
        this.receptorInsertado = true;
        setTimeout(() => {
          this.receptorInsertado = false;
        }, 5000);
      },
      errorActualizar => {
        // console.log('Error al actualizar', errorActualizar);
        this.toastr.error('Error al actualizar datos', 'Error');
        this.registradoAntes = true;
        setTimeout(() => {
          this.registradoAntes = false;
        }, 5000);

      }
    );
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

  //Obtiene la informaciónd el receptor seleccionado en la table y la carga en el modelo.
  getRecord(row: any) {
    this.clienteSeleccionado = true;
    this.datosXML.receptor_nombre = row.nombre;
    this.datosXML.receptor_tipo_identif = row.receptor_tipo_identif.toString().padStart(2, "0");;
    this.datosXML.receptor_num_identif = row.identificacion;
    this.datosXML.receptor_email = row.correo;
    this.datosXML.receptor_tel = row.receptor_tel;
    this.datosXML.receptor_fax = row.receptor_fax;
    this.datosXML.receptor_provincia = row.receptor_provincia;
    this.datosXML.receptor_canton = row.receptor_canton;
    this.datosXML.receptor_barrio = row.receptor_barrio;
    this.datosXML.receptor_distrito = row.receptor_distrito.toString();


    this.ubicacionPersona(this.datosXML.receptor_distrito).then(ubicacion => {
      this.datosXML.receptor_distrito = ubicacion[0];
      this.datosXML.receptor_canton = ubicacion[1];
      this.datosXML.receptor_provincia = ubicacion[2];

      this.cargarUbicacionReceptor(this.datosXML.receptor_canton, this.datosXML.receptor_provincia);

    });
    //console.log(row);
  }

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

      this.datosXML.receptor_nombre = "";
      this.datosXML.receptor_tipo_identif = "";
      this.datosXML.receptor_num_identif = "";
      this.datosXML.receptor_email = "";
      this.datosXML.receptor_tel = "";
      this.datosXML.receptor_fax = "";
      this.datosXML.receptor_provincia = "1";
      this.datosXML.receptor_canton = "01";
      this.datosXML.receptor_barrio = "01";
      this.datosXML.receptor_distrito = "01";

    }
    //console.log(this.clienteRegistrado);

  }

  modificarReceptor() {
    this.receptorDeshabilitado = false;
  }

  //en caso de haber actualizado el receptor, toma los campos del form y lo actualiza en la base
  actualizarReceptor() {
    this.receptorDeshabilitado = true;

    var data: object = {
      cedula: this.datosXML.receptor_num_identif,
      nombre: this.datosXML.receptor_nombre,
      email: this.datosXML.receptor_email,
      nombreComercial: this.datosXML.nombre_comercial,
      IDTipoIdentificacion: this.datosXML.receptor_tipo_identif,
      IDDistrito: this.datosXML.receptor_distrito,
      barrio: this.datosXML.receptor_barrio,
      telefono: this.datosXML.receptor_tel,
      fax: this.datosXML.receptor_fax
    };


    this._servicioPersona.updatePersona(this.datosXML.receptor_num_identif, data).subscribe(
      res => {
        // console.log('Actualizado', res);
        this.receptorActualizado = true;
        setTimeout(() => {
          this.receptorActualizado = false;
        }, 5000);
      },
      errorActualizar => {
        // console.log('Error al actualizar', errorActualizar);
        this.toastr.error('Error al actualizar los datos', 'Error');
        // this._router.navigate(['**']);
      }
    );

  }

  cancelarReceptor() {
    this.receptorDeshabilitado = true;
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

  //llena los arrays privados de provincia, cantón y distrito.
  private cargarUbicaciones(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._servicioUbicacion.getProvincias().subscribe(
        provincias => {
          this.provincias = provincias;

          this._servicioUbicacion.getCantones().subscribe(
            cantones => {
              this.cantones = cantones;

              this._servicioUbicacion.getDistritos().subscribe(
                distritos => {
                  this.distritos = distritos;
                  resolve(true);
                },
                error => {
                  reject(error);
                }
              );

            },
            error => {
              reject(error);
            }
          );

        },
        error => {
          reject(error);
        }
      );
    });
  }


  //carga los cantones filtrados del receptor
  cargarCantones(codigo_provincia: any) {
    this.distritosFiltradosReceptor = [];
    this.cantonesFiltradosReceptor = [];

    this.cantonesFiltradosReceptor = this.cantones.filter(element => {
      return element.codigo_provincia == codigo_provincia;
    });
    this.cargarDistritos(this.cantonesFiltradosReceptor[0].codigo_canton);

  };

  //carga los distritos filtrados del receptor
  cargarDistritos(codigo_canton?: any) {
    codigo_canton = parseInt(codigo_canton);
    this.distritosFiltradosReceptor = this.distritos.filter(element => {
      return element.codigo_canton == codigo_canton;
    });



  };


  //carga las cantones filtrados del emisor
  cargarCantonesEmisor(codigo_provincia: any) {
    this.distritosFiltradosEmisor = [];
    this.cantonesFiltradosEmisor = [];
    this.cantonesFiltradosEmisor = this.cantones.filter(element => {
      return element.codigo_provincia == codigo_provincia;
    });
    this.cargarDistritos(this.cantonesFiltradosEmisor[0].codigo_canton);
    // console.log(this.cantonesFiltradosEmisor);

  };

  //carga los distritos filtrados del emisor
  cargarDistritosEmisor(codigo_canton?: any) {
    // console.log(codigo_canton);
    codigo_canton = parseInt(codigo_canton);
    this.distritosFiltradosEmisor = this.distritos.filter(element => {
      return element.codigo_canton == codigo_canton;
    });

    // console.log(this.cantonesFiltradosEmisor);

  };

  //carga en los dropdown de ubicacion la almacenada en la base.
  private cargarUbicacionEmisor(codigo_canton: string,
    codigo_provincia: string) {
    this.cantonesFiltradosEmisor = this.cantones.filter(element => {
      return element.codigo_provincia == codigo_provincia;
    });

    this.distritosFiltradosEmisor = this.distritos.filter(element => {
      return element.codigo_canton == codigo_canton;
    });



  }
  //carga en los dropdown de ubicacion la almacenada en la base.
  private cargarUbicacionReceptor(codigo_canton: string,
    codigo_provincia: string) {
    this.cantonesFiltradosReceptor = this.cantones.filter(element => {
      return element.codigo_provincia == codigo_provincia;
    });

    this.distritosFiltradosReceptor = this.distritos.filter(element => {
      return element.codigo_canton == codigo_canton;
    });


  }



  /*retorna los ID de ubicación (provincia, cantón, distrito) asociados a una persona*/
  private ubicacionPersona(codigo_distrito: string): Promise<any> {
    return new Promise((resolve, reject) => {
      var res: Array<any> = new Array();
      var distrito = this.distritos.filter(element => {
        return element.codigo_distrito == codigo_distrito;
      });
      var canton = this.cantones.filter(element => {
        return element.codigo_canton == distrito[0].codigo_canton;
      });
      var provincia = this.provincias.filter(element => {
        return element.codigo_provincia == canton[0].codigo_provincia;
      });
      res.push(distrito[0].codigo_distrito, canton[0].codigo_canton, provincia[0].codigo_provincia);
      resolve(res);
    });



  }

  //carga los datos del emisor en el form
  private cargarUsuario() {
    var cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    this._servicioPersona.getPersona(cedula).subscribe(result => {
      var personaResult = result.data[0];
      // console.log(personaResult);
      this.ubicacionPersona(personaResult.IDDistrito).then(ubicacion => {
        this.datosXML.emisor_distrito = ubicacion[0].toString();
        this.datosXML.emisor_canton = ubicacion[1].toString();
        this.datosXML.emisor_provincia = ubicacion[2].toString();
        this.datosXML.emisor_tipo_indetif = personaResult.IDTipoIdentificacion.toString().padStart(2, "0");
        this.sendXML.emi_tipoIdentificacion = this.datosXML.emisor_tipo_indetif;
        this.datosXML.emisor_num_identif = personaResult.cedula;
        this.datosXML.emisor_nombre = personaResult.nombre;
        this.datosXML.nombre_comercial = personaResult.nombreComercial;
        this.datosXML.emisor_email = personaResult.email;
        this.datosXML.emisor_tel = personaResult.telefono;
        this.datosXML.emisor_barrio = personaResult.barrio;
        this.datosXML.emisor_otras_senas = personaResult.otrasSenas;
        this.datosXML.emisor_fax = personaResult.fax;
        this.cargarUbicacionEmisor(this.datosXML.emisor_canton, this.datosXML.emisor_provincia);
      });

    },
      error => {
        // console.log(error);
        this.toastr.error('Error al cargar los datos', 'Error');
      });

  }

  cargarActividades() {
    let cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    this._servicioUsuario.getActividades(cedula).subscribe((res: any) => {
      // console.log(res);
      this.actividades = res.data;
      if (this.actividades) this.codigoActividad = this.actividades[0].codigo;
    }, err => {
      // console.log(err);
      this.toastr.error('Error al cargar los datos', 'Error');
    });
  }


  //actualiza el emisor en la base de datos, obteniendo los datos desde el modelo
  actualizarEmisor() {
    var data: object = {
      cedula: this.datosXML.emisor_num_identif,
      nombre: this.datosXML.emisor_nombre,
      email: this.datosXML.emisor_email,
      nombreComercial: this.datosXML.nombre_comercial,
      IDDistrito: this.datosXML.emisor_distrito,
      barrio: this.datosXML.emisor_barrio,
      otrasSenas: this.datosXML.emisor_otras_senas,
      telefono: this.datosXML.emisor_tel,
      fax: this.datosXML.emisor_fax
    };


    this._servicioPersona.updatePersona(this.datosXML.emisor_num_identif, data).subscribe(
      res => {
        // console.log('Actualizado', res);
        this.emisorGuardado = true;
        setTimeout(() => {
          this.emisorGuardado = false;
        }, 5000);
      },
      errorActualizar => {
        // console.log('Error al actualizar', errorActualizar);
        this.toastr.error('Error al actualizar los datos', 'Error');
      }
    )
  }

  cargarClientes() {
    let cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    this._servicioUsuario.getClientes(cedula).subscribe((res: any) => {
      res.data.forEach((cliente: any) => {
        let temp: Clientes = {
          nombre: cliente.nombre,
          receptor_tipo_identif: cliente.IDTipoIDentificacion,
          identificacion: cliente.cedula,
          receptor_provincia: cliente.receptor_provincia,
          receptor_canton: cliente.receptor_canton,
          receptor_distrito: cliente.IDDistrito,
          receptor_barrio: cliente.barrio,
          receptor_cod_pais_tel: "506",
          receptor_tel: cliente.telefono,
          receptor_cod_pais_fax: "506",
          receptor_fax: cliente.fax,
          correo: cliente.email
        }


        this.clientes.push(temp);
      })
      this.dataSource = new MatTableDataSource(this.clientes);
    })
  }

  private cargarTipoID() {
    this._servicioTipoIdentificacion.getTipoID().subscribe((res: any) => {
      // console.log(res);
      for (var element in res) {

        res[element].IDTipoIdentificacion = res[element].IDTipoIdentificacion.toString().padStart(2, "0");
        this.tipoIdentificaciones.push(res[element]);
      }
    },
      error => {
        this.toastr.error('Error al cargar los datos', 'Error');
        // this._router.navigate(['**']);
      })
  }

}
