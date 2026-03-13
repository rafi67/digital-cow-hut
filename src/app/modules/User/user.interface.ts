import { Model } from "mongoose";

export type UserName = {
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

export type UserModel = {
  isUserExists(
    phoneNumber: string,
  ): Promise<Pick<IUser, "phoneNumber" | "password" | "role">>;
  isPasswordMatched(givenPassword, savedPassword): Promise<boolean>;
} & Model<IUser>;
