"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const order_service_1 = require("./order.service");
const cow_service_1 = require("../Cow/cow.service");
const user_service_1 = require("../User/user.service");
const createOrder = (0, catchAsync_1.default)(async (req, res) => {
    const { ...orderData } = req.body;
    const { budget } = await user_service_1.UserService.getSingleUser(orderData.buyer);
    const { price, seller } = await cow_service_1.CowService.getSingleCow(orderData.cow);
    const { income } = await user_service_1.UserService.getSingleUser(seller.toString());
    const priceInNumber = Number(price);
    let budgetInNumber = Number(budget);
    let incomeInNumber = Number(income);
    if (budgetInNumber < priceInNumber) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: false,
            message: "Not enough balance!",
        });
    }
    else {
        incomeInNumber += priceInNumber;
        budgetInNumber -= priceInNumber;
        const result = await order_service_1.OrderService.createOrder(orderData, incomeInNumber.toString(), budgetInNumber.toString(), seller.toString());
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Order created successfully",
            data: result,
        });
    }
});
const getAllOrder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await order_service_1.OrderService.getAllOrder();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result,
    });
});
const getSingleOrder = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await order_service_1.OrderService.getSingleOrder(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Order retrieved successfully",
        data: result,
    });
});
exports.OrderController = {
    createOrder,
    getAllOrder,
    getSingleOrder,
};
