import express from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authValidation } from "./auth.validation.js";
import { AuthControllers } from "./auth.controller.js";
import { checkOTP } from "../middlewares/auth.js";

const router = express.Router();


router.post(
  "/register",
  validateRequest(authValidation.registerUser),
  AuthControllers.registerUser
); 

router.post(
  "/resend-otp",
  validateRequest(authValidation.forgotPassword),
  AuthControllers.forgotPassword,
)

router.post(
  "/login",
  validateRequest(authValidation.loginUser),
  AuthControllers.loginUser
);

router.post(
  "/forgot-password",
  validateRequest(authValidation.forgotPassword),
  AuthControllers.forgotPassword
);

router.post(
  "/verify-otp",
  validateRequest(authValidation.verifyOtp),
  AuthControllers.verifyOtp
);

router.post(
  "/reset-password",
  validateRequest(authValidation.resetPassword),
  checkOTP,
  AuthControllers.resetPassword
);



export const AuthRouters = router;
