import { Injectable } from '@angular/core';
import { TipoCambio } from '../models/tipoCambio';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'
import { FormBuilder} from "@angular/forms";

@Injectable()
export class ServicioTipoCambio {
    public url: string;

    constructor(
        public _http: HttpClient
    ) {
        
        this.url = Global.tipoCambioAPI;
    }

    getTipoCambio(tipoCambio: TipoCambio){  
        var address = this.url+tipoCambio.dia+'/'+tipoCambio.mes+'/'+tipoCambio.año;
        return this._http.get(address);

    }


}