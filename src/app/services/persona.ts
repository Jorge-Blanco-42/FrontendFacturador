import { Injectable } from '@angular/core';
import { Persona } from '../models/persona';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'
import { environment } from 'src/environments/environment';

@Injectable()
export class ServicioPersona {
    public url: string;
    public backend: string;

    constructor(
        public _http: HttpClient
    ) {
        this.url = Global.url;
        this.backend = environment.backendUrl;
    }

    insertPersona(person: Persona): Observable<any>{
        let data = new FormData();
        data.append('cedula', person.cedula);
        data.append('nombre', person.nombre);
        data.append('email', person.email);
        data.append('nombreComercial', person.nombreComercial);
        data.append('IDTipoIdentificacion', person.IDTipoIdentificacion);
        data.append('IDDistrito', person.IDDistrito);
        data.append('barrio', person.barrio);
        data.append('otrasSenas', person.otrasSenas);
        data.append('telefono', person.telefono);
        data.append('fax', person.fax);
        data.append('IDUsuario', person.IDUsuario)
        return this._http.post(this.backend + 'insertPersona/', data);
    }

    getPersona(cedula: string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.backend+'getPersona/'+cedula, {headers: headers});
    }

    deletePersona(cedula: string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.backend+'deletePersona/'+cedula, {headers: headers});
    }

    updatePersona(cedula: string, newData: any){
        let data = new FormData();
        let keys = Object.keys(newData);
        for(let i = 0; i < keys.length; i++){         
            let key: string = keys[i].toString();
            data.append(key, newData[key].toString());
            console.log(key, newData[key]);
        }
        console.log('AJÁ ', data);
        return this._http.put(this.backend+'updatePersona/'+cedula, data);
    }
}