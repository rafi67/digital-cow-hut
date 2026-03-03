"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const cow_service_1 = require("./cow.service");
const cow_constant_1 = require("./cow.constant");
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const createCow = (0, catchAsync_1.default)(async (req, res) => {
    const { ...cowData } = req.body;
    const result = await cow_service_1.CowService.createCow(cowData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cow created successfully!",
        data: result,
    });
});
const getAllCows = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, cow_constant_1.cowFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = await cow_service_1.CowService.getAllCows(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cows retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});
const getSingleCow = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await cow_service_1.CowService.getSingleCow(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cow retrieved successfully",
        data: result,
    });
});
const updateCow = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await cow_service_1.CowService.updateCow(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cow updated successfully",
        data: result,
    });
});
const deleteCow = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await cow_service_1.CowService.deleteCow(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cow Deleted successfully",
        data: result,
    });
});
exports.CowController = {
    createCow,
    getAllCows,
    getSingleCow,
    updateCow,
    deleteCow,
};
