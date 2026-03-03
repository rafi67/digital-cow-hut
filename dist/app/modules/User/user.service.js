"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createUser = async (user) => {
    let newUserAllData = null;
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newUser = await user_model_1.User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create user");
        }
        newUserAllData = newUser[0];
        await session.commitTransaction();
        await session.endSession();
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
    return newUserAllData;
};
const getAllUsers = async (filters, paginationOptions) => {
    const { searchTerm, ...filtersData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: user_constant_1.userSearchableFields.map((field) => ({
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
    const { skip, limit, page, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = await user_model_1.User.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = await user_model_1.User.countDocuments();
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};
const getSingleUser = async (id) => {
    const result = await user_model_1.User.findById(id);
    return result;
};
const updateUser = async (id, payload) => {
    const result = await user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};
const deleteUser = async (id) => {
    const result = await user_model_1.User.findByIdAndDelete(id);
    return result;
};
exports.UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
