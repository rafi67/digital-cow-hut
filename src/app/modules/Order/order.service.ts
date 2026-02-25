import mongoose from "mongoose";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import ApiError from "../../../errors/ApiError";
import httStatus from "http-status";
import { populate } from "dotenv";

const createOrder = async (order: IOrder): Promise<IOrder> => {
  let newOrderAllData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newOrder = await Order.create([order], { session });

    if (!newOrder.length) {
      throw new ApiError(httStatus.BAD_REQUEST, "Failed to create order");
    }

    newOrderAllData = newOrder[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }

  if (newOrderAllData) {
    newOrderAllData = await Order.findOne({
      _id: newOrderAllData._id,
    }).populate("cow buyer");
  }

  return newOrderAllData;
};

export const OrderService = {
  createOrder,
};
