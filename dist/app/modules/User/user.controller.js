"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const user_constant_1 = require("./user.constant");
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const { ...userData } = req.body;
    const result = await user_service_1.UserService.createUser(userData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Academic Semester created successfully",
        data: result,
    });
});
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await user_service_1.UserService.getAllUsers(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getSingleUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.UserService.getSingleUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrieved successfully",
        data: result,
    });
});
const getMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserService.getMyProfile(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile retrieved successfully!",
        data: result,
    });
});
const updateMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const { ...profileData } = req.body;
    const phoneNumber = req.params.phone;
    const result = await user_service_1.UserService.updateProfile(phoneNumber, profileData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile updated successfully!",
        data: result,
    });
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await user_service_1.UserService.updateUser(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User updated successfully",
        data: result,
    });
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.UserService.deleteUser(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User deleted successfully",
        data: result,
    });
});
exports.UserController = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMyProfile,
    updateMyProfile,
    updateUser,
    deleteUser,
};
