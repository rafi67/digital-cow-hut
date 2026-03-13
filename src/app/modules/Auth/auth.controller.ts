import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import config from "../../../config";
import sendResponse from "../../../shared/sendResponse";
import { ILoginUserResponse, IRefreshTokenResponse } from "./auth.interface";
import httpStatus from "http-status";
import { AuthService } from "./auth.service";

const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...loginData } = req.body;
    const result = await AuthService.loginUser(loginData);
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
      message: "User login successfully!",
      data: others,
    });
  },
);

const refreshToken: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);

    const cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    if ("refreshToken" in result) {
      delete result.refreshToken;
    }

    sendResponse<IRefreshTokenResponse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User login successfully",
      data: result,
    });
  },
);

export const AuthController = {
  loginUser,
  refreshToken,
};
