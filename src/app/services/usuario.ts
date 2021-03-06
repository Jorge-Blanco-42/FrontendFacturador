import { Injectable } from '@angular/core';
import { UsuarioCRLibre } from '../models/usuarioCRLibre';
import { Usuario } from '../models/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'
import { environment } from 'src/environments/environment';
import { Documento } from '../models/documento';
import { Persona } from '../models/persona';

@Injectable()
export class ServicioUsuario {
    public url: string;
    public backend: string;

    constructor(
        public _http: HttpClient
    ) {
        this.url = Global.url;
        this.backend = environment.backendUrl;
    }


    convertirXML(xml: string): Observable<any> {
        var data = new FormData();
        data.append('xml', xml);
        return this._http.post(this.backend + 'getXMLData/', data);
    }

    iniciarSesionCR(user: UsuarioCRLibre): Observable<any> {
        let data = new FormData();
        data.append("w",user.w);
        data.append("r",user.r);
        data.append("userName",user.userName);
        data.append("pwd",user.pwd);
        return this._http.post(this.url, data);
    }

    iniciarSesion(user: Usuario){
        let data = new FormData();
        data.append("cedula", user.cedula);
        data.append("contrasena", user.password?user.password:"");
        return this._http.post(this.backend+"/inicioSesion", data);
    }

    registro(user:any){
        let data = new FormData();
        data.append("cedula",user.identificacion);
        data.append("nombre",user.nombreRazonSocial);
        data.append("email",user.correo);
        data.append("nombreComercial",user.nombre);
        data.append("IDDistrito",user.distrito);
        data.append("barrio",user.barrio);
        data.append("otrasSenas",user.otras_senas);
        data.append("telefono",user.telefono);
        data.append("fax",user.fax);
        data.append("contrasena",user.contrasena);
        return this._http.post(this.backend+"/registro", data);
    }

    insertUsuario(user: Usuario): Observable<any>{
        let data = new FormData();
        data.append('password', user.password?user.password:"");
        data.append('cedula', user.cedula);
        return this._http.post(this.backend + 'insertUsuario/', data);
    }

    getCertificado(id: string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'get-certificate/'+id,{headers:headers});
    }

    getDocumentos(id:string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.backend+'getDocumentos/'+id,{headers:headers});
    }

    insertDocumento(doc: Documento){
        let data = new FormData();
        data.append("clave",doc.clave);
        data.append("xml",doc.xml);
        data.append("fecha",doc.fecha);
        data.append("receptor",doc.receptor);
        data.append("tipoDocumento",doc.tipoDocumento);
        data.append("IDUsuario",doc.IDUsuario);
        data.append("estadoAceptacion",doc.estadoAceptacion);
        data.append("xmlEstadoAceptacion",doc.xmlEstadoAceptacion);

        return this._http.post(this.backend+"/insertDocumento", data);
    }

    getUltimoDocumento(idUsuario: string): Observable<any>{
        return this._http.get(this.backend + 'getUltimoDocumento/'+ idUsuario);
      }

    getUsuario(cedula: string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.backend+'getUsuario/'+cedula, {headers: headers});
    }

    deleteUsuario(cedula: string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.backend+'deleteUsuario/'+cedula, {headers: headers});
    }

    getClientes(cedula: string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'aplication/json');
        return this._http.get(this.backend + 'getClientes/' + cedula, {headers:headers});
    }

    insertCliente(idUsuario: string, cliente: Persona){
        let data = new FormData();
        data.append('cedula', cliente.cedula);
        data.append('nombre', cliente.nombre);
        data.append('email', cliente.email);
        data.append('nombreComercial', cliente.nombreComercial);
        data.append('IDTipoIdentificacion', cliente.IDTipoIdentificacion);
        data.append('IDDistrito', cliente.IDDistrito);
        data.append('barrio', cliente.barrio);
        data.append('otrasSenas', cliente.otrasSenas);
        data.append('telefono', cliente.telefono);
        data.append('fax', cliente.fax);
    
        return this._http.post(this.backend + 'insertCliente/'+idUsuario, data);
    }
    
    updateUsuario(cedula: string, newData: any){
        let data = new FormData();
        let keys = Object.keys(newData);
        for(let i = 0; i < keys.length; i++){
            
            let key: string = keys[i].toString();
            data.append(key, newData[key].toString());
            // console.log(key, newData[key]);
        }
        // console.log('AJ?? ', data);
        return this._http.put(this.backend+'updateUsuario/'+cedula, data);
    }

    getActividades(cedula: string){
        return this._http.get(this.backend + 'getActividadEconomica/' + cedula);
    }

    

    


}