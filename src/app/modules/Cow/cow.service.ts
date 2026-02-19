import mongoose from "mongoose";
import { ICow } from "./cow.interface";
import { Cow } from "./cow.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const createCow = async (cow: ICow): Promise<ICow | null> => {
  let newCowAllData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newCow = await Cow.create([cow], { session });

    if (!newCow.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create cow!");
    }

    newCowAllData = newCow[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }

  if (newCowAllData) {
    newCowAllData = await Cow.findOne({ _id: newCowAllData._id }).populate(
      "seller",
    );
  }

  return newCowAllData;
};

export const CowService = {
  createCow,
};
