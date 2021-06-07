import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { ServicioUsuario } from 'src/app/services/usuario';

@Component({
  selector: 'app-solicitud-cambio-contrasena',
  templateUrl: './solicitud-cambio-contrasena.component.html',
  styleUrls: ['./solicitud-cambio-contrasena.component.css']
})
export class SolicitudCambioContrasenaComponent implements OnInit {

  public usuario: Usuario = new Usuario("","",0,"");
  public enviado: boolean = false;

  constructor(private router: Router,private _servicioUsuario: ServicioUsuario, private _servicioAutenticacion: ServicioAutenticacion,
    public dialogRef: MatDialogRef<SolicitudCambioContrasenaComponent>) { }

  ngOnInit(): void {
  }

  enviarRecuperacion(){
    
  }

}
