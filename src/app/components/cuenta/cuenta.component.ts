import { Component, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

export interface Cliente {
  nombre: string, nombreRazonSocial: string,
  identificacion: string,
  provincia: string, canton: string,
  distrito: string, barrio: string, otras_senas:string,
  telefono: string, fax: string, correo: string, contrasena: string, 
  confirmarContrasena: string
}

export interface Certificado {
  usuario: string, contrasena: string,
  pin: string, archivo: File
}

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {

  cliente!: Cliente;
  contasenaValida: boolean = true;

  certificado!: Certificado;

  selectedFiles!: FileList;
  currentFile!: File;
  archivoSeleccionado: boolean = false;
  currentFileName: string = "Seleccionar archivo";

  modificar:boolean = true;

  constructor() { 
    this.cliente = {
      nombre: "",
      nombreRazonSocial: "", identificacion: "",
      provincia: "", canton: "",
      distrito: "", barrio: "", otras_senas:"",
      telefono: "", fax: "", correo: "", contrasena:"", confirmarContrasena: ""
    }

    this.certificado = {
      usuario: "", contrasena: "",
      pin: "", archivo: this.currentFile
    }
  }

  ngOnInit(): void {
  }

  guardar(cliente : Cliente){
    console.log(cliente);
  }

  validarContrasena(){
    console.log("pendiente")
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
  
}
