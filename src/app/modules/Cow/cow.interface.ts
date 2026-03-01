import { Model, Types } from "mongoose";
import { IUser } from "../User/user.interface";

export type ICow = {
  name: string;
  age: string;
  price: string;
  location:
    | "Dhaka"
    | "Chattogram"
    | "Barishal"
    | "Rajshahi"
    | "Sylhet"
    | "Comilla"
    | "Rangpur"
    | "Mymenshing";

  breed:
    | "Brahman"
    | "Nellore"
    | "Sahiwal"
    | "Gir"
    | "Indigenous"
    | "Tharparkar"
    | "Kankrej";
  weight: string;
  label: "for sale" | "sold out";
  category: "Dairy" | "Beef" | "DualPurpose";
  seller: Types.ObjectId | IUser;
};

export type cowFilterableFields = {
  searchTerm: string;
  name: string;
  age: string;
  price: string;
  location:
    | "Dhaka"
    | "Chattogram"
    | "Barishal"
    | "Rajshahi"
    | "Sylhet"
    | "Comilla"
    | "Rangpur"
    | "Mymenshing";

  breed:
    | "Brahman"
    | "Nellore"
    | "Sahiwal"
    | "Gir"
    | "Indigenous"
    | "Tharparkar"
    | "Kankrej";
  weight: string;
  label: "for sale" | "sold out";
  category: "Dairy" | "Beef" | "DualPurpose";
  minPrice: string;
  maxPrice: string;
};

export type CowModel = Model<ICow, Record<string, unknown>>;
