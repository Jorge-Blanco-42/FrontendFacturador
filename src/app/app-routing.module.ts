import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarComponent } from './components/consultar/consultar.component';
import { CreateFacturaComponent } from './components/create-factura/create-factura.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';

import { AutenticacionGuard } from './guards/autenticacion.guard';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';

const routes: Routes = [
  {path : 'home', component: HomeComponent},
  {path : '', component: HomeComponent, canActivate: [AutenticacionGuard]},
  {path: 'crearFactura', component: CreateFacturaComponent, canActivate: [AutenticacionGuard] },
  {path: 'consultar', component: ConsultarComponent, canActivate: [AutenticacionGuard]},  
  {path : 'login', component: LoginComponent},
  {path : 'cuenta', component: CuentaComponent, canActivate: [AutenticacionGuard]},
  {path: 'nueva-contrasena/:id/:token', component: CambiarContrasenaComponent, canActivate: [AutenticacionGuard]},
  {path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
