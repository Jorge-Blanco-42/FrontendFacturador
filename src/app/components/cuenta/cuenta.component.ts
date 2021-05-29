import { Component, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

export interface Cliente {
  nombre: string, nombreRazonSocial: string,
  identificacion: string,
  provincia: string, canton: string,
  distrito: string, barrio: string, otras_senas:string,
  telefono: string, fax: string, correo: string, contrasena: string, 
  confirmarContrasena: string
}

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {

  cliente!: Cliente;
  valido: boolean = true;

  constructor() { 
    this.cliente = {
      nombre: "",
      nombreRazonSocial: "", identificacion: "",
      provincia: "", canton: "",
      distrito: "", barrio: "", otras_senas:"",
      telefono: "", fax: "", correo: "", contrasena:"", confirmarContrasena: ""
    }
  }

  ngOnInit(): void {
  }

  guardar(cliente : Cliente){
    console.log(cliente);
  }

  validarContrasena(){
    console.log("pendiente")
  }

}
