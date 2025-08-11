import { ICart } from "./icart";

export interface IcartResponceApi {
  status: string;
  data: {
    carts:ICart[];
  };
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
}
