"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cow = void 0;
const mongoose_1 = require("mongoose");
const cow_constant_1 = require("./cow.constant");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const cowSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        enum: cow_constant_1.location,
        required: true,
    },
    breed: {
        type: String,
        enum: cow_constant_1.breed,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        enum: cow_constant_1.label,
        required: true,
    },
    category: {
        type: String,
        enum: cow_constant_1.category,
        required: true,
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
cowSchema.pre("save", async function () {
    const isExists = await exports.Cow.findOne({
        name: this.name,
    });
    if (isExists) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Cow already exists");
    }
});
exports.Cow = (0, mongoose_1.model)("Cow", cowSchema);
