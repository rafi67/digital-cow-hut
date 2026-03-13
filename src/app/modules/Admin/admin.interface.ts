import { Model } from "mongoose";
import { UserName } from "../User/user.interface";

export type IAdmin = {
  phoneNumber: string;
  role: "admin";
  password: string;
  name: UserName;
  address: string;
};

export type AdminModel = {
  isUserExists(
    phoneNumber: string
  ): Promise<Pick<IAdmin, "phoneNumber" | "password" | "role">>;
  isPasswordMatched(givenPassword, savedPassword): Promise<boolean>;
} & Model<IAdmin>
