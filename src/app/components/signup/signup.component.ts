import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FormControl} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { ServicioUsuario } from 'src/app/services/usuario';


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

  constructor( private _servicioUsuario: ServicioUsuario, private _servicioAutenticacion: ServicioAutenticacion,
    public dialogRef: MatDialogRef<SignupComponent>) { 
    this.cliente = {
      nombre: "",
      nombreRazonSocial: "", identificacion: "",
      provincia: "", canton: "",
      distrito: "", barrio: "", otras_senas:"",
      telefono: "", fax: "", correo: "", contrasena:"", confirmarContrasena: ""
    }
  }

  ngOnInit(): void {
    console.log(this.login)
  }
  
  closeSignUp(close: boolean): void {
    this.newItemEvent.emit(close);
  }

  registrar(cliente : Cliente){
    this.validarContrasena();
    console.log(this.valido, cliente)
    if (this.valido){
      this._servicioUsuario.registro(cliente).subscribe((res:any)=>{
        console.log(res)
        this._servicioAutenticacion.saveToken(res.token);
        this.login = true
        console.log("return true")
        this.closeSignUp(true);
      },err=>{
        console.log(err)
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

}
