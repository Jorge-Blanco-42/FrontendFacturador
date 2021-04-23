import { Component, OnInit } from '@angular/core';
import { ServicioFirmadoXML } from './services/firmadoXML';
import { ServicioClaveXML } from './services/claveXML'
import { ServicioCreacionXML } from './services/creacionXML';
import { FirmadoXML } from './models/firmadoXML';
import { CreacionXML } from './models/creacionXML';
import { ServicioUsuario } from './services/usuario';
import { ServicioEnvioXML } from './services/envioXML';
import { Usuario } from './models/usuario';
import { ServicioCertificado } from './services/certificado';
import { Certificado } from './models/certificado';
import { Token } from './models/token';
import { EnvioXML } from './models/envioXML';
import { ClaveXML } from './models/claveXML';
import {TipoCambio} from './models/tipoCambio';
import {ServicioTipoCambio} from './services/tipoCambioXML';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ServicioFirmadoXML, ServicioCreacionXML, ServicioUsuario, ServicioCertificado, ServicioEnvioXML, ServicioClaveXML, ServicioTipoCambio]
})
export class AppComponent implements OnInit {
  title = 'Facturador';

  public signXML: FirmadoXML;
  public createXML: CreacionXML;
  public user: Usuario;
  public certificate: Certificado;
  public token: Token;
  public refresh_token: string;
  public claveXML: ClaveXML;
  public isMenuCollapsed = true;
  public tipoCambio: TipoCambio;
  //public sendXML: EnvioXML; 

  constructor(private _signXMLService: ServicioFirmadoXML, private _createXMLService: ServicioCreacionXML,
    private _userService: ServicioUsuario, private _certificateService: ServicioCertificado, private _sendXMLService: ServicioEnvioXML, private _servicioClaveXML: ServicioClaveXML,
    private _exchangeRateService: ServicioTipoCambio) {

    this.signXML = new FirmadoXML("signXML", "signFE",
      "b337c43a00ec8b0ed9882375d56b270f", "pendiente",
      "1994", "FE");

    var linea = { "1": { "cantidad": "1", "unidadMedida": "Sp", "detalle": "Impresora", "precioUnitario": "10000", "montoTotal": "10000", "subtotal": "9900", "montoTotalLinea": "9900", "montoDescuento": "100", "naturalezaDescuento": "Pronto pago" }, "2": { "cantidad": "1", "unidadMedida": "Unid", "detalle": "producto", "precioUnitario": "10000", "montoTotal": "10000", "subtotal": "10000", "montoTotalLinea": "11170", "impuesto": { "1": { "codigo": "01", "tarifa": "11.7", "monto": "1170" } } } }

    var lineaStr = JSON.stringify(linea)
    this.createXML = new CreacionXML("genXML", "gen_xml_fe", "50617061800070232071700100001011522773451107756391",
      "00100001011522773451", "2021-04-18T00:50:00-06:00", "Walner Borbon", "01", "702320717", "Walner Borbon",
      "6", "02", "03", "01", "En la jungla", "506", "64206205", "506", "00000000", "walner1borbon@gmail.com", "Walner Borbon",
      "01", "702320717", "6", "02", "03", "01", "506", "84922891", "506", "00000000", "walner.borbon@hotmail.com",
      "01", "0", "01", "CRC", "569.48", "0", "10000", "10000", "0", "10000", "10000", "20000", "100", "19900", "1170", "21070",
      "Jiji", "Bichota", lineaStr, 'False')

    this.user = new Usuario("users", "users_log_me_in", "jorgeBlanco", "426819357");
    this.certificate = new Certificado("", "", "", "", "");
    this.refresh_token = "";
    this.token = new Token("","","","","","","","");
    this.claveXML = new ClaveXML("clave", "clave", "fisico", "117510169", "normal", "506", "1234567890", "81726354", "FE");
    this.tipoCambio = new TipoCambio();
  }


  ngOnInit() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    this._certificateService.getCertificado("1").subscribe(
      result => {
        console.log("This is the certificate: ", <any>result)
        this.certificate = result;
        console. log(this.certificate);
        this.getToken(this.certificate);
      },
      error => {
        //alert(<any>error);
        console.log(<any>error)
      }
    );
    /*
    this.crearClave();
    this._createXMLService.crearXML(this.createXML).subscribe(
      result =>{
        console.log("XML", <any>result);
      },
      error =>{
        console.log(<any>error);
      }
    )*/
    //this.getTipoCambio('11', '02', '2007');

  }

  getToken(certificate: Certificado) {
    this._certificateService.getToken(certificate).subscribe(
      result => {
        console.log("This is the token: ", result);
        this.token = result.resp;
        localStorage.setItem("token", this.token.refresh_token);
        localStorage.setItem("refresh", this.token.access_token);
        /*this.sendXML.token = this.token.access_token;
        this._sendXMLService.sendFEXML(this.sendXML).subscribe(
          result => {
            console.log("This is the answer: ",<any>result)
          },
          error =>{
            console.log(<any>error)
          }
        );*/
        setInterval(()=>{
          let refresh = localStorage.getItem("refresh");
          if(refresh){
            this.refreshToken(refresh);
          }
          
     }, 290000);
      },
      error => {
        console.log(<any>error)
      }
    );
  }

  refreshToken(refresh: string){
    console.log("refreshing with",refresh);
    this._certificateService.refrescarToken(refresh).subscribe(
      result => {
        console.log("This is the refresh: ", <any>result);
        this.token = result.resp;
        localStorage.setItem("token", this.token.refresh_token);
        localStorage.setItem("refresh", this.token.access_token);
      },
      error => {
        console.log(<any>error)
      }
    );
  }

  crearClave(){
    this._servicioClaveXML.crearClaveXML(this.claveXML).subscribe(
      result => {
        console.log("Clave de XML: ", <any>result);
      },
      error => {
        console.log(<any>error)
      }
    );
  }

  getTipoCambio(dia: string = "", mes: string = "", año: string = ""){
    
    this.tipoCambio.dia = dia;
    this.tipoCambio.mes = mes;
    this.tipoCambio.año = año;
    this._exchangeRateService.getTipoCambio(this.tipoCambio).subscribe(
      result => {
        console.log("Tipo de cambio: ", <any> result);
      },
      error => {
        console.log(<any> error);
      }
    )

  }

}

