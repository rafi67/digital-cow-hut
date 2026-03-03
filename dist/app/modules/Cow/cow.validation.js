"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const cow_constant_1 = require("./cow.constant");
const createCowZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string("Name is required"),
        age: zod_1.default.string("Age is required"),
        price: zod_1.default.string("Price is required"),
        location: zod_1.default.enum([...cow_constant_1.location], {
            error: "Location is required",
        }),
        breed: zod_1.default.enum([...cow_constant_1.breed], {
            error: "Breed is required",
        }),
        weight: zod_1.default.string("Weight is required"),
        label: zod_1.default.enum([...cow_constant_1.label], {
            error: "Label is required",
        }),
        category: zod_1.default.enum([...cow_constant_1.category], {
            error: "Category is required",
        }),
        seller: zod_1.default.string("Seller is required"),
    }),
});
const updateCowZodSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string("Type error").optional(),
        age: zod_1.default.string("Type error").optional(),
        price: zod_1.default.string("Type error").optional(),
        location: zod_1.default
            .enum([...cow_constant_1.location], {
            error: "Location is required",
        })
            .optional(),
        breed: zod_1.default
            .enum([...cow_constant_1.breed], {
            error: "Bread is required",
        })
            .optional(),
        weight: zod_1.default.string("Type error").optional(),
        label: zod_1.default
            .enum([...cow_constant_1.label], {
            error: "Label is required",
        })
            .optional(),
        category: zod_1.default
            .enum([...cow_constant_1.category], {
            error: "Category is required",
        })
            .optional(),
        seller: zod_1.default.string("Type error").optional(),
    }),
});
exports.CowValidation = {
    createCowZodSchema,
    updateCowZodSchema,
};
