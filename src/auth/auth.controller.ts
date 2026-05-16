import httpStatus from "http-status"; 
import { Request, Response } from "express"; 
import catchAsync from "../helpers/catchAsync.js";
import sendResponse from "../helpers/sendResponse.js";
import { AuthServices } from "./auth.service.js";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body; 
  const result = await AuthServices.registerUserIntoDB(payload);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User registered successfully please verify your email",
    data: result,
  });
});




const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUserFromDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,

    data: result,
  });
});



const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "OTP sent successfully",
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthServices.verifyOtp(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "OTP verified successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const newPassword = req.body.newPassword;
  const result = await AuthServices.resetPassword(userId, newPassword);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password Reset successfully please login",
    data: result,
  });
});



export const AuthControllers = {
  registerUser, 
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
