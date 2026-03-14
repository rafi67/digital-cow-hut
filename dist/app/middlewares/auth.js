"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOrder = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../modules/User/user.model");
const auth = (...requiredRoles) => async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
        }
        let verifiedUser = null;
        verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        req.user = verifiedUser;
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden");
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
const authOrder = (...requiredRoles) => async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
        }
        let verifiedUser = null;
        verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        const { phoneNumber, role } = verifiedUser;
        if (role !== "admin") {
            const isUserExists = await user_model_1.User.isUserExists(phoneNumber);
            if (!isUserExists) {
                throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exists");
            }
        }
        req.user = verifiedUser;
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden");
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authOrder = authOrder;
exports.default = auth;
