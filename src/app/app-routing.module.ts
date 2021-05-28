import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarComponent } from './components/consultar/consultar.component';
import { CreateFacturaComponent } from './components/create-factura/create-factura.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';


const routes: Routes = [
  {path : '', component: HomeComponent},
  {path: 'crearFactura', component: CreateFacturaComponent },
  {path: 'consultar', component: ConsultarComponent},
  {path : 'home', component: HomeComponent},
  {path : 'login', component: LoginComponent},
  {path : 'cuenta', component: CuentaComponent},
  {path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
