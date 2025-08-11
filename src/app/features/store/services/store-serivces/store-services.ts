import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, retry } from 'rxjs';
import { environment } from '../../../../environment/environment.developemnt';
import { StoreApiResponse } from '../../../../models/store-model/store-api-response';
import { IStore } from '../../../../models/store-model/istore';
import { StoreApiResponceById } from '../../../../models/store-model/store-api-responce-by-id';

@Injectable({
  providedIn: 'root'
})
export class StoreServices {
  private baseUrl = `${environment.apiBaseUrl}/store/`;

  constructor(private httpRequest:HttpClient){}

  getAllStores():Observable<StoreApiResponse>{
      return this.httpRequest.get<StoreApiResponse>(this.baseUrl)
  }

  getStoreById(id: string): Observable<StoreApiResponceById> {
    return this.httpRequest.get<StoreApiResponceById>(`${ this.baseUrl}${id}`);
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
  deleteStore(id: string): Observable<void> {
    return this.httpRequest.delete<void>(`${this.baseUrl}${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${cookieService.getCookie('token')}`
      }
    });
  }

  // id returned is not string but is mongoose ObjectID i want get allids
  getAllStoreIds(): Observable<string[]> {
    return this.httpRequest.get<StoreApiResponse>(this.baseUrl).pipe(
      retry(3), // Retry up to 3 times in case of failure
      map(response => response.data.stores
        .map(store => store._id)
        .filter((id): id is string => typeof id === 'string')
      ) // Extracting IDs from the stores and filtering out undefined
    );
  }
}
