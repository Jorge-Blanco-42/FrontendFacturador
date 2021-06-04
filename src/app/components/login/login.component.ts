import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Usuario } from 'src/app/models/usuario';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { ServicioUsuario } from 'src/app/services/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login : boolean = true;
  usuario: Usuario = new Usuario("","",0,"");

  constructor(private _servicioUsuario: ServicioUsuario, private _servicioAutenticacion: ServicioAutenticacion,
    public dialogRef: MatDialogRef<LoginComponent>,) { }

  ngOnInit(): void {
  }

  iniciarSesion(){
    this._servicioUsuario.iniciarSesion(this.usuario).subscribe((res:any) =>{
      this._servicioAutenticacion.saveToken(res.token);
      this.login = true
      console.log("return true")
      this.dialogRef.close(true);
    },error =>{
      this.dialogRef.close(false);
    })
  }

  openSignUp(): void {
    this.login  = false;
 }

  closeSignUp(login : boolean):void{
    this.login = login;
    if(login)this.dialogRef.close(true);
  }

}
