import { model, Schema } from "mongoose";
import { CowModel, ICow } from "./cow.interface";
import { breed, category, label, location } from "./cow.constant";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const cowSchema = new Schema<ICow>({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    enum: location,
    required: true,
  },
  breed: {
    type: String,
    enum: breed,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    enum: label,
    required: true,
  },
  category: {
    type: String,
    enum: category,
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

cowSchema.pre("save", async function () {
  const isExists = await Cow.findOne({
    name: this.name,
  });

  if (isExists) {
    throw new ApiError(httpStatus.CONFLICT, "Cow already exists");
  }
});

export const Cow = model<ICow, CowModel>("Cow", cowSchema);
