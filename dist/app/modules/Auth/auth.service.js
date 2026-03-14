"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const user_model_1 = require("../User/user.model");
const http_status_1 = __importDefault(require("http-status"));
const loginUser = async (payload) => {
    const { phoneNumber, password } = payload;
    const isUserExists = await user_model_1.User.isUserExists(phoneNumber);
    const { phoneNumber: userPhoneNumber, role } = isUserExists;
    console.log("user role:", role + "hello");
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exists");
    }
    if (isUserExists.password &&
        !(await user_model_1.User.isPasswordMatched(password, isUserExists?.password))) {
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
const refreshToken = async (token) => {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (err) {
        console.log(err);
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid Refresh Token");
    }
    const { phoneNumber: userPhoneNumber } = verifiedToken;
    const isUserExists = await user_model_1.User.isUserExists(userPhoneNumber);
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists");
    }
    // generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        phoneNumber: isUserExists.phoneNumber,
        role: isUserExists.role,
    }, config_1.default.jwt.secret, {
        expiresIn: config_1.default.jwt.expires_in,
    });
    return {
        accessToken: newAccessToken,
    };
};
exports.AuthService = {
    loginUser,
    refreshToken,
};
