import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { User } from "../User/user.model";
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from "./auth.interface";
import httpStatus from "http-status";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  const isUserExists = await User.isUserExists(phoneNumber);

  const { phoneNumber: userPhoneNumber, role } = isUserExists;

  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exists");
  }

  if (
    isUserExists.password &&
    !(await User.isPasswordMatched(password, isUserExists?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  // create token
  const accessToken = jwtHelpers.createToken(
    {
      phoneNumber: userPhoneNumber,
      role: role,
    },
    config.jwt.secret as Secret,
    {
      expiresIn: config.jwt.expires_in as string,
    },
  );

  const refreshToken = jwtHelpers.createToken(
    {
      phoneNumber: userPhoneNumber,
      role: role,
    },
    config.jwt.refresh_secret as Secret,
    {
      expiresIn: config.jwt.refresh_expires_in,
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    console.log(err);
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { phoneNumber: userPhoneNumber } = verifiedToken;

  const isUserExists = await User.isUserExists(userPhoneNumber);

  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exists");
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      phoneNumber: isUserExists.phoneNumber,
      role: isUserExists.role,
    },
    config.jwt.secret as Secret,
    {
      expiresIn: config.jwt.expires_in,
    },
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
