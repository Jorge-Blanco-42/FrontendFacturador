import { Component, OnInit } from '@angular/core';
import { SignXMLService } from './services/signxml';
import { CreateXMLService } from './services/createXML'
import { SignXML } from './models/signxml';
import { CreateXML } from './models/createXML'
import { UserService } from './services/user';
import { User } from './models/user';
import { CertificateService } from './services/certificate';
import { Certificate } from './models/certificate';
import { Token } from './models/token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SignXMLService, CreateXMLService, UserService, CertificateService]
})
export class AppComponent implements OnInit {
  title = 'Facturador';

  public signXML: SignXML;
  public createXML: CreateXML;
  public user: User;
  public certificate: Certificate;
  public token: Token;
  public refresh_token: string;

  constructor(private _signXMLService: SignXMLService, private _createXMLService: CreateXMLService,
    private _userService: UserService, private _certificateService: CertificateService) {

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
  }


  ngOnInit() {
    this._certificateService.getCertificate("4").subscribe(
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

  }

  getToken(certificate: Certificate) {
    this._certificateService.getToken(certificate).subscribe(
      result => {
        console.log("This is the token: ", result);
        this.token = result.resp;
        this.refreshToken(this.token.refresh_token);
        setInterval(()=>{
          this.refreshToken(this.token.refresh_token);
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
      },
      error => {
        console.log(<any>error)
      }
    );
  }


}

