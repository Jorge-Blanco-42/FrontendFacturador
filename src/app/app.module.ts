import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateFacturaComponent } from './components/create-factura/create-factura.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ConsultarComponent, DialogResumen } from './components/consultar/consultar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CrearNotaComponent } from './components/crear-nota/crear-nota.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';
import { MatTabsModule } from '@angular/material/tabs'; 
import { ServicioAutenticacion } from './services/autenticacion.service';
import { ServicioUsuario } from './services/usuario';
import { ServicioPersona } from './services/persona';
import { SolicitudCambioContrasenaComponent } from './components/solicitud-cambio-contrasena/solicitud-cambio-contrasena.component';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { ServicioCaByS } from './services/cabys';
import { ServicioConsultas } from './services/consultas';
import { ServicioCorreo } from './services/correo';
import { ServicioDecodificador } from './services/decodificador';
import { ServicioEscritorXML } from './services/escritorXML';
import { ServicioTipoCambio } from './services/tipoCambioXML';
import { CapitalsPipe } from './pipes/capitals.pipe';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,
    CreateFacturaComponent,
    ErrorComponent,
    HomeComponent,
    ConsultarComponent,
    DialogResumen,
    CrearNotaComponent,
    LoginComponent,
    SignupComponent,
    CuentaComponent,
    SolicitudCambioContrasenaComponent,
    CambiarContrasenaComponent,
    CapitalsPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    IvyCarouselModule,
    MDBBootstrapModule.forRoot(),
    MatDialogModule,
    MatTabsModule,
    MatPasswordStrengthModule,
    MatProgressSpinnerModule,
    ToastrModule.forRoot()
  ],
  providers: [ServicioAutenticacion, ServicioUsuario, DatePipe,
    ServicioTipoCambio, ServicioCaByS, ServicioDecodificador,
    ServicioCorreo, ServicioEscritorXML, ServicioConsultas, ServicioPersona],
  bootstrap: [AppComponent],
  entryComponents: [DialogResumen]
})
export class AppModule { }
