import { NextFunction, Request, Response } from "express";
import { JwtPayload, Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import { jwtHelpers } from "../helpers/jwtHelpers.js";
import config from "../config/index.js";
import ApiError from "../errors/ApiError.js";
import User from "../model/user.js";

enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const headersAuth = req.headers.authorization;

      if (!headersAuth || !headersAuth.startsWith("Bearer ")) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Invalid authorization format!"
        );
      }
      const token: string | undefined = headersAuth?.split(" ")[1];
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_secret as Secret
      );

      if (!verifiedUser?.email) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }
      const { id } = verifiedUser;

      const user = await User.findById(id);

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
      }

      if (user.isDeleted == true) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This user is deleted!");
      }

      if (user.status === UserStatus.BLOCKED) {
        throw new ApiError(httpStatus.FORBIDDEN, "Your account is blocked!");
      }
      if (user.status === UserStatus.INACTIVE) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Your account is not activated yet!"
        );
      }
      if (user.status === UserStatus.PENDING) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Your account is not accepted yet!"
        );
      }

      req.user = verifiedUser as JwtPayload;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "Forbidden! You are not authorized!"
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export const checkOTP = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const headersAuth = req.headers.authorization;
    if (!headersAuth || !headersAuth.startsWith("Bearer ")) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Invalid authorization format!"
      );
    }
    const token: string | undefined = headersAuth?.split(" ")[1];

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.reset_pass_secret as Secret
    );

    if (!verifiedUser?.hexCode) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }
    const { userId } = verifiedUser;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }

    req.user = verifiedUser as JwtPayload;
    next();
  } catch (err) {
    next(err);
  }
};

export const optionalAuth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const headersAuth = req.headers.authorization;
      const token: string | undefined = headersAuth?.split(" ")[1];

      if (!token) {
        // No token provided, proceed without authentication
        return next();
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_secret as Secret
      );

      if (!verifiedUser?.email) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }
      const { id } = verifiedUser;

      const user = await User.findById(id);

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
      }

      if (user.status === UserStatus.BLOCKED) {
        throw new ApiError(httpStatus.FORBIDDEN, "Your account is blocked!");
      }

      req.user = verifiedUser as JwtPayload;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;