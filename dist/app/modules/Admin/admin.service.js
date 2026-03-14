"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admin_model_1 = require("./admin.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const createAdmin = async (admin) => {
    let newAdminAllData = null;
    const session = await mongoose_1.default.startSession();
    try {
        await session.startTransaction();
        const newAdmin = await admin_model_1.Admin.create([admin], { session });
        if (!newAdmin.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create admin!");
        }
        newAdminAllData = newAdmin[0];
        await session.commitTransaction();
        await session.endSession();
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
    return newAdminAllData;
};
const adminLogin = async (payload) => {
    const { phoneNumber, password } = payload;
    const isUserExists = await admin_model_1.Admin.isUserExists(phoneNumber);
    const { phoneNumber: userPhoneNumber, role } = isUserExists;
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exists");
    }
    if (isUserExists.password &&
        !(await admin_model_1.Admin.isPasswordMatched(password, isUserExists?.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password is incorrect");
    }
    // create token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        phoneNumber: userPhoneNumber,
        role: role,
    }, config_1.default.jwt.secret, {
        expiresIn: config_1.default.jwt.expires_in,
    });
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        phoneNumber: userPhoneNumber,
        role: role,
    }, config_1.default.jwt.refresh_secret, {
        expiresIn: config_1.default.jwt.refresh_expires_in,
    });
    return {
        accessToken,
        refreshToken,
    };
};
exports.AdminService = {
    createAdmin,
    adminLogin,
};
