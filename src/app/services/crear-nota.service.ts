import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class ServicioCrearNota {
  public url: string;

  constructor(private _httpClient: HttpClient) { 
    this.url = Global.url;
  }

  
}
