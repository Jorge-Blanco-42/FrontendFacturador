import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { servicioCambioContrasena } from 'src/app/services/cambio-contrasena';
import { ServicioUsuario } from 'src/app/services/usuario';

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
  verificando: boolean = true;
  successful: boolean = false;
  private id: string = "";
  private token: string = "";

  constructor(
    private _servicioContrasena: servicioCambioContrasena,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _servicioUsuario: ServicioUsuario) {
    this.clave = new NuevaClave();
    this._activatedRoute.params.subscribe(
      params => {
        this.id = params['id'];
        this.token = params['token'];
      },

      error => {
        this._router.navigate(['**']);
      }
    );

  }

  ngOnInit(): void {
    this.verificarToken();
  }


  actualizarContrasena() {
    var data: object = {
      password: this.clave.nueva_clave
    };
    this.verificarToken();
    this._servicioUsuario.updateUsuario(this.id, data).subscribe(
      result => {

        this.successful = true;
        setTimeout(() => {
          this._router.navigate(['home']);
        }, 5000);
      },
      error =>{
        this._router.navigate(['**']);
      }
    );
    
  }

  toggleContrasena() {
    this.mostrar = !this.mostrar;
  }

  verificarToken() {
    console.log('token', this.token);
    console.log('id', this.id);
    this._servicioContrasena.verificarToken(this.token, this.id).subscribe(
      res => {
        this.verificando = false;
      },

      error => {
        if (error.status == 417) {
          this.verificando = false;
          this.vencido = true;

          setTimeout(() => {
            this._router.navigate(['home']);
          }, 7000);
        } else {
          this._router.navigate(['**']);
        }

      }
    );
  }

}

export class NuevaClave {

  constructor(
    public nueva_clave: string = "") { }
}
