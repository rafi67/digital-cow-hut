"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("./user.constant");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
exports.userSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: user_constant_1.role,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    budget: {
        type: String,
    },
    income: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.userSchema.pre("save", async function () {
    const isExists = await exports.User.findOne({
        "name.firstName": this.name.firstName,
        "name.lastName": this.name.lastName,
        phoneNumber: this.phoneNumber,
    });
    if (isExists) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User already exists!");
    }
});
exports.User = (0, mongoose_1.model)("User", exports.userSchema);
