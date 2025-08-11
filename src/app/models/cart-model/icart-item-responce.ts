import { ICart } from "./icart";

export interface IcartItemResponce {
  status: string;
  data: {
    cart: ICart;
  };
}
