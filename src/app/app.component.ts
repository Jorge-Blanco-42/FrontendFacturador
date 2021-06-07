import { Component, OnInit } from '@angular/core';
import { ServicioFirmadoXML } from './services/firmadoXML';
import { ServicioClaveXML } from './services/claveXML'
import { ServicioCreacionXML } from './services/creacionXML';
import { FirmadoXML } from './models/firmadoXML';
import { CreacionXML } from './models/creacionXML';
import { ServicioUsuario } from './services/usuario';
import { ServicioEnvioXML } from './services/envioXML';
import { ServicioClaveDebitoCredito } from './services/claveNota';
import { UsuarioCRLibre } from './models/usuarioCRLibre';
import { ServicioCertificado } from './services/certificado';
import { Certificado } from './models/certificado';
import { Token } from './models/token';
import { EnvioXML } from './models/envioXML';
import { ClaveXML } from './models/claveXML';
import { TipoCambio } from './models/tipoCambio';
import { ServicioTipoCambio } from './services/tipoCambioXML';
import { claveNotaDebitoCredito } from './models/claveNota';
import { ServicioEscritorXML } from './services/escritorXML';
import { ServicioDecodificador } from './services/decodificador';
import { LoginComponent } from "./components/login/login.component";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from './models/usuario';
import { ServicioUbicacion } from './services/ubicacion';
import { ServicioActividadEconomica } from './services/actividadEconomica';
import { ServicioDocumento } from './services/documento';
import { ServicioTipoIdentificacion } from './services/tipoIdentificacion';
import { ServicioAutenticacion } from './services/autenticacion.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ServicioFirmadoXML, ServicioCreacionXML, ServicioUsuario, ServicioCertificado,
    ServicioEnvioXML, ServicioClaveXML, ServicioTipoCambio, ServicioClaveDebitoCredito,
    ServicioEscritorXML, ServicioDecodificador, ServicioUbicacion, ServicioActividadEconomica,
    ServicioDocumento, ServicioTipoIdentificacion]
})
export class AppComponent implements OnInit {
  title = 'Facturador';

  login: boolean = false;
  public signXML: FirmadoXML;
  public createXML: CreacionXML;
  public user: UsuarioCRLibre;
  public certificate: Certificado;
  public token: Token;
  public refresh_token: string;
  public claveXML: ClaveXML;
  public isMenuCollapsed = true;
  public tipoCambio: TipoCambio;
  public devCredNote: claveNotaDebitoCredito;
  public usuarioApp!: Usuario;

  constructor(private _userService: ServicioUsuario, private _certificateService: ServicioCertificado, private _servicioClaveXML: ServicioClaveXML,
    private _exchangeRateService: ServicioTipoCambio, public dialog: MatDialog,
    private _locationService: ServicioUbicacion, private _actividadService: ServicioActividadEconomica,
    private _documentoServicio: ServicioDocumento, private _tipoIdentificacionService: ServicioTipoIdentificacion,
    private _servicioAutenticacion: ServicioAutenticacion) {

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

    this.user = new UsuarioCRLibre("users", "users_log_me_in", "jorgeBlanco", "426819357");
    this.certificate = new Certificado("", "", "", "", "");
    this.refresh_token = "";
    this.token = new Token("", "", "", "", "", "", "", "");
    this.claveXML = new ClaveXML("clave", "clave", "fisico", "117510169", "normal", "506", "1234567890", "81726354", "FE");
    this.tipoCambio = new TipoCambio();
    this.devCredNote = new claveNotaDebitoCredito("clave", "clave", "fisico", "702320717", "506", "1522773402", "normal", "07756342", "ND");
  }


  ngOnInit() {
    this.login = this._servicioAutenticacion.isLoggedIn();
    let cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    if (this.login) {
      this._certificateService.getCertificado(cedula).subscribe(
        result => {
          this.certificate = result[0];
          if(this.certificate)this.getToken(this.certificate);
        },
        error => {
          //alert(<any>error);
          console.log(<any>error)
        });
    }

    /*
    this.getUsuario('117310836');
    this.updateUsuario('117310836', {password : '12345fdfdc678'});
    this.deleteUsuario('117310836');
    this.insertUser('holisdsdd', '117310836');
   

    
    this.getProvincias();
    this.getCantones();
    this.getDistritos();
    

    this.getActividadEconomica();
    
    this.getDocumentos('1');
    */

    this.getTipoID();

  }

