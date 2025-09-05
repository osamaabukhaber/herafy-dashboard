import { IStore } from "./istore";

export interface StoreApiResponse {
  status: string;
  data: {
    stores: IStore[];
  };
  pagination:{
    total:number,
    currentPage:number,
    totalPages:number
  }
}
