import { Model, Types } from "mongoose";
import { ICow } from "../Cow/cow.interface";
import { IUser } from "../User/user.interface";

export type IOrder = {
  cow: Types.ObjectId | ICow;
  buyer: Types.ObjectId | IUser;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>