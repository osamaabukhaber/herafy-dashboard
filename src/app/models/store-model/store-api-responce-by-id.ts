import { IStore } from "./istore";

export interface StoreApiResponceById {
  status: string;
  data: {
      store: IStore;
    };
}
