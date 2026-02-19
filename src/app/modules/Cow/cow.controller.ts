import { RequestHandler, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { CowService } from "./cow.service";

const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...cowData } = req.body;
    const result = await CowService.createCow(cowData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cow created successfully!",
      data: result,
    });
  },
);

export const CowController = {
  createCow,
};
