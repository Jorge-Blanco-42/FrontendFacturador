import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Correo } from 'src/app/models/correo';
import { Usuario } from 'src/app/models/usuario';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { servicioCambioContrasena } from 'src/app/services/cambio-contrasena';
import { ServicioCorreo } from 'src/app/services/correo';
import { ServicioPersona } from 'src/app/services/persona';
import { ServicioUsuario } from 'src/app/services/usuario';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-solicitud-cambio-contrasena',
  templateUrl: './solicitud-cambio-contrasena.component.html',
  styleUrls: ['./solicitud-cambio-contrasena.component.css']
})
export class SolicitudCambioContrasenaComponent implements OnInit {

  successful: boolean = false;
  public usuario: Usuario = new Usuario("","",0,"");
  public enviado: boolean = false;
  private appUrl: string;

  constructor(private router: Router,private _servicioUsuario: ServicioUsuario, private _servicioAutenticacion: ServicioAutenticacion,
    public dialogRef: MatDialogRef<SolicitudCambioContrasenaComponent>, private _servicioContrasena: servicioCambioContrasena, 
    private _servicioPersona: ServicioPersona, private _servicioCorreo: ServicioCorreo, private _router: Router) { 
      this.appUrl = environment.appUrl;
    }

  ngOnInit(): void {
  }

  enviarRecuperacion(){
    var cedula = this.usuario.cedula;
    this._servicioContrasena.getToken(cedula).subscribe(token => {
      this._servicioPersona.getPersona(cedula).subscribe(persona => {
        var datosPersona = persona.data[0];
        console.log(datosPersona);
        var enlace = this.appUrl+"nueva-contrasena/"+token.id+"/"+token.token;
        var mensaje = "Estimado "+datosPersona.nombre+".\nPara cambiar su contraseña, haga click en el siguiente enlace: " + enlace;
        mensaje += "\n\n\nEnlace válido por 15 minutos.\nPOR FAVOR NO RESPONDA A ESTE CORREO.";
        var correo = new Correo(datosPersona.email, 'Cambiar Contraseña' ,mensaje, "", "", "", "");

        this._servicioCorreo.enviarCorreoSimple(correo).subscribe(confirmacionCorreo => {
          this.successful = true;
        },
        errorCorreo =>{
          this._router.navigate(['**']);
        });

      });
    }, 
    error => {

    });
  }

}
