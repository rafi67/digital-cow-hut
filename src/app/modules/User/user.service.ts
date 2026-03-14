import mongoose, { SortOrder } from "mongoose";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interfaces/common";
import { IPagination } from "../../../interfaces/pagination";
import { userSearchableFields } from "./user.constant";
import { IUser, IUserFilters } from "./user.interface";
import { User } from "./user.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (user: IUser): Promise<IUser> => {
  let newUserAllData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
  return newUserAllData;
};

const getAllUsers = async (
  filters: Partial<IUserFilters>,
  paginationOptions: IPagination,
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { skip, limit, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const getMyProfile = async (payload: JwtPayload): Promise<Partial<IUser>> => {
  const result = await User.findOne({ phoneNumber: payload.phoneNumber });
  return {
    name: result.name,
    phoneNumber: result.phoneNumber,
    address: result.address,
  };
};

const updateProfile = async (
  phoneNumber: string,
  profile: Partial<IUser>,
): Promise<Partial<IUser>> => {
  const result = await User.findOneAndUpdate({ phoneNumber }, profile, {
    returnDocument: "after",
  });
  return {
    name: result.name,
    phoneNumber: result.phoneNumber,
    address: result.address,
  };
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>,
): Promise<IUser> => {
  const result = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  getMyProfile,
  updateProfile,
  updateUser,
  deleteUser,
};
