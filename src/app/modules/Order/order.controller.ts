import { RequestHandler, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { OrderService } from "./order.service";
import { CowService } from "../Cow/cow.service";
import { UserService } from "../User/user.service";

const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...orderData } = req.body;

    const { budget } = await UserService.getSingleUser(orderData.buyer);
    const { price, seller } = await CowService.getSingleCow(orderData.cow);
    const { income } = await UserService.getSingleUser(seller.toString());

    const priceInNumber = Number(price);
    let budgetInNumber = Number(budget);
    let incomeInNumber = Number(income);

    if (budgetInNumber < priceInNumber) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: false,
        message: "Not enough balance!",
      });
    } else {
      incomeInNumber += priceInNumber;
      budgetInNumber -= priceInNumber;
      const result = await OrderService.createOrder(
        orderData,
        incomeInNumber.toString(),
        budgetInNumber.toString(),
        seller.toString(),
      );
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order created successfully",
        data: result,
      });
    }
  },
);

export const OrderController = {
  createOrder,
};
