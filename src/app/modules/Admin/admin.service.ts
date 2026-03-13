import mongoose from "mongoose";
import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { ILoginUserResponse } from "../Auth/auth.interface";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

const createAdmin = async (admin: IAdmin): Promise<IAdmin> => {
  let newAdminAllData = null;
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create admin!");
    }

    newAdminAllData = newAdmin[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }

  return newAdminAllData;
};

const adminLogin = async (payload: IAdmin): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  const isUserExists = await Admin.isUserExists(phoneNumber);

  const { phoneNumber: userPhoneNumber, role } = isUserExists;

  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exists");
  }

  if (
    isUserExists.password &&
    !(await Admin.isPasswordMatched(password, isUserExists?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  // create token
  const accessToken = jwtHelpers.createToken(
    {
      phoneNumber: userPhoneNumber,
      role: role,
    },
    config.jwt.secret as Secret,
    {
      expiresIn: config.jwt.expires_in as string,
    },
  );

  const refreshToken = jwtHelpers.createToken(
    {
      phoneNumber: userPhoneNumber,
      role: role,
    },
    config.jwt.refresh_secret as Secret,
    {
      expiresIn: config.jwt.refresh_expires_in,
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AdminService = {
  createAdmin,
  adminLogin,
};
