import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { User } from "../User/user.model";
import { ILoginUser, ILoginUserResponse } from "./auth.interface";
import httpStatus from "http-status";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> {
    const {phoneNumber, password} = payload;

    const isUserExists = await User.isUserExists(phoneNumber);

    const {phoneNumber: userPhoneNumber, role} = isUserExists;

    if(!isUserExists) {
        throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exists");
    }

    if(isUserExists.password && !(await User.isPasswordMatched(password, isUserExists?.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }

    // create token
    const accessToken = jwtHelpers.createToken({
        phoneNumber: userPhoneNumber,
        role: role,
    }, config)
}