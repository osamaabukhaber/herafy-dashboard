import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiderbarService {

  siderBarSubObj:BehaviorSubject<boolean> ;
  constructor(){
    this.siderBarSubObj = new BehaviorSubject(false)
  }

  AssignSiderBareStatus(adminIconDropDown:boolean){
    if(adminIconDropDown){
      this.siderBarSubObj.next(true)
    }
    else{
      this.siderBarSubObj.next(false)
    }
  }

  adminSideBarStatusMeth(){
    return this.siderBarSubObj
  }
}
