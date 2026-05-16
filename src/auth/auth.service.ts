import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../config/index.js";
import ApiError from "../errors/ApiError.js";
import sentEmailUtility from "../utils/sentEmailUtility.js";
import { IRegisterUser, IUserLogin } from "./auth.interface .js";
import { jwtHelpers } from "../helpers/jwtHelpers.js";
import { emailTemplate } from "../utils/emailNotifications/emailHTML.js";
import User from "../model/user.js";
import Otp from "../model/otp.js";

const registerUserIntoDB = async (payload: IRegisterUser) => {
  payload.email = payload.email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser && existingUser.socialLoginType !== "EMAIL_PASSWORD") {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Please login with your Google account"
    );
  }

  if (existingUser && existingUser.isVerified === true) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "User already exists with this email"
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const user = await User.findOneAndUpdate(
    { email: payload.email },
    {
      email: payload.email,
      password: hashedPassword,
      fullName: payload.fullName,
      fcmToken: payload?.fcmToken,
    },
    { upsert: true, new: true }
  );

  const otpCode = Math.floor(100000 + Math.random() * 900000);
  const message = `Please verify your email by entering this otp: ${otpCode}`;
  const emailSubject = "OTP Verification";
  const emailText = message;
  const emailHTML = emailTemplate(otpCode);
  await sentEmailUtility(payload.email, emailSubject, emailText, emailHTML);
  const OTP_EXPIRY_TIME = Number(config.otp_expiry_time) * 60 * 1000;

  const expiry = new Date(Date.now() + OTP_EXPIRY_TIME);

  await Otp.findOneAndUpdate(
    { userId: user._id },
    {
      otpCode: otpCode,
      userId: user._id,
      expiry,
    },
    { upsert: true, new: true }
  );

  return {
    userId: user._id,
  };
};

const verifyOtp = async (payload: { userId: string; otpCode: number; type: string }) => {
  const otpData = await Otp.findOne({
    userId: payload.userId,
    otpCode: payload.otpCode,
  });

  if (!otpData) {
    throw new ApiError(httpStatus.NOT_FOUND, "OTP not found");
  }

  if (otpData.expiry < new Date()) {
    throw new ApiError(httpStatus.REQUEST_TIMEOUT, "OTP expired");
  }

  await Otp.deleteOne({ _id: otpData._id });

  if (payload.type === "PASSWORD_RESET") {
    const resetToken = await jwtHelpers.generateOTPToken(
      {
        userId: payload.userId,
        hexCode: payload.otpCode as any,
      },
      config.jwt.reset_pass_secret as Secret,
      config.jwt.reset_pass_token_expires_in as string
    );

    return { resetToken };
  } else if (payload.type === "EMAIL_VERIFICATION") {
    const userData = await User.findByIdAndUpdate(
      payload.userId,
      { isVerified: true },
      { new: true }
    );

    if (!userData) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const accessToken = jwtHelpers.generateToken(
      {
        id: userData._id,
        email: userData.email as string,
        role: userData.role,
      },
      config.jwt.access_secret as Secret,
      config.jwt.access_expires_in as string
    );
    return { accessToken };
  }
};

