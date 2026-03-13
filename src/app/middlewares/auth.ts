import { NextFunction, Request, Response } from "express";
import { ENUM_USER_ROLE } from "../../enums/user";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";

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
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser;
    } catch (err) {
      next(err);
    }
  };
