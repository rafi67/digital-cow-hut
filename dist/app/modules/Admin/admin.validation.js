"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const admin_constant_1 = require("./admin.constant");
const createAdminZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        phoneNumber: zod_1.default.string("Phone Number is required"),
        role: zod_1.default.enum([...admin_constant_1.role], {
            error: "role is required",
        }),
        password: zod_1.default.string("Password is required"),
        name: zod_1.default.object({
            firstName: zod_1.default.string("First name is required"),
            lastName: zod_1.default.string("Last name is required"),
        }),
        address: zod_1.default.string("Address is required"),
    }),
});
exports.AdminValidation = {
    createAdminZodSchema,
};
