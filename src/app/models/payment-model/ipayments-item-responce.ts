import { Ipayments } from "./ipayments";

export interface IpaymentsItemResponce {
   status: string; // JSEND standard
  data: {
    payment: Ipayments;
  };
}
