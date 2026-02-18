import { model, Schema } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import { role } from "./user.constant";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

export const userSchema = new Schema<IUser, UserModel>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: role,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
    },
    income: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.pre("save", async function () {
  const isExists = await User.findOne({
    "name.firstName": this.name.firstName,
    "name.lastName": this.name.lastName,
    phoneNumber: this.phoneNumber,
  });

  if (isExists) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists!");
  }
});

export const User = model<IUser, UserModel>("User", userSchema);
