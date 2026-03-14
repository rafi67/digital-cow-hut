"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("./order.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../User/user.model");
const cow_model_1 = require("../Cow/cow.model");
const createOrder = async (order, income, budget, seller) => {
    let newOrderAllData = null;
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        await user_model_1.User.findOneAndUpdate({ _id: order.buyer.toString() }, { budget }, {
            session,
            returnDocument: "after",
        });
        await user_model_1.User.findOneAndUpdate({ _id: seller }, { income }, {
            session,
            returnDocument: "after",
        });
        await cow_model_1.Cow.findOneAndUpdate({ _id: order.cow }, { label: "sold out" }, { session, returnDocument: "after" });
        const newOrder = await order_model_1.Order.create([order], { session });
        if (!newOrder.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create order");
        }
        newOrderAllData = newOrder[0];
        await session.commitTransaction();
        await session.endSession();
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
    if (newOrderAllData) {
        newOrderAllData = await order_model_1.Order.findOne({
            _id: newOrderAllData._id,
        }).populate("cow buyer");
    }
    return newOrderAllData;
};
const getAllOrder = async () => {
    const result = await order_model_1.Order.find().populate("buyer cow");
    return result;
};
const getSingleOrder = async (id) => {
    const result = await order_model_1.Order.findById(id).populate("buyer cow");
    return result;
};
exports.OrderService = {
    createOrder,
    getAllOrder,
    getSingleOrder,
};
