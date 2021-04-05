import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFacturaComponent } from './components/create-factura/create-factura.component';

const routes: Routes = [
  {path: 'crearFactura', component: CreateFacturaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
