import { Model } from "mongoose";
import { UserName } from "../User/user.interface";

export type IAdmin = {
  phoneNumber: string;
  role: "admin";
  password: string;
  name: UserName;
  address: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;
