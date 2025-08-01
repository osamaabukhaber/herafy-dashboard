import { IUser } from "./iuser";
export interface UsersApiResponse {
  status: string;
  data: {
    users: IUser[];
  };
}
