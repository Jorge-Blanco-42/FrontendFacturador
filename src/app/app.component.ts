import { Component, OnInit } from '@angular/core';
import { ServicioFirmadoXML } from './services/firmadoXML';
import { ServicioClaveXML } from './services/claveXML'
import { ServicioCreacionXML } from './services/creacionXML';
import { FirmadoXML } from './models/firmadoXML';
import { CreacionXML } from './models/creacionXML';
import { ServicioUsuario } from './services/usuario';
import { ServicioEnvioXML } from './services/envioXML';
import { ServicioClaveDebitoCredito} from './services/claveNotaDebitoCredito';
import { ServicioFirmadoXMLNDNC } from './services/firmadoXMLNDNC';
import { Usuario } from './models/usuario';
import { ServicioCertificado } from './services/certificado';
import { Certificado } from './models/certificado';
import { Token } from './models/token';
import { EnvioXML } from './models/envioXML';
import { ClaveXML } from './models/claveXML';
import { TipoCambio } from './models/tipoCambio';
import { ServicioTipoCambio } from './services/tipoCambioXML';
import { notaDebitoCredito } from './models/notaDebitoCredito';
import { firmadoXMLNDNC } from './models/firmadoXMLNDNC';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ServicioFirmadoXML, ServicioCreacionXML, ServicioUsuario, ServicioCertificado, ServicioEnvioXML, ServicioClaveXML, ServicioTipoCambio, ServicioClaveDebitoCredito, ServicioFirmadoXMLNDNC]
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
  public devCredNote: notaDebitoCredito; 
  public signXMLCNDC: firmadoXMLNDNC;
  //public sendXML: EnvioXML; 

  constructor(private _signXMLService: ServicioFirmadoXML, private _createXMLService: ServicioCreacionXML,
    private _userService: ServicioUsuario, private _certificateService: ServicioCertificado, private _sendXMLService: ServicioEnvioXML, private _servicioClaveXML: ServicioClaveXML,
    private _exchangeRateService: ServicioTipoCambio, private _devCredNoteService: ServicioClaveDebitoCredito, private _signXMLCNDCService: ServicioFirmadoXMLNDNC) {

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
    this.devCredNote = new notaDebitoCredito("clave", "clave", "fisico","702320717" ,"506", "1522773402", "normal", "07756342", "ND");
    this.signXMLCNDC = new firmadoXMLNDNC("signXML", "signFE", "67d23a034ddf5991e5a8e9a72e708f4c", "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCiAgICA8RmFjdHVyYUVsZWN0cm9uaWNhIHhtbG5zPSJodHRwczovL3RyaWJ1bmV0LmhhY2llbmRhLmdvLmNyL2RvY3MvZXNxdWVtYXMvMjAxNy92NC4yL2ZhY3R1cmFFbGVjdHJvbmljYSIgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiIHhtbG5zOnhzZD0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTpzY2hlbWFMb2NhdGlvbj0iaHR0cHM6Ly90cmlidW5ldC5oYWNpZW5kYS5nby5jci9kb2NzL2VzcXVlbWFzLzIwMTcvdjQuMi9mYWN0dXJhRWxlY3Ryb25pY2EgRmFjdHVyYUVsZWN0cm9uaWNhX1YuNC4yLnhzZCI+DQogICAgICAgIDxDbGF2ZT41MDYyMTA0MjEwMDAxMTc1MTAxNjkwMDEwMDAwMTAxMDEwMDAxMjM1NzE5ODc2MjI0MzwvQ2xhdmU+DQogICAgICAgIDxOdW1lcm9Db25zZWN1dGl2bz4wMDEwMDAwMTAxMDEwMDAxMjM1NzwvTnVtZXJvQ29uc2VjdXRpdm8+DQogICAgICAgIDxGZWNoYUVtaXNpb24+MjAyMS0wNC0yMVQxNzozODowMC0wNjowMDwvRmVjaGFFbWlzaW9uPg0KICAgICAgICA8RW1pc29yPg0KICAgICAgICAgICAgPE5vbWJyZT5Sb2RvbGZvIGRlIEplc3VzIE1vcmEgWmFtb3JhPC9Ob21icmU+DQogICAgICAgICAgICA8SWRlbnRpZmljYWNpb24+DQogICAgICAgICAgICAgICAgPFRpcG8+MDE8L1RpcG8+DQogICAgICAgICAgICAgICAgPE51bWVybz4xMTMxNjA3Mzc8L051bWVybz4NCiAgICAgICAgICAgIDwvSWRlbnRpZmljYWNpb24+DQogICAgICAgICAgICA8Tm9tYnJlQ29tZXJjaWFsPm5hPC9Ob21icmVDb21lcmNpYWw+DQogICAgICAgICAgICA8VWJpY2FjaW9uPg0KICAgICAgICAgICAgICAgIDxQcm92aW5jaWE+NjwvUHJvdmluY2lhPg0KICAgICAgICAgICAgICAgIDxDYW50b24+MDI8L0NhbnRvbj4NCiAgICAgICAgICAgICAgICA8RGlzdHJpdG8+MDM8L0Rpc3RyaXRvPg0KICAgICAgICAgICAgICAgIDxCYXJyaW8+MDE8L0JhcnJpbz4NCiAgICAgICAgICAgICAgICA8T3RyYXNTZW5hcz5raWtpa2k8L090cmFzU2VuYXM+DQogICAgICAgICAgICA8L1ViaWNhY2lvbj4NCiAgICAgICAgICAgIDxUZWxlZm9ubz4NCiAgICAgICAgICAgICAgICA8Q29kaWdvUGFpcz41MDY8L0NvZGlnb1BhaXM+DQogICAgICAgICAgICAgICAgPE51bVRlbGVmb25vPjg2MTUzMzEzPC9OdW1UZWxlZm9ubz4NCiAgICAgICAgICAgIDwvVGVsZWZvbm8+DQogICAgICAgICAgICA8RmF4Pg0KICAgICAgICAgICAgICAgIDxDb2RpZ29QYWlzPjUwNjwvQ29kaWdvUGFpcz4NCiAgICAgICAgICAgICAgICA8TnVtVGVsZWZvbm8+MDAwMDAwMDA8L051bVRlbGVmb25vPg0KICAgICAgICAgICAgPC9GYXg+PENvcnJlb0VsZWN0cm9uaWNvPmpvcmdlLmx1aXMxOTk5QGhvdG1haWwuY29tPC9Db3JyZW9FbGVjdHJvbmljbz4NCiAgICAgICAgPC9FbWlzb3I+PFJlY2VwdG9yPg0KICAgICAgICAgICAgPE5vbWJyZT5KdWxpYW4gU3ViaXJvczwvTm9tYnJlPjxJZGVudGlmaWNhY2lvbj4NCiAgICAgICAgICAgICAgICA8VGlwbz4wMTwvVGlwbz4NCiAgICAgICAgICAgICAgICA8TnVtZXJvPjExNDQ4MDc5MDwvTnVtZXJvPg0KICAgICAgICAgICAgPC9JZGVudGlmaWNhY2lvbj48VGVsZWZvbm8+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29kaWdvUGFpcz41MDY8L0NvZGlnb1BhaXM+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TnVtVGVsZWZvbm8+ODQ5MjI4OTE8L051bVRlbGVmb25vPg0KICAgICAgICAgICAgICAgICAgICA8L1RlbGVmb25vPjxGYXg+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29kaWdvUGFpcz41MDY8L0NvZGlnb1BhaXM+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxOdW1UZWxlZm9ubz4wMDAwMDAwMDwvTnVtVGVsZWZvbm8+DQogICAgICAgICAgICAgICAgICAgIDwvRmF4Pg0KICAgICAgICAgICAgPENvcnJlb0VsZWN0cm9uaWNvPmp1bGlzdWJpcm9zQGhvdG1haWwuY29tPC9Db3JyZW9FbGVjdHJvbmljbz4NCiAgICAgICAgPC9SZWNlcHRvcj4NCiAgICAgICAgPENvbmRpY2lvblZlbnRhPjAxPC9Db25kaWNpb25WZW50YT4NCiAgICAgICAgPFBsYXpvQ3JlZGl0bz4wPC9QbGF6b0NyZWRpdG8+DQogICAgICAgIDxNZWRpb1BhZ28+MDE8L01lZGlvUGFnbz4NCiAgICAgICAgPERldGFsbGVTZXJ2aWNpbz4NCiAgICAgICAgPC9EZXRhbGxlU2VydmljaW8+DQogICAgICAgIDxSZXN1bWVuRmFjdHVyYT4NCiAgICAgICAgPENvZGlnb01vbmVkYT5DUkM8L0NvZGlnb01vbmVkYT4NCiAgICAgICAgPFRpcG9DYW1iaW8+NTY0LjQ4PC9UaXBvQ2FtYmlvPg0KICAgICAgICA8VG90YWxTZXJ2R3JhdmFkb3M+MDwvVG90YWxTZXJ2R3JhdmFkb3M+DQogICAgICAgIDxUb3RhbFNlcnZFeGVudG9zPjEwMDAwPC9Ub3RhbFNlcnZFeGVudG9zPg0KICAgICAgICA8VG90YWxNZXJjYW5jaWFzR3JhdmFkYXM+MTAwMDA8L1RvdGFsTWVyY2FuY2lhc0dyYXZhZGFzPg0KICAgICAgICA8VG90YWxNZXJjYW5jaWFzRXhlbnRhcz4wPC9Ub3RhbE1lcmNhbmNpYXNFeGVudGFzPg0KICAgICAgICA8VG90YWxHcmF2YWRvPjEwMDAwPC9Ub3RhbEdyYXZhZG8+DQogICAgICAgIDxUb3RhbEV4ZW50bz4xMDAwMDwvVG90YWxFeGVudG8+DQogICAgICAgIDxUb3RhbFZlbnRhPjIwMDAwMDwvVG90YWxWZW50YT4NCiAgICAgICAgPFRvdGFsRGVzY3VlbnRvcz4xMDA8L1RvdGFsRGVzY3VlbnRvcz4NCiAgICAgICAgPFRvdGFsVmVudGFOZXRhPjE5OTAwPC9Ub3RhbFZlbnRhTmV0YT4NCiAgICAgICAgPFRvdGFsSW1wdWVzdG8+MTE3MDwvVG90YWxJbXB1ZXN0bz4NCiAgICAgICAgPFRvdGFsQ29tcHJvYmFudGU+MjEwNzA8L1RvdGFsQ29tcHJvYmFudGU+DQogICAgICAgIDwvUmVzdW1lbkZhY3R1cmE+DQogICAgICAgIDxOb3JtYXRpdmE+DQogICAgICAgIDxOdW1lcm9SZXNvbHVjaW9uPkRHVC1SLTQ4LTIwMTY8L051bWVyb1Jlc29sdWNpb24+DQogICAgICAgIDxGZWNoYVJlc29sdWNpb24+MDctMTAtMjAxNiAwODowMDowMDwvRmVjaGFSZXNvbHVjaW9uPg0KICAgICAgICA8L05vcm1hdGl2YT4NCiAgICA8L0ZhY3R1cmFFbGVjdHJvbmljYT4=", "2021", "NC");
  }


  ngOnInit() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    this._certificateService.getCertificado("1").subscribe(
      result => {
        this.certificate = result;
        this.getToken(this.certificate);
      },
      error => {
        //alert(<any>error);
        console.log(<any>error)
      },  
    );
  }

  getToken(certificate: Certificado) {
    this._certificateService.getToken(certificate).subscribe(
      result => {
        console.log("This is the token: ", result);
        this.token = result.resp;
        localStorage.setItem("token", this.token.access_token);
        localStorage.setItem("refresh", this.token.refresh_token);
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
        localStorage.setItem("token", this.token.access_token);
        localStorage.setItem("refresh", this.token.refresh_token);
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

  getTipoCambio(dia: string = "", mes: string = "", año: string = ""): any{
    
    this.tipoCambio.dia = dia;
    this.tipoCambio.mes = mes;
    this.tipoCambio.año = año;
    this._exchangeRateService.getTipoCambio(this.tipoCambio).subscribe(
      result => {
        console.log("Tipo de cambio: ", <any> result);
        return result;
      },
      error => {
        console.log(<any> error);
      }
    )

  }

}

