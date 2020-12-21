import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConnectionVo } from 'src/model/connection';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })



export class ConnectionService {
  a :ConnectionVo;
constructor(private http: HttpClient) {}
connectionservice(data: any): Observable<ConnectionVo> {
  return this.http.post<ConnectionVo>('http://localhost:6664/getconnectionDetails', data, { headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })});
           }
           getconnectionservice(): Observable<any> {
            return this.http.get('http://localhost:6664/getconnectionDetails1', { headers: new HttpHeaders({
                'Content-Type': 'application/json'
              })});
           }

    }




