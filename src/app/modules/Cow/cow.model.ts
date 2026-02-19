import { model, Schema } from "mongoose";
import { CowModel, ICow } from "./cow.interface";
import { breed, category, label, location } from "./cow.constant";

const cowSchema = new Schema<ICow>({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
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
    type: Number,
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

export const Cow = model<ICow, CowModel>("Cow", cowSchema);
