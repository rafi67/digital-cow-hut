"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.adminSchema = void 0;
const mongoose_1 = require("mongoose");
const admin_constant_1 = require("./admin.constant");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
exports.adminSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: admin_constant_1.role,
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
    },
    address: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.adminSchema.pre("save", async function () {
    const admin = this;
    const isExists = await exports.Admin.findOne({
        phoneNumber: admin.phoneNumber,
    });
    if (isExists) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Admin already exists!");
    }
});
exports.adminSchema.statics.isUserExists = async function (phoneNumber) {
    return await exports.Admin.findOne({
        phoneNumber,
    }, { phoneNumber: 1, password: 1, role: 1 });
};
exports.adminSchema.statics.isPasswordMatched = async function (givenPassword, savedPassword) {
    return await bcrypt_1.default.compare(givenPassword, savedPassword);
};
exports.adminSchema.pre("save", async function () {
    const admin = this;
    admin.password = await bcrypt_1.default.hash(admin.password, Number(config_1.default.bcrypt_salt_rounds));
});
exports.Admin = (0, mongoose_1.model)("Admin", exports.adminSchema);