  getToken(certificate: Certificado) {
    this._certificateService.getToken(certificate).subscribe(
      result => {
        console.log("This is the token: ", result);
        this.token = result.resp;
        localStorage.setItem("token", this.token.access_token);
        localStorage.setItem("refresh", this.token.refresh_token);
        setInterval(() => {
          let refresh = localStorage.getItem("refresh");
          if (refresh && refresh !== "undefined") {
            this.refreshToken(refresh);
          } else {
            this._certificateService.getToken(certificate).subscribe(
              result => {
                console.log("This is the token: ", result);
                this.token = result.resp;
                localStorage.setItem("token", this.token.access_token);
                localStorage.setItem("refresh", this.token.refresh_token);
              },
              err => {
                console.log(<any>err)
              });
          }

        }, 290000);
      },
      error => {
        console.log(<any>error)
      }
    );
  }

  refreshToken(refresh: string) {
    console.log("refreshing with", refresh);
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

  crearClave() {
    this._servicioClaveXML.crearClaveXML(this.claveXML).subscribe(
      result => {
        console.log("Clave de XML: ", <any>result);
      },
      error => {
        console.log(<any>error)
      }
    );
  }

  getTipoCambio(dia: string = "", mes: string = "", año: string = "") {

    this.tipoCambio.dia = dia;
    this.tipoCambio.mes = mes;
    this.tipoCambio.año = año;
    this._exchangeRateService.getTipoCambio(this.tipoCambio).subscribe(
      result => {
        console.log("Tipo de cambio: ", <any>result);
      },
      error => {
        console.log(<any>error);
      }
    )

  }

  openLogin(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '80%',
      height: '80%',
      data:true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.login = result
    });
  }

  cerrarSesion() {
    this.login = false;
    this._servicioAutenticacion.logout()

  }

  insertUser(password: string, cedula: string) {
    this.usuarioApp.password = password;
    this.usuarioApp.cedula = cedula;
    this._userService.insertUsuario(this.usuarioApp).subscribe(
      res => {
        console.log('Insertion was successful!', res);
      },
      error => {
        console.log('Error!!!!', error);
      }
    );

  }

  getUsuario(cedula: string) {
    this._userService.getUsuario(cedula).subscribe(
      res => {
        console.log('Get was successful ', res);
      },
      error => {
        console.log('Error!!!!', error);
      }
    )
  }

  updateUsuario(cedula: string, newData: object) {
    this._userService.updateUsuario(cedula, newData).subscribe(
      res => {
        console.log('Update was successful', res);
      },
      error => {
        console.log('Error!!!!', error);
      }
    );
  }

  deleteUsuario(cedula: string) {
    this._userService.deleteUsuario(cedula).subscribe(
      res => {
        console.log('Delete was successful', res);
      },
      error => {
        console.log('Error!!!!', error);
      }
    );
  }

  getProvincias() {
    this._locationService.getProvincias().subscribe(
      res => {
        console.log('GetProvincias was successful ', res);
      },
      error => {
        console.log('Error!!!!', error);
      }
    );
  }

  getCantones() {
    this._locationService.getCantones().subscribe(
      res => {
        console.log('GetCantones was successful ', res);
      },
      error => {
        console.log('Error!!!!', error);
      }
    );
  }

  getDistritos() {
    this._locationService.getDistritos().subscribe(
      res => {
        console.log('GetDistritos was successful ', res);
      },
      error => {
        console.log('Error!!!!', error);
      }
    );
  }

  getActividadEconomica() {
    this._actividadService.getActividadEconomica().subscribe(
      res => {
        console.log('getActividadEconomica was successful ', res);
      },
      error => {
        console.log('Error!!!!', error);
      }
    );
  }

  getDocumentos(id: string) {
    this._documentoServicio.getDocumentos(id).subscribe(
      res => {
        console.log('getDocumentos was successful ', res);
      },
      error => {
        console.log('Error!!!!', error);
      }
    );
  }

  getTipoID() {
    this._tipoIdentificacionService.getTipoID().subscribe(
      res => {
        console.log('getTipoID was successful ', res);
      },
      error => {
        console.log('Error!!!!', error);
      }
    );
  }



}

