import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Certificado } from 'src/app/models/certificado';
import { ServicioAutenticacion } from 'src/app/services/autenticacion.service';
import { ServicioCertificado } from 'src/app/services/certificado';

export interface Cliente {
  nombre: string, nombreRazonSocial: string,
  identificacion: string,
  provincia: string, canton: string,
  distrito: string, barrio: string, otras_senas:string,
  telefono: string, fax: string, correo: string, contrasena: string, 
  confirmarContrasena: string
}

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit, AfterViewInit {

  @ViewChild('myFormCertificado') public formCertificado!: NgForm;
  @ViewChild('myForm') public formDatos!: NgForm;
  @ViewChild('myFormContrasena') public formComtrasena!: NgForm;

  cliente!: Cliente;
  // contasenaValida: boolean = true;
  valido: boolean = true;

  certificado!: Certificado;

  selectedFiles!: FileList;
  currentFile!: File;
  archivoSeleccionado: boolean = false;
  currentFileName: string = "Seleccionar archivo";

  modificar:boolean = true;

  mostrar: boolean = false;
  mostrarConfirmacion: boolean = false;

  constructor(private _servicioAutenticacion: ServicioAutenticacion, private _servicioCertificado: ServicioCertificado) { 
    this.cliente = {
      nombre: "",
      nombreRazonSocial: "", identificacion: "",
      provincia: "", canton: "",
      distrito: "", barrio: "", otras_senas:"",
      telefono: "", fax: "", correo: "", contrasena:"", confirmarContrasena: ""
    }
  }
  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    let cedula = this._servicioAutenticacion.obtenerDatosUsuario().cedula;
    this._servicioCertificado.getCertificado(cedula).subscribe(
      result => {
        this.certificado = result[0];
      },
      error => {
        //alert(<any>error);
        console.log(<any>error)
      });
  }

  guardar(cliente : Cliente){
    console.log(cliente);
  }

  validarContrasena(){
    if(this.cliente.contrasena === this.cliente.confirmarContrasena){
      this.valido = true;
    }else{
      this.valido = false;
    }
  }

  modificarCertificado(certificado:Certificado){
    console.log(certificado);
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    const file: File | null = this.selectedFiles.item(0);
    if (file) {
      this.currentFile = file;
      this.certificado.archivo = this.currentFile;
      this.archivoSeleccionado = true;
      this.currentFileName = this.currentFile.name;
      console.log(this.currentFileName)
    } else{
      this.currentFileName = "Seleccionar archivo";
      this.archivoSeleccionado = false;
    } 
  }

  modificarCuenta(){
    this.modificar = false;
  }

  cancelarModificar(){
    this.modificar = true;
  }

  cambioContrasena(){
    // guardar cambio
    this.formComtrasena.resetForm();
  }

  onTabChanged(event: MatTabChangeEvent) 
  {
    if(event.index == 0){
        this.formCertificado.resetForm();
    }
    else{
      this.formComtrasena.resetForm();
      this.valido = true;
      this.formDatos.resetForm();
    }
  }

  toggleContrasena(){
    this.mostrar = !this.mostrar;
  }

  toggleContrasenaConfirmacion(){
    this.mostrarConfirmacion = !this.mostrarConfirmacion;
  }
  
}
