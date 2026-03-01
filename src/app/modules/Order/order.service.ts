import mongoose from "mongoose";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import ApiError from "../../../errors/ApiError";
import httStatus from "http-status";
import { User } from "../User/user.model";
import { Cow } from "../Cow/cow.model";

const createOrder = async (
  order: IOrder,
  income: string,
  budget: string,
  seller: string,
): Promise<IOrder> => {
  let newOrderAllData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    await User.findOneAndUpdate(
      { _id: order.buyer.toString() },
      { budget },
      {
        session,
        returnDocument: "after",
      },
    );
    await User.findOneAndUpdate(
      { _id: seller },
      { income },
      {
        session,
        returnDocument: "after",
      },
    );
    await Cow.findOneAndUpdate(
      { _id: order.cow },
      { label: "sold out" },
      { session, returnDocument: "after" },
    );
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

const getAllOrder = async (): Promise<IOrder[]> => {
  const result = await Order.find().populate("buyer cow");

  return result;
};

export const OrderService = {
  createOrder,
  getAllOrder,
};
