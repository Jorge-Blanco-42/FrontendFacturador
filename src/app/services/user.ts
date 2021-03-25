import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global'

@Injectable()
export class UserService {
    public url: string;

    constructor(
        public _http: HttpClient
    ) {
        this.url = Global.url;
    }

    login(user: User): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        var params = "w=" + user.w + "&r=" + user.r + "&userName=" + user.userName + "&pwd=" + user.pwd;
        return this._http.post(this.url, params, { headers: headers });
    }
}