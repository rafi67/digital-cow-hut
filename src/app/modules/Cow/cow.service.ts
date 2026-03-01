import mongoose, { SortOrder } from "mongoose";
import { cowFilterableFields, ICow } from "./cow.interface";
import { Cow } from "./cow.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPagination } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { cowSearchableFields } from "./cow.constant";
import { paginationHelpers } from "../../../helpers/paginationHelpers";

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

const getAllCows = async (
  filters: Partial<cowFilterableFields>,
  paginationOptions: IPagination,
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { minPrice, maxPrice, ...remainingFilters } = filtersData;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(remainingFilters).length) {
    andConditions.push({
      $and: Object.entries(remainingFilters).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const priceConditions: any = {};

  if (minPrice !== undefined) {
    priceConditions["$gte"] = Number(minPrice);
  } else if (maxPrice !== undefined) {
    priceConditions["$lte"] = Number(maxPrice);
  }

  andConditions.push({
    $expr: {
      $and: [
        ...(minPrice
          ? [{ $gte: [{ $toDouble: "$price" }, Number(minPrice)] }]
          : []),
        ...(maxPrice
          ? [{ $lte: [{ $toDouble: "$price" }, Number(maxPrice)] }]
          : []),
      ],
    },
  });

  const { skip, limit, page, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereConditions)
    .sort(sortConditions)
    .collation({ locale: "en_US", numericOrdering: true })
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id);
  return result;
};

const updateCow = async (id: string, payload: Partial<ICow>): Promise<ICow> => {
  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete(id);
  return result;
};

export const CowService = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
  deleteCow,
};
