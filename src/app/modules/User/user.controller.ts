import { RequestHandler, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { UserService } from "./user.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { userFilterableFields } from "./user.constant";
import { IUser } from "./user.interface";

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;
    const result = await UserService.createUser(userData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Academic Semester created successfully",
      data: result,
    });
  },
);

const getAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await UserService.getAllUsers(filters, paginationOptions);

    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  },
);

const getSingleUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await UserService.getSingleUser(id);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  },
);

const getMyProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.getMyProfile(req.user);

    sendResponse<Partial<IUser>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile retrieved successfully!",
      data: result,
    });
  },
);

const updateMyProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...profileData } = req.body;
    const phoneNumber = req.params.phone as string;
    const result = await UserService.updateProfile(phoneNumber, profileData);

    sendResponse<Partial<IUser>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully!",
      data: result,
    });
  },
);

const updateUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updatedData = req.body;

    const result = await UserService.updateUser(id, updatedData);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  },
);

const deleteUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await UserService.deleteUser(id);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  },
);

export const UserController = {
  createUser,
  getAllUsers,
  getSingleUser,
  getMyProfile,
  updateMyProfile,
  updateUser,
  deleteUser,
};
