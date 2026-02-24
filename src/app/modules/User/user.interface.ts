import { Model } from "mongoose";

type UserName = {
  firstName: string;
  lastName: string;
};

export type IUser = {
  phoneNumber: string;
  role: "seller" | "buyer";
  password: string;
  name: UserName;
  address: string;
  budget: string;
  income: string;
};

export type IUserFilters = {
  searchTerm: string;
};

export type UserModel = Model<IUser, Record<string, unknown>>;
