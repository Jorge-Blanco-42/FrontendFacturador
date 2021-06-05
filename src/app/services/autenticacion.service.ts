import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicioAutenticacion {
  private token!: string;

  constructor(private http: HttpClient, private router: Router) {}

  public saveToken(token: string): void {
    sessionStorage.setItem('usuario', token);
    this.token = token;
  }

  private getToken(): string {
    let token = sessionStorage.getItem('usuario');
    if (token) {
      this.token = token
    }
    return this.token;
  }

  public logout(): void {
    this.token = '';
    window.sessionStorage.removeItem('usuario');
    this.router.navigateByUrl('/home');
  }

  public obtenerDatosUsuario(): Usuario {
    const token = this.getToken();
    let usuario = new Usuario("","",0);
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      usuario = JSON.parse(payload);
      return usuario;
    } else {
      return usuario;
    }
  }
  public isLoggedIn(): boolean {
    const user = this.obtenerDatosUsuario();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
}
