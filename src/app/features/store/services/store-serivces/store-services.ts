import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.developemnt';
import { StoreApiResponse } from '../../../../models/store-model/store-api-response';
import { IStore } from '../../../../models/store-model/istore';

@Injectable({
  providedIn: 'root'
})
export class StoreServices {
  private baseUrl = `${environment.apiBaseUrl}/api/store/`;

  constructor(private httpRequest:HttpClient){}

  getAllStores():Observable<StoreApiResponse>{
      return this.httpRequest.get<StoreApiResponse>(this.baseUrl)
  }

  getStoreById(id: string): Observable<IStore> {
    return this.httpRequest.get<IStore>(`${ this.baseUrl}${id}`);
  }
  updateStore(id: string, storeData: Partial<IStore>): Observable<IStore> {
    return this.httpRequest.patch<IStore>(`${this.baseUrl}${id}`, storeData, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${cookieService.getCookie('token')}`
      }
    });
  }
  addStore(storeData: IStore): Observable<IStore> {
    return this.httpRequest.post<IStore>(this.baseUrl, storeData , {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${cookieService.getCookie('token')}`
      }
    });
  }
}
