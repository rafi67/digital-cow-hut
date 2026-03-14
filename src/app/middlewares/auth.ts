import { NextFunction, Request, Response } from "express";
import { ENUM_USER_ROLE } from "../../enums/user";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import { User } from "../modules/User/user.model";

export interface MyRequest extends Request {
  user: {
    role: ENUM_USER_ROLE;
    userPhoneNumber: string;
  };
}

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }

      next();
    } catch (err) {
      next(err);
    }
  };

export const authOrder =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      const { phoneNumber, role } = verifiedUser;

      if (role !== "admin") {
        const isUserExists = await User.isUserExists(phoneNumber);
        if (!isUserExists) {
          throw new ApiError(httpStatus.NOT_FOUND, "User does not exists");
        }
      }

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }

      next();
    } catch (err) {
      next(err);
    }
  };

export default auth;
