import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css']
})
export class CambiarContrasenaComponent implements OnInit {

  showDetails: boolean = true;
  clave: NuevaClave;
  vencido: boolean = false;
  mostrar: boolean = false;

  constructor() { 
    this.clave = new NuevaClave();
  }

  ngOnInit(): void {
  }

  onStrengthChanged(strength: number) {
    console.log('password strength = ', strength);
  }

  actualizarContrasena(){

  }

  toggleContrasena(){
    this.mostrar = !this.mostrar;
  }

}

export class NuevaClave{

  constructor(
    public nueva_clave: string = "", 
    public confirmacion: string = ""){}
} 
