import { Ipayments } from "./ipayments";

export interface IpaymentsApiResponce {
  status: string; // Based on JSEND spec
  data: {
    payments: Ipayments[];
  };
  meta: {
    total: number; // total number of payments
    page: number;  // current page number
    limit: number; // items per page
  };
}
