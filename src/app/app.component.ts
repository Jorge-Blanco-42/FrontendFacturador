import { Component, OnInit } from '@angular/core';
import { SignXMLService } from './services/signxml';
import { ServicioClaveXML } from './services/claveXML'
import { CreateXMLService } from './services/createXML';
import { SignXML } from './models/signxml';
import { CreateXML } from './models/createXML';
import { UserService } from './services/user';
import { SendXMLService } from './services/sendXML';
import { User } from './models/user';
import { CertificateService } from './services/certificate';
import { Certificate } from './models/certificate';
import { Token } from './models/token';
import { SendXML } from './models/sendXML';
import { ClaveXML } from './models/claveXML'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SignXMLService, CreateXMLService, UserService, CertificateService, SendXMLService, ServicioClaveXML]
})
export class AppComponent implements OnInit {
  title = 'Facturador';

  public signXML: SignXML;
  public createXML: CreateXML;
  public user: User;
  public certificate: Certificate;
  public token: Token;
  public refresh_token: string;
  public claveXML: ClaveXML;
  //public sendXML: SendXML; 

  constructor(private _signXMLService: SignXMLService, private _createXMLService: CreateXMLService,
    private _userService: UserService, private _certificateService: CertificateService, private _sendXMLService: SendXMLService, private _servicioClaveXML: ServicioClaveXML) {

    this.signXML = new SignXML("signXML", "signFE",
      "b337c43a00ec8b0ed9882375d56b270f", "pendiente",
      "1994", "FE");

    var linea = { "1": { "cantidad": "1", "unidadMedida": "Sp", "detalle": "Impresora", "precioUnitario": "10000", "montoTotal": "10000", "subtotal": "9900", "montoTotalLinea": "9900", "montoDescuento": "100", "naturalezaDescuento": "Pronto pago" }, "2": { "cantidad": "1", "unidadMedida": "Unid", "detalle": "producto", "precioUnitario": "10000", "montoTotal": "10000", "subtotal": "10000", "montoTotalLinea": "11170", "impuesto": { "1": { "codigo": "01", "tarifa": "11.7", "monto": "1170" } } } }

    var lineaStr = JSON.stringify(linea)
    this.createXML = new CreateXML("genXML", "gen_xml_fe", "50617061800070232071700100001011522773451107756391",
      "00100001011522773451", "2018-06-17T12:00:00-06:00", "Walner Borbon", "01", "702320717", "Walner Borbon",
      "6", "02", "03", "01", "En la jungla", "506", "64206205", "506", "00000000", "walner1borbon@gmail.com", "Walner Borbon",
      "01", "702320717", "6", "02", "03", "01", "506", "84922891", "506", "00000000", "walner.borbon@hotmail.com",
      "01", "0", "01", "CRC", "569.48", "0", "10000", "10000", "0", "10000", "10000", "20000", "100", "19900", "1170", "21070",
      "Jiji", "Bichota", lineaStr, 'False')

    this.user = new User("users", "users_log_me_in", "jorgeBlanco", "426819357");
    this.certificate = new Certificate("", "", "", "", "");
    this.refresh_token = "";
    this.token = new Token("","","","","","","","");
    this.claveXML = new ClaveXML("clave", "clave", "fisico", "117510169", "normal", "506", "1234567890", "81726354", "FE");
    
  }


  ngOnInit() {
    localStorage.removeItem("roken");
    localStorage.removeItem("refresh");
    this._certificateService.getCertificate("1").subscribe(
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
    this.crearClave();

  }

  getToken(certificate: Certificate) {
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
    this._certificateService.refreshToken(refresh).subscribe(
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

}

