import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { ServicioUsuario } from 'src/app/services/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario("","",0,"");
  mostrar: boolean = false;

  constructor(private router: Router,private _servicioUsuario: ServicioUsuario, private _servicioAutenticacion: ServicioAutenticacion,
    public dialogRef: MatDialogRef<LoginComponent>, @Inject(MAT_DIALOG_DATA) public login: boolean) { }

  ngOnInit(): void {
  }

  iniciarSesion(){
    this._servicioUsuario.iniciarSesion(this.usuario).subscribe((res:any) =>{
      this._servicioAutenticacion.saveToken(res.token);
      this.login = true
      console.log("return true")
      this.router.navigate(['/'])
      this.dialogRef.close(true);
    },error =>{
      this.dialogRef.close(false);
    })
  }

  openSignUp(): void {
    this.login  = false;
 }

  closeSignUp(close : boolean):void{
    this.login = true;
    this.router.navigate(['/'])
    if(close)this.dialogRef.close(true);
  }
  
  toggleContrasena(){
    this.mostrar = !this.mostrar;
  }

}