const loginUserFromDB = async (payload: IUserLogin) => {
  const userData = await User.findOne({ email: payload.email });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password as string
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect");
  }

  if (userData.isVerified === false) {
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const message = `Please verify your email by entering this otp: ${otpCode}`;
    const emailSubject = "OTP Verification";
    const emailText = message;
    const emailHTML = emailTemplate(otpCode);
    await sentEmailUtility(payload.email, emailSubject, emailText, emailHTML);
    const OTP_EXPIRY_TIME = Number(config.otp_expiry_time) * 60 * 1000;

    const expiry = new Date(Date.now() + OTP_EXPIRY_TIME);

    const existingOtp = await Otp.findOne({ userId: userData._id });
    if (existingOtp) {
      await Otp.updateOne(
        { _id: existingOtp._id },
        {
          otpCode: otpCode,
          userId: userData._id,
          expiry,
        }
      );
    } else {
      await Otp.create({
        otpCode: otpCode,
        userId: userData._id,
        expiry,
      });
    }

    throw new ApiError(httpStatus.TEMPORARY_REDIRECT, `${userData._id}`);
  } else {
    if (payload.fcmToken) {
      await User.updateOne(
        { _id: userData._id },
        { fcmToken: payload.fcmToken }
      );
    }

    const accessToken = jwtHelpers.generateToken(
      {
        id: userData._id,
        email: userData.email as string,
        role: userData.role,
      },
      config.jwt.access_secret as Secret,
      config.jwt.access_expires_in as string
    );

    return {
      id: userData._id,
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone,
      role: userData.role,
      address: userData.address,
      gender: userData.dateOfBirth,
      profileImage: userData.profileImage,
      accessToken,
    };
  }
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await User.findOne({ email: payload.email });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const OTP_EXPIRY_TIME = Number(config.otp_expiry_time) * 60 * 1000;
  const expiry = new Date(Date.now() + OTP_EXPIRY_TIME);

  const otpCode = Math.floor(100000 + Math.random() * 900000);

  const emailSubject = "OTP Verification";
  const emailText = `Your OTP is: ${otpCode}`;
  const emailHTML = emailTemplate(otpCode);
  await sentEmailUtility(payload.email, emailSubject, emailText, emailHTML);

  const existingOtp = await Otp.findOne({ userId: userData._id });

  if (existingOtp) {
    await Otp.updateOne(
      { _id: existingOtp._id },
      {
        otpCode: otpCode,
        userId: userData._id,
        expiry,
      }
    );
  } else {
    await Otp.create({
      otpCode: otpCode,
      userId: userData._id,
      expiry,
    });
  }
  return {
    userId: userData._id,
  };
};

const resetPassword = async (userId: string, newPassword: string) => {
  const hashedPassword: string = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.updateOne({ _id: userId }, { password: hashedPassword });

  return {
    message: "please login",
  };
};

const socialLogin = async (payload: any) => {
  const userData = await User.findOne({ email: payload?.email });

  if (!userData) {
    const user = await User.create({
      email: payload?.email,
      fullName: payload?.fullName,
      phone: payload?.phone,
      profileImage: payload?.profileImage,
      fcmToken: payload?.fcmToken,
      socialLoginType: payload?.socialLoginType,
      isVerified: true,
    });

    const accessToken = jwtHelpers.generateToken(
      {
        id: user._id,
        email: user.email as string,
        fullName: user.fullName as string,
        profileImage: user.profileImage as string,
        role: user.role,
      },
      config.jwt.access_secret as Secret,
      config.jwt.access_expires_in as string
    );
    const refreshToken = jwtHelpers.generateToken(
      {
        id: user._id,
        email: user.email as string,
        fullName: user.fullName as string,
        profileImage: user.profileImage as string,
        role: user.role,
      },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );
    return {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      profileImage: user.profileImage,
      accessToken,
      refreshToken,
    };
  }

  if (payload.fcmToken) {
    await User.updateOne({ _id: userData._id }, { fcmToken: payload.fcmToken });
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData._id,
      email: userData.email as string,
      fullName: userData.fullName as string,
      profileImage: userData.profileImage as string,
      role: userData.role,
    },
    config.jwt.access_secret as Secret,
    config.jwt.access_expires_in as string
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      id: userData._id,
      email: userData.email as string,
      fullName: userData.fullName as string,
      profileImage: userData.profileImage as string,
      role: userData.role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    id: userData._id,
    email: userData.email,
    fullName: userData.fullName,
    phone: userData.phone,
    profileImage: userData.profileImage,
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  loginUserFromDB,
  registerUserIntoDB,
  forgotPassword,
  verifyOtp,
  resetPassword,
  socialLogin,
};