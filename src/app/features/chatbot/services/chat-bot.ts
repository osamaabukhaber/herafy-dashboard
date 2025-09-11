import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment.developemnt';

@Injectable({
  providedIn: 'root'
})
export class ChatBot {
  formData: any;
  constructor(private http:HttpClient){}

  sendMessage2(formData:any):Observable<Object>{
    return this.http.post<Object>(environment.apiUrlRAG, formData );}
}
