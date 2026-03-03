"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cow_model_1 = require("./cow.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const cow_constant_1 = require("./cow.constant");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const createCow = async (cow) => {
    let newCowAllData = null;
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newCow = await cow_model_1.Cow.create([cow], { session });
        if (!newCow.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create cow!");
        }
        newCowAllData = newCow[0];
        await session.commitTransaction();
        await session.endSession();
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
    if (newCowAllData) {
        newCowAllData = await cow_model_1.Cow.findOne({ _id: newCowAllData._id }).populate("seller");
    }
    return newCowAllData;
};
const getAllCows = async (filters, paginationOptions) => {
    const { searchTerm, ...filtersData } = filters;
    const { minPrice, maxPrice, ...remainingFilters } = filtersData;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: cow_constant_1.cowSearchableFields.map((field) => ({
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
    const priceConditions = {};
    if (minPrice !== undefined) {
        priceConditions["$gte"] = Number(minPrice);
    }
    else if (maxPrice !== undefined) {
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
    const { skip, limit, page, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = await cow_model_1.Cow.find(whereConditions)
        .sort(sortConditions)
        .collation({ locale: "en_US", numericOrdering: true })
        .skip(skip)
        .limit(limit);
    const total = await cow_model_1.Cow.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getSingleCow = async (id) => {
    const result = await cow_model_1.Cow.findById(id);
    return result;
};
const updateCow = async (id, payload) => {
    const result = await cow_model_1.Cow.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};
const deleteCow = async (id) => {
    const result = await cow_model_1.Cow.findByIdAndDelete(id);
    return result;
};
exports.CowService = {
    createCow,
    getAllCows,
    getSingleCow,
    updateCow,
    deleteCow,
};
