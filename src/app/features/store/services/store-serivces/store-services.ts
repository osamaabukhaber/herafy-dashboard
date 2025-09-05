import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

getAllStores(params?: Record<string, any>): Observable<StoreApiResponse> {
  let httpParams = new HttpParams();

  if (params) {
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
  }

  return this.httpRequest.get<StoreApiResponse>(this.baseUrl, { params: httpParams });
}
  getStoreById(id: string): Observable<StoreApiResponceById> {
    return this.httpRequest.get<StoreApiResponceById>(`${ this.baseUrl}${id}`);
  }

  updateStore(id: string, storeData: FormData | Partial<IStore>): Observable<IStore> {
    // Check if the data is FormData or regular object
    if (storeData instanceof FormData) {
      // If it's FormData, we don't need to set Content-Type header
      console.log('Updating store with FormData:', storeData , "ID:", id);
      // For FormData, don't set Content-Type header - let browser set it with boundary
      return this.httpRequest.patch<IStore>(`${this.baseUrl}${id}`, storeData, {
        withCredentials: true
      });
    } else {
      // For regular JSON object
      return this.httpRequest.patch<IStore>(`${this.baseUrl}${id}`, storeData, {
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${cookieService.getCookie('token')}`
        },
        withCredentials: true
      });
    }
  }

  addStore(storeData: FormData | IStore): Observable<IStore> {
    // Check if the data is FormData or regular object
    if (storeData instanceof FormData) {
      // For FormData, don't set Content-Type header - let browser set it with boundary
      return this.httpRequest.post<IStore>(this.baseUrl, storeData, {
        withCredentials: true
      });
    } else {
      // For regular JSON object
      return this.httpRequest.post<IStore>(this.baseUrl, storeData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
    }
  }

  deleteStore(id: string): Observable<void> {
    return this.httpRequest.delete<void>(`${this.baseUrl}${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
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
