import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FormControl} from '@angular/forms';


 export interface Cliente {
  nombre: string,
  tipo_identificacion: string, identificacion: string,
  provincia: string, canton: string,
  distrito: string, barrio: string, otras_senas:string,
  telefono: string, fax: string, correo: string
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  @Input() login! : boolean;
  @Output() newItemEvent = new EventEmitter<boolean>();

  cliente!: Cliente;

  constructor() { 
    this.cliente = {
      nombre: "",
      tipo_identificacion: "", identificacion: "",
      provincia: "", canton: "",
      distrito: "", barrio: "", otras_senas:"",
      telefono: "", fax: "", correo: ""
    }
  }

  ngOnInit(): void {
    console.log(this.login)
  }
  
  closeSignUp(): void {
    this.login  = true;
    this.newItemEvent.emit(this.login);
  }

  registrar(cliente : Cliente){
    console.log(cliente);
  }

}
