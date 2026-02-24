import { RequestHandler, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { CowService } from "./cow.service";
import { cowFilterableFields } from "./cow.constant";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { ICow } from "./cow.interface";

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

const getAllCows: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, cowFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await CowService.getAllCows(filters, paginationOptions);

    sendResponse<ICow[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cows retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const getSingleCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await CowService.getSingleCow(id);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cow retrieved successfully",
      data: result,
    });
  },
);

const updateCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updatedData = req.body;
    const result = await CowService.updateCow(id, updatedData);

    sendResponse<ICow>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cow updated successfully",
      data: result,
    });
  },
);

export const CowController = {
  createCow,
  getAllCows,
  getSingleCow,
  updateCow,
};
