"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const loginZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        phoneNumber: zod_1.default.string("Phone number is required"),
        password: zod_1.default.string("Password is required"),
    }),
});
const refreshTokenZodSchema = zod_1.default.object({
    cookies: zod_1.default.object({
        refreshToken: zod_1.default.string("Refresh Token is required"),
    }),
});
exports.AuthValidation = {
    loginZodSchema,
    refreshTokenZodSchema,
};
