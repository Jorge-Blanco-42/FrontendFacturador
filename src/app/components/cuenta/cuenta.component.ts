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

  certificado!: Certificado;
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
    private _servicioUbicacion: ServicioUbicacion, private _servicioPersona: ServicioPersona, private _servicioUsuario: ServicioUsuario) { 
    this.cliente = new Persona("","","","","","","","","","",[]);
    this.clienteOriginal = new Persona("","","","","","","","","","",[]);
    this.certificado = new Certificado("","","","","");
    this.nuevaContrasena = {
      contrasena: "", 
      confirmarContrasena: ""
    }
    this.certificado = new Certificado("", "", "", "", "", undefined);
    this.cargarUbicaciones().then( res =>{
      this.cargarUsuario();

      }).catch(error => {
        console.log('Error cargarUbicacion', error);
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
        //alert(<any>error);
        console.log(<any>error)
      });
  }

  guardar(cliente : Persona){
    console.log(cliente);
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
    console.log(usuario)
    if (this.certificado.archivoURL !== this.archivoOriginal && certificado.archivo) {
      let CRLibre = new UsuarioCRLibre("users", "users_log_me_in", usuario.nombreDeUsuario, usuario.password ? usuario.password : "");
      this._servicioUsuario.iniciarSesionCR(CRLibre).subscribe(login => {
        if (certificado.archivo) {
          this._servicioCertificado.subirCertificado(certificado.archivo, usuario.nombreDeUsuario, login.resp.sessionKey).subscribe((res: any) => {
            certificado.archivoURL = res.resp.downloadCode;
            this._servicioCertificado.actualizarCertificado(certificado, usuario.cedula).subscribe((res:any) =>{
              console.log(res);
            },(err:any) =>{
              console.log(err);
            })
          }, (err: any) => {
            console.log(err);
          })
        }
      }, err => {
        console.log(err)
      })

    }else{
      this._servicioCertificado.actualizarCertificado(certificado, usuario.cedula).subscribe((res:any) =>{
        console.log(res);
      },(err:any) =>{
        console.log(err);
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
      console.log(this.currentFileName)
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
  }

  cambioContrasena() {
    // guardar cambio
    this.formComtrasena.resetForm();
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index == 0) {
      //this.formCertificado.resetForm();
    }
    else {
      this.formComtrasena.resetForm();
      this.valido = true;
      this.modificar = true;
      let datos = JSON.stringify(this.clienteOriginal);
      this.cliente = JSON.parse(datos);
      //this.formDatos.resetForm();
    }
  }

  toggleContrasena() {
    this.mostrar = !this.mostrar;
  }

  toggleContrasenaConfirmacion() {
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
  }

  //

  private cargarUbicaciones(): Promise<any>{
    return new Promise((resolve, reject)=>{
      this._servicioUbicacion.getProvincias().subscribe(
        data => {
          console.log(data, "<-----");
          this.provincias = data;
        },
        error => {
          console.log('An error happened! ', error);
          reject(error);
        }
      );
  
      this._servicioUbicacion.getCantones().subscribe(
        data => {
          this.cantones = data;
        },
        error => {
          console.log('An error happened! ', error);
          reject(error);
        }
      );
  
      this._servicioUbicacion.getDistritos().subscribe(
        data => {
          this.distritos = data;
        },
        error => {
          console.log('An error happened! ', error);
          reject(error);
        }
      );
      resolve(true);
    });
  }


  cargarCantonesEmisor(codigo_provincia: any){
    this.distritosFiltradosEmisor = [];
    this.cantonesFiltradosEmisor = [];
    console.log('codigo de provincia', codigo_provincia);
    this.cantonesFiltradosEmisor = this.cantones.filter(element => {
      return element.codigo_provincia == codigo_provincia;
    });
    console.log('Mis nuevos filtrados', this.cantonesFiltradosEmisor);
    console.log(this.cantonesFiltradosEmisor);

  };

  cargarDistritosEmisor(codigo_canton?: any){
    console.log(codigo_canton);
    codigo_canton = parseInt(codigo_canton);
    this.distritosFiltradosEmisor = this.distritos.filter(element => {
      return element.codigo_canton == codigo_canton;
    });

    console.log(this.cantonesFiltradosEmisor);

  };

  private cargarUbicacionEmisor(codigo_canton: string, 
    codigo_provincia: string){
    this.cantonesFiltradosEmisor = this.cantones.filter(element => {
      return element.codigo_provincia == codigo_provincia;
    });

    this.distritosFiltradosEmisor = this.distritos.filter(element => {
      return element.codigo_canton == codigo_canton;
    });

    console.log('Holi',this.distritosFiltradosEmisor);
   
    
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
      
      this.cliente.cedula = personaResult.cedula;
      this.cliente.nombre = personaResult.nombre;
      this.cliente.nombreComercial = personaResult.nombreComercial;
      this.cliente.email = personaResult.email;
      this.cliente.telefono = personaResult.telefono;
      this.cliente.barrio = personaResult.barrio;
      this.cliente.otrasSenas = personaResult.otrasSenas;
      this.cliente.fax = personaResult.fax;
      this.cargarUbicacionEmisor(this.cliente.ubicacion[1], this.cliente.ubicacion[2]);
      console.log('Ubicación: ', this.cliente.ubicacion);
      
      let datos = JSON.stringify(this.cliente);
      this.clienteOriginal = JSON.parse(datos);

      });
      
    },
    error => {
      console.log(error);
    });
  
  }

  
}
