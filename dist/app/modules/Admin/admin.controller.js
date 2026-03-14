"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const admin_service_1 = require("./admin.service");
const config_1 = __importDefault(require("../../../config"));
const createAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const { ...adminData } = req.body;
    const result = await admin_service_1.AdminService.createAdmin(adminData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
});
const adminLogin = (0, catchAsync_1.default)(async (req, res) => {
    const { ...adminLoginData } = req.body;
    const result = await admin_service_1.AdminService.adminLogin(adminLoginData);
    const { refreshToken, ...others } = result;
    const cookieOptions = {
        secure: config_1.default.env === "production",
        httpOnly: true,
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);
    if ("refreshToken" in result) {
        delete result.refreshToken;
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin login successfully!",
        data: others,
    });
});
exports.AdminController = {
    createAdmin,
    adminLogin,
};
