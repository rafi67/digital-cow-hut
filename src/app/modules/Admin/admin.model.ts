import { model, Schema } from "mongoose";
import { AdminModel, IAdmin } from "./admin.interface";
import { role } from "./admin.constant";
import bcrypt from "bcrypt";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

export const adminSchema = new Schema<IAdmin, AdminModel>(
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
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

adminSchema.pre("save", async function () {
  const admin = this;
  const isExists = await Admin.findOne({
    phoneNumber: admin.phoneNumber,
  });

  if (isExists) {
    throw new ApiError(httpStatus.CONFLICT, "Admin already exists!");
  }
});

adminSchema.statics.isUserExists = async function (
  phoneNumber: string,
): Promise<Pick<IAdmin, "phoneNumber" | "password" | "role"> | null> {
  return await Admin.findOne(
    {
      phoneNumber,
    },
    { phoneNumber: 1, password: 1, role: 1 },
  );
};

adminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

adminSchema.pre("save", async function () {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
});

export const Admin = model<IAdmin, AdminModel>("Admin", adminSchema);
