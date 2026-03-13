import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";
import config from "../../../config";
import { ILoginUserResponse } from "../Auth/auth.interface";

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...adminData } = req.body;

    const result = await AdminService.createAdmin(adminData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  },
);

const adminLogin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...adminLoginData } = req.body;
    const result = await AdminService.adminLogin(adminLoginData);
    const { refreshToken, ...others } = result;

    const cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    if ("refreshToken" in result) {
      delete result.refreshToken;
    }

    sendResponse<ILoginUserResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin login successfully!",
      data: others,
    });
  },
);

export const AdminController = {
  createAdmin,
  adminLogin,
};
