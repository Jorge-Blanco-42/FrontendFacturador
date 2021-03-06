import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Certificado } from 'src/app/models/certificado';
import { UsuarioCRLibre } from 'src/app/models/usuarioCRLibre';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { ServicioCertificado } from 'src/app/services/certificado';
import { ServicioPersona } from 'src/app/services/persona';
import { ServicioUbicacion } from 'src/app/services/ubicacion';
import { Persona } from 'src/app/models/persona';
import { ServicioUsuario } from 'src/app/services/usuario';
import { error } from 'jquery';
import { ToastrService } from 'ngx-toastr';

export interface Contrasena {
  contrasena: string, 
  confirmarContrasena: string
}

export interface Cliente {
  nombre: string, nombreRazonSocial: string,
  identificacion: string,
  provincia: string, canton: string,
  distrito: string, barrio: string, otras_senas: string,
  telefono: string, fax: string, correo: string, contrasena: string,
  confirmarContrasena: string
}

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit, AfterViewInit {

  @ViewChild('myFormCertificado') public formCertificado!: NgForm;
  @ViewChild('myForm') public formDatos!: NgForm;
  @ViewChild('myFormContrasena') public formComtrasena!: NgForm;

  cliente!: Persona;
  clienteOriginal!:Persona;
  nuevaContrasena: Contrasena;
  // contasenaValida: boolean = true;
  valido: boolean = true;
  contrasenaActualizada:boolean = false;
  contrasenaError:boolean = false;
  mostrarContrasenaCertificado: boolean = false;
  certificadoActualizado : boolean = false;
  certificadoError : boolean = false;
  datosPersonalesActualizado : boolean = false;
  datosPersonalesError : boolean = false;


  certificado: Certificado = new Certificado("", "", "", "", "", undefined);
  archivoOriginal: string = "";

  selectedFiles!: FileList;
  currentFile!: File;
  archivoSeleccionado: boolean = false;
  currentFileName: string = "Seleccionar archivo";

  modificar: boolean = true;

  mostrar: boolean = false;
  mostrarConfirmacion: boolean = false;

  public provincias: any[] = [];
  private cantones: any[] = [];
  private distritos: any[] = [];
  public cantonesFiltradosEmisor: any[] = [];
  public distritosFiltradosEmisor: any [] = [];

  constructor(private _servicioAutenticacion: ServicioAutenticacion, private _servicioCertificado: ServicioCertificado, 
    private _servicioUbicacion: ServicioUbicacion, private _servicioPersona: ServicioPersona, private _servicioUsuario:ServicioUsuario,
    private toastr: ToastrService) { 
    this.cliente = new Persona("","","","","","","","","","",[]);
    this.clienteOriginal = new Persona("","","","","","","","","","",[]);
    this.nuevaContrasena = {
      contrasena: "", 
      confirmarContrasena: ""
    }
    
    this.cargarUbicaciones().then( res =>{
      this.cargarUsuario();

      }).catch(error => {
        // console.log('Error cargarUbicacion', error);
        this.toastr.error('Error al cargar los datos', 'Error');
      });
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    let cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    this._servicioCertificado.getCertificado(cedula).subscribe(
      result => {
        this.certificado = result[0];
        this.certificado.archivoURL = result[0].archivo;
        this.archivoOriginal = result[0].archivo;
      },
      error => {
        // console.log("Error de carga de certificado", error)
        this.toastr.error('Error al cargar los datos', 'Error');
      });
  }

  guardar(cliente : Persona){
    // console.log(cliente)
    let datos = JSON.stringify(cliente);
    let clienteActualizado = JSON.parse(datos);
    delete clienteActualizado.ubicacion;
    // console.log(clienteActualizado)
    let cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    this._servicioPersona.updatePersona(cedula, clienteActualizado)
    .subscribe(res => {
      // console.log(res);
      this.modificar = true;
      this.datosPersonalesActualizado = true;
      setTimeout(() => {
        this.datosPersonalesActualizado = false;
      }, 5000);
    }, error => {
      // console.log(error);
      this.datosPersonalesError = true;
      setTimeout(() => {
        this.datosPersonalesError = false;
      }, 5000);
    });
  }

  validarContrasena(){
    if(this.nuevaContrasena.contrasena === this.nuevaContrasena.confirmarContrasena){
      this.valido = true;
    } else {
      this.valido = false;
    }
  }

  modificarCertificado(certificado: Certificado) {
    let usuario = this._servicioAutenticacion.obtenerDatosUsuario();
    // console.log(usuario)
    if (this.certificado.archivoURL !== this.archivoOriginal && certificado.archivo) {
      let CRLibre = new UsuarioCRLibre("users", "users_log_me_in", usuario.nombreDeUsuario, usuario.password ? usuario.password : "");
      this._servicioUsuario.iniciarSesionCR(CRLibre).subscribe(login => {
        if (certificado.archivo) {
          this._servicioCertificado.subirCertificado(certificado.archivo, usuario.nombreDeUsuario, login.resp.sessionKey).subscribe((res: any) => {
            certificado.archivoURL = res.resp.downloadCode;
            this._servicioCertificado.actualizarCertificado(certificado, usuario.cedula).subscribe((res:any) =>{
              // console.log(res);
              this.certificadoActualizado = true;
              setTimeout(() => {
                this.certificadoActualizado = false;
              }, 5000);

            },(err:any) =>{
              // console.log(err);
              this.certificadoError = true;
              setTimeout(() => {
                this.certificadoError = false;
              }, 5000);
            })
          }, (err: any) => {
            // console.log(err);
            this.certificadoError = true;
            setTimeout(() => {
              this.certificadoError = false;
            }, 5000);
          })
        }
      }, err => {
        // console.log(err);
        this.certificadoError = true;
        setTimeout(() => {
          this.certificadoError = false;
        }, 5000);
      })

    }else{
      this._servicioCertificado.actualizarCertificado(certificado, usuario.cedula).subscribe((res:any) =>{
        // console.log(res);
        this.certificadoActualizado = true;
        setTimeout(() => {
          this.certificadoActualizado = false;
        }, 5000);
      },(err:any) =>{
        // console.log(err);
        this.certificadoError = true;
        setTimeout(() => {
          this.certificadoError = false;
        }, 5000);
      })
    }
    
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    const file: File | null = this.selectedFiles.item(0);
    if (file) {
      this.currentFile = file;
      this.certificado.archivo = this.currentFile;
      this.archivoSeleccionado = true;
      this.currentFileName = this.currentFile.name;
      this.certificado.archivoURL = this.currentFileName;
      // console.log(this.currentFileName)
    } else {
      this.currentFileName = "Seleccionar archivo";
      this.archivoSeleccionado = false;
    }
  }

  modificarCuenta() {
    this.modificar = false;
  }

  cancelarModificar() {
    this.modificar = true;
    // console.log(this.clienteOriginal)
    let datos = JSON.stringify(this.clienteOriginal);
    this.cliente = JSON.parse(datos);
    this.cargarUbicacionEmisor(this.cliente.ubicacion[1], this.cliente.ubicacion[2]);

  }

  cambioContrasena() {
    let cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    this._servicioUsuario.updateUsuario(cedula, {password: this.nuevaContrasena.contrasena})
    .subscribe( res => {
      // console.log(res);
      this.formComtrasena.resetForm();

      this.contrasenaActualizada = true;
      setTimeout(() => {
        this.contrasenaActualizada = false;
      }, 5000);

    }, error => {
      this.contrasenaError = true;
      setTimeout(() => {
        this.contrasenaError = false;
      }, 5000);
    });

  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index != 0) {
      this.formComtrasena.resetForm();
      this.valido = true;
      this.cancelarModificar();
    }
  }

  toggleContrasena() {
    this.mostrar = !this.mostrar;
  }

  toggleContrasenaConfirmacion() {
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
  }

  toggleContrasenaCertificado() {
    this.mostrarContrasenaCertificado = !this.mostrarContrasenaCertificado;
  }

  //

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


  cargarCantonesEmisor(codigo_provincia: any){
    this.distritosFiltradosEmisor = [];
    this.cantonesFiltradosEmisor = [];
    this.cantonesFiltradosEmisor = this.cantones.filter(element => {
      return element.codigo_provincia == codigo_provincia;
    });
      this.cliente.ubicacion[1] = this.cantonesFiltradosEmisor[0].codigo_canton;
      this.cargarDistritosEmisor(this.cliente.ubicacion[1]);
    
    
    // console.log('Mis nuevos filtrados', this.cantonesFiltradosEmisor);

  };

  cargarDistritosEmisor(codigo_canton?: any){
    // console.log(codigo_canton);
    codigo_canton = parseInt(codigo_canton);
    this.distritosFiltradosEmisor = this.distritos.filter(element => {
      return element.codigo_canton == codigo_canton;
    });
    if(codigo_canton !== this.cliente.ubicacion[1]){
      this.cliente.ubicacion[0] = this.distritosFiltradosEmisor[0].codigo_distrito;
    }
    // console.log(this.cantonesFiltradosEmisor);

  };

  private cargarUbicacionEmisor(codigo_canton: string, 
    codigo_provincia: string){
    this.cantonesFiltradosEmisor = this.cantones.filter(element => {
      return element.codigo_provincia == codigo_provincia;
    });

    this.distritosFiltradosEmisor = this.distritos.filter(element => {
      return element.codigo_canton == codigo_canton;
    });

    // console.log('Holi',this.distritosFiltradosEmisor);
   
    
  }

  private ubicacionPersona(codigo_distrito: string): Promise<any>{
    return new Promise((resolve, reject) => {
      var res: Array<any> = new Array();
      var distrito = this.distritos.filter(element => {
        return element.codigo_distrito == codigo_distrito;
      });
      var canton =  this.cantones.filter(element => {
        return element.codigo_canton == distrito[0].codigo_canton;
      });
      var provincia = this.provincias.filter(element => {
        return element.codigo_provincia == canton[0].codigo_provincia;
      });
      res.push(distrito[0].codigo_distrito, canton[0].codigo_canton, provincia[0].codigo_provincia);
      resolve(res);
    });
  }

  private cargarUsuario(){
    var cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    this._servicioPersona.getPersona(cedula).subscribe( result => {
      var personaResult = result.data[0];

      this.ubicacionPersona(personaResult.IDDistrito).then(ubicacion => {
      this.cliente.ubicacion[0] = ubicacion[0];
      this.cliente.ubicacion[1] = ubicacion[1];
      this.cliente.ubicacion[2] = ubicacion[2];
      this.cargarCantonesEmisor(this.cliente.ubicacion[2]);
      this.cliente.IDDistrito = ubicacion[0];
      this.cliente.IDTipoIdentificacion = personaResult.IDTipoIdentificacion;
      
      this.cliente.cedula = personaResult.cedula;
      this.cliente.nombre = personaResult.nombre;
      this.cliente.nombreComercial = personaResult.nombreComercial;
      this.cliente.email = personaResult.email;
      this.cliente.telefono = personaResult.telefono;
      this.cliente.barrio = personaResult.barrio;
      this.cliente.otrasSenas = personaResult.otrasSenas;
      this.cliente.fax = personaResult.fax;
      this.cargarUbicacionEmisor(this.cliente.ubicacion[1], this.cliente.ubicacion[2]);
      // console.log('Ubicaci??n: ', this.cliente.ubicacion);
      
      let datos = JSON.stringify(this.cliente);
      this.clienteOriginal = JSON.parse(datos);
      // console.log(this.clienteOriginal)

      });
      
    },
    error => {
      // console.log("Error cargar usuario ", error);
      this.toastr.error('Error al cargar los datos', 'Error');
    });
  
  }

  
}
