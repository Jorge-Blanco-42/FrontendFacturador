import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFacturaComponent } from './components/create-factura/create-factura.component';
import { ErrorComponent } from './components/error/error.component'
import { HomeComponent} from './components/home/home.component'
const routes: Routes = [
  {path: 'crearFactura', component: CreateFacturaComponent },
  {path: '', component: HomeComponent },
  {path : 'home', component: HomeComponent},
  {path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
