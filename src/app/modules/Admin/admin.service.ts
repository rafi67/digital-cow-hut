import mongoose from "mongoose";
import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

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

export const AdminService = {
  createAdmin,
};
