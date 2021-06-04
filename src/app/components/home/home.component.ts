import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _servicioAutenticacion: ServicioAutenticacion, public dialog: MatDialog) { }

  scroll(name: string) {
    var el = <HTMLElement>document.getElementById(name);
    el.scrollIntoView();
  }

  public myInterval: number = 3000;
  public activeSlideIndex: number = 0;
  public noWrapSlides: boolean = false;
  login: boolean = false;

  activeSlideChange() {
    console.log(this.activeSlideIndex);
  }


  ngOnInit(): void {
    this.login = this._servicioAutenticacion.isLoggedIn();
  }

  abrirLogin(){
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '80%',
      height: '80%',
      data: false
    });

    dialogRef.afterClosed().subscribe(result => {
      this.login = result
    });
  }

  abrirRegistro(){
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '80%',
      height: '80%',
      data: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.login = result
    });
  }



}


