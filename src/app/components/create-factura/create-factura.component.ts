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
import { FormBuilder, FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Linea } from 'src/app/models/linea';
import { OtroCargo } from 'src/app/models/otroCargo';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild, AfterViewInit } from '@angular/core';
import { ServicioCorreo } from 'src/app/services/correo';
import { Correo } from 'src/app/models/correo';
import { ServicioEscritorXML } from 'src/app/services/escritorXML';

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
  providers: [DatePipe, ServicioTipoCambio, ServicioCaByS, ServicioDecodificador,
    ServicioCorreo, ServicioEscritorXML]
})
export class CreateFacturaComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['busquedaNombreCliente', 'busquedaIdentificacionCliente', 'busquedaCorreoCliente'];
  displayedColumnsResumen: string[] = ['productoLinea', 'cantidadProductoLinea', 'totalLinea'];
  private paginator: MatPaginator | undefined;

  public isCollapsedEmisorData: boolean = true;
  public isCollapsedReceptorData: boolean = true;
  public isCollapsedResumenData: boolean = true;
  public emisorDeshabilitado: boolean = true;
  public receptorDeshabilitado: boolean = true;
  public clienteRegistrado: boolean = true;
  clienteSeleccionado: boolean = false;
  receptorDatosImportantes: boolean = true;

  public radioCliente: number = 0;
  public total_OtrosCargos: number;
  public tipo_cambio: Number;

  public impuestoTarifa: Map<string, number>;
  public cambio: TipoCambio;

  public maxDate = new Date();
  cabys: { impuesto: string, descripcion: string, codigoBienServicio: string }[] = [];
  public lineasJSON: {}[] = [];

  public datosXML: CreacionXML;
  public datosXML2: CreacionXML;
  public lineas: Linea[] = [];
  public otrosCargos: OtroCargo[] = [];
  claveXML: ClaveXML;
  signXML: FirmadoXML;
  sendXML: EnvioXML;
  

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSourceResumen: MatTableDataSource<Linea> = new MatTableDataSource(this.lineas);

  constructor(public datepipe: DatePipe, private _servicioTipoCambio: ServicioTipoCambio, private _servicioCaByS: ServicioCaByS,
    private _signXMLService: ServicioFirmadoXML, private _createXMLService: ServicioCreacionXML,
    private _sendXMLService: ServicioEnvioXML, private _servicioClaveXML: ServicioClaveXML, private _servicioDecodificador: ServicioDecodificador,
    private _servicioCorreo: ServicioCorreo, private _servicioEscritorXML: ServicioEscritorXML) {
    this.claveXML = new ClaveXML("clave", "clave", "fisico", "117510169", "normal", "506", "0100012364",
      "98762250", "FE");

    this.datosXML2 = new CreacionXML("genXML", "gen_xml_fe", "",
      "", "2021-04-18T00:54:00-06:00", "Jorge Luis Blanco Cordero", "01", "117510169", "Jorge Luis Blanco Cordero",
      "6", "02", "03", "01", "En la jungla", "506", "86153313", "506", "00000000", "jorge.luis1999@hotmail.com", "Walner Borbon",
      "01", "702320717", "6", "02", "03", "01", "506", "84922891", "506", "00000000", "walner.borbon@hotmail.com",
      "01", "0", "01", "CRC", "569.48", "0", "10000", "10000", "0", "10000", "10000", "20000", "100", "19900", "1170", "21070",
      "Jiji", "Bichota", "", 'False')

    this.datosXML = new CreacionXML("genXML", "gen_xml_fe", "", "", new Date().toString(),
      "Rodolfo de Jesus Mora Zamora", "01", "113160737", "n/a",
      "1", "10", "04", "04", "Mi casa", "506", "86153313",
      "506", "00000000", "jorgeblanco@estudiantec.cr", "", "", "",
      "", "", "", "", "506", "", "506", "", "", "01", "0", "01", "CRC",
      "", "", "", "", "", "", "", "", "", "", "", "", "nada", "nada", "", "False");

    this.signXML = new FirmadoXML("signXML", "signFE", "67d23a034ddf5991e5a8e9a72e708f4c", "",
      "2021", "FE");

    this.sendXML = new EnvioXML("send", "json", "",
      "", "", "01",
      "117510169", "", "", "", "api-stag");

    this.cambio = new TipoCambio("", "", "");
    this.tipo_cambio = 0;
    this.impuestoTarifa = new Map();
    this.total_OtrosCargos = 0;


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
    console.log(arregloLineas);
    lineasStr += '}';

    this.datosXML.detalles = lineasStr;    
    
    console.log(this.datosXML.detalles);
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
    if (otrosCargosStr !== '{"otrosCargos":[]}') {
      this.datosXML.otrosType = otrosCargosStr;
    }

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
            this._servicioDecodificador.decodificarXML(xml).subscribe(
              decodificado => {
                xml = decodificado.xmlDecoded;
                //console.log("xml inicial", xml);
                this._servicioEscritorXML.arreglosGenerales(xml, "12345").subscribe(
                  arreglado => {
                    xml = arreglado.xmlFile;
                    //console.log("arreglos", xml);
                    if (otrosCargosStr !== '{"otrosCargos":[]}') {
                      this._servicioEscritorXML.addOtrosCargos(xml, this.datosXML.otrosType).subscribe(
                        xmlOtrosCargos => {
                          xml = xmlOtrosCargos.xmlFile;
                          //console.log("otros cargos", xml);
                        },
                        error => {
                          console.log(error);
                        }
                      )
                    }
                    this._servicioEscritorXML.arreglarLineas(xml, JSON.stringify(arregloLineas)).subscribe(
                      xmlFinal => {

                        xml = xmlFinal.xmlFile;
                        //console.log("lineas", xml);
                        this._servicioDecodificador.codificarXML(xml).subscribe(
                          encodedXML => {
                            xml = encodedXML.xmlencoded;
                            this.signXML.inXml = xml;
                            this._signXMLService.firmarFEXML(this.signXML).subscribe(
                              result3 => {
                                console.log("XML FIRMADO", <any>result3);
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
                                this._sendXMLService.enviarFEXML(this.sendXML).subscribe(
                                  result4 => {
                                    //console.log(<any>result4);
                                    console.log(this.sendXML.comprobanteXml);
                                    if (result4.resp.Status === 202) {
                                      let correo = new Correo(this.datosXML.receptor_email, "Factura electrónica " + this.datosXML.emisor_nombre,
                                        "Se adjunta factura electrónica", "Factura " + this.datosXML.emisor_nombre + ".xml",
                                        this.sendXML.comprobanteXml, "base64");
                                      this._servicioCorreo.enviarCorreo(correo).subscribe(
                                        res => {
                                          console.log("correo enviado", correo);
                                        },
                                        error => {
                                          console.log("No se pudo enviar el correo");
                                        }
                                      );
                                    }
                                  },
                                  error4 => {
                                    //console.log(<any>error4);
                                  }
                                )

                              },
                              error3 => {
                                //console.log(<any>error3);
                              }
                            )
                          },
                          error => {
                            console.log(error);
                          }
                        );
                      },
                      error => {
                        console.log(error);
                      }
                    );
                  },
                  error => {
                    console.log(error);
                  }
                );
              },
              error => {
                console.log(error);
              }
            )

          },
          error2 => {
            //console.log(<any>error2);
          }
        )
      },
      error => {
        //alert(<any>error);
        //console.log(<any>error)
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
      //console.log("caca")
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
    this.emisorDeshabilitado = false;
  }

  cancelarEmisor() {
    this.emisorDeshabilitado = true;
  }

  guardarEmisor() {
    //console.log("PENDIENTE")
  }

  guardarReceptor() {
    //console.log("PENDIENTE")
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

  actualizarReceptor() {
    this.receptorDeshabilitado = true;
  }

  cancelarReceptor() {
    this.receptorDeshabilitado = true;
  }

  lineaNormal(linea: Linea): string {
    let producto = linea.producto.replace(replacer,"&quot;");
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

}
