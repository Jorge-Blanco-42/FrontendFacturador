import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FormControl} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { ServicioUbicacion } from 'src/app/services/ubicacion';
import { ServicioUsuario } from 'src/app/services/usuario';
import { ToastrService } from 'ngx-toastr';

 export interface Cliente {
  nombre: string, nombreRazonSocial: string,
  identificacion: string,
  provincia: string, canton: string,
  distrito: string, barrio: string, otras_senas:string,
  telefono: string, fax: string, correo: string, contrasena: string, 
  confirmarContrasena: string
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  @Input() login! : boolean;
  @Output() newItemEvent = new EventEmitter<boolean>();

  mostrar: boolean = false;
  mostrarConfirmacion: boolean = false;
  cliente!: Cliente;
  valido: boolean = true;

  public provincias: any[] = [];
  private cantones: any[] = [];
  private distritos: any[] = [];
  public cantonesFiltrados: any[] = [];
  public distritosFiltrados: any[] = [];

  constructor( private _servicioUsuario: ServicioUsuario, private _servicioAutenticacion: ServicioAutenticacion,
    public dialogRef: MatDialogRef<SignupComponent>, private _servicioUbicacion: ServicioUbicacion, private toastr: ToastrService) { 
    this.cliente = {
      nombre: "",
      nombreRazonSocial: "", identificacion: "",
      provincia: "", canton: "",
      distrito: "", barrio: "", otras_senas:"",
      telefono: "", fax: "", correo: "", contrasena:"", confirmarContrasena: ""
    }
  }

  ngOnInit(): void {
    this.cargarUbicaciones().then(res =>{
      this.cargarCantones(this.cliente.provincia);
    });
  }
  
  closeSignUp(close: boolean): void {
    this.newItemEvent.emit(close);
  }

  registrar(cliente : Cliente){
    this.validarContrasena();
    // console.log(this.valido, cliente)
    if (this.valido){
      this._servicioUsuario.registro(cliente).subscribe((res:any)=>{
        // console.log(res)
        this._servicioAutenticacion.saveToken(res.token);
        this.login = true
        // console.log("return true")
        this.toastr.success('Usuario registrado correctamente');
        this.closeSignUp(true);
      },err=>{
        // console.log(err)
        this.toastr.error('Error al registrar usuario', 'Error');
      })
    }
  }

  validarContrasena(){
    if(this.cliente.contrasena === this.cliente.confirmarContrasena){
      this.valido = true;
    }else{
      this.valido = false;
    }
  }

  toggleContrasena(){
    this.mostrar = !this.mostrar;
  }

  toggleContrasenaConfirmacion(){
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
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
                  this.cliente.provincia = provincias[0].codigo_provincia;
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

  //carga las cantones filtrados del emisor
  cargarCantones(codigo_provincia: any) {
    this.distritosFiltrados = [];
    this.cantonesFiltrados = [];
    this.cantonesFiltrados = this.cantones.filter(element => {
      return element.codigo_provincia == codigo_provincia;
    });
    this.cliente.canton = this.cantonesFiltrados[0].codigo_canton;
    this.cargarDistritos(this.cliente.canton)

  };

  //carga los distritos filtrados del emisor
  cargarDistritos(codigo_canton?: any) {
    // console.log(codigo_canton);
    codigo_canton = parseInt(codigo_canton);
    this.distritosFiltrados = this.distritos.filter(element => {
      return element.codigo_canton == codigo_canton;
    });
    this.cliente.distrito = this.distritosFiltrados[0].codigo_distrito;
  };

}
