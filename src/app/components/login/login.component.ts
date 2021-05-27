import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login : boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  openSignUp(): void {
    this.login  = false;
 }

  closeSignUp(login : boolean):void{
    this.login = login;
  }

}
