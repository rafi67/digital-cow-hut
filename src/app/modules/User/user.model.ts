import { model, Schema } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import { role } from "./user.constant";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import config from "../../../config";

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
      type: String,
    },
    income: {
      type: String,
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

userSchema.statics.isUserExists = async function (
  id: string,
): Promise<Pick<IUser, "phoneNumber" | "password" | "role"> | null> {
  return await User.findOne(
    { _id: id },
    { phoneNumber: 1, password: 1, role: 1 },
  );
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre("save", async function () {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
});

export const User = model<IUser, UserModel>("User", userSchema);
