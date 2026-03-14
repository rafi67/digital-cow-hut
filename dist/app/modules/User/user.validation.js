"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const user_constant_1 = require("./user.constant");
const createUserZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        phoneNumber: zod_1.default.string("required"),
        role: zod_1.default.enum([...user_constant_1.role], {
            error: "Role is required",
        }),
        password: zod_1.default.string("Password is required"),
        name: zod_1.default.object({
            firstName: zod_1.default.string("First name is required"),
            lastName: zod_1.default.string("Last name is required"),
        }),
        address: zod_1.default.string("Address is required"),
        budget: zod_1.default.string("Type error").optional(),
        income: zod_1.default.string("Type error").optional(),
    }),
});
const updateUserZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        phoneNumber: zod_1.default.string("Type error").optional(),
        role: zod_1.default
            .enum([...user_constant_1.role], {
            error: "Type error",
        })
            .optional(),
        password: zod_1.default.string("Type error").optional(),
        name: zod_1.default
            .object({
            firstName: zod_1.default.string("Type error").optional(),
            lastName: zod_1.default.string("Type error").optional(),
        })
            .optional(),
        address: zod_1.default.string("Type error").optional(),
        budget: zod_1.default.string("Type error").optional(),
        income: zod_1.default.string("Type error").optional(),
    }),
});
const updateUserProfileZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default
            .object({
            firstName: zod_1.default.string().optional(),
            lastName: zod_1.default.string().optional(),
        })
            .optional(),
        phoneNumber: zod_1.default.string().optional(),
        address: zod_1.default.string().optional(),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
    updateUserZodSchema,
    updateUserProfileZodSchema,
};
