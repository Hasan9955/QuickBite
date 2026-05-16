import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
  
import handleZodError from "../errors/handleZodError.js";
import handleClientError from "../errors/handleClientError.js";
import handleValidationError from "../errors/handleValidationError.js";
import { IGenericErrorMessage } from "../interface/error.js";
import ApiError from "../errors/ApiError.js";
import config from "../config/index.js";
 
const GlobalErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR as number;
  let message = "Something went wrong";
  let errorMessages: IGenericErrorMessage[] = [];
 
  /* -------------------- ZOD VALIDATION (TOP PRIORITY) -------------------- */
  if (error instanceof ZodError) {
    const simplified = handleZodError(error);
    statusCode  = simplified.statusCode;
    message = simplified.message;
    errorMessages = simplified.errorMessages;
  }
 
  /* -------------------- CUSTOM APPLICATION ERROR -------------------- */
  else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = [
      {
        path: "",
        message: error.message,
      },
    ];
  }
 
  /* -------------------- PRISMA VALIDATION ERROR -------------------- */
  // else if (error instanceof Prisma.PrismaClientValidationError) {
  //   const simplified = handleValidationError(error);
  //   statusCode = simplified.statusCode;
  //   message = simplified.message;
  //   errorMessages = simplified.errorMessages;
  // }
 
  // /* -------------------- PRISMA KNOWN REQUEST ERROR -------------------- */
  // else if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //   const simplified = handleClientError(error);
  //   statusCode = simplified.statusCode;
  //   message = simplified.message;
  //   errorMessages = simplified.errorMessages;
  // }
 
  // /* -------------------- PRISMA INIT ERROR -------------------- */
  // else if (error instanceof Prisma.PrismaClientInitializationError) {
  //   statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  //   message = "Database connection failed";
  //   errorMessages = [
  //     {
  //       path: "",
  //       message: "Prisma failed to initialize",
  //     },
  //   ];
  // }
 
  // /* -------------------- PRISMA ENGINE PANIC -------------------- */
  // else if (error instanceof Prisma.PrismaClientRustPanicError) {
  //   statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  //   message = "Critical database error";
  //   errorMessages = [
  //     {
  //       path: "",
  //       message: "Prisma engine crashed",
  //     },
  //   ];
  // }
 
  // /* -------------------- UNKNOWN PRISMA ERROR -------------------- */
  // else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
  //   statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  //   message = "Unknown database error";
  //   errorMessages = [
  //     {
  //       path: "",
  //       message: "Unknown Prisma error",
  //     },
  //   ];
  // }
 
  /* -------------------- JS RUNTIME ERRORS -------------------- */
  else if (error instanceof SyntaxError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid JSON payload";
    errorMessages = [
      {
        path: "",
        message: "Syntax error",
      },
    ];
  }
 
  else if (error instanceof TypeError || error instanceof ReferenceError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "Application runtime error";
    errorMessages = [
      {
        path: "",
        message: error.message,
      },
    ];
  }
 
  /* -------------------- FINAL FALLBACK (LAST ONLY) -------------------- */
  else if (error instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = error.message || "Unexpected error";
    errorMessages = [
      {
        path: "",
        message: error.message,
      },
    ];
  }
 
  /* -------------------- RESPONSE -------------------- */
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    ...(config.env !== "production" && {
      stack: error instanceof Error ? error.stack : undefined,
    }),
  });
};
 
export default GlobalErrorHandler;

























// import { Prisma } from "@prisma/client";
// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import { ZodError } from "zod";
// // import parsePrismaValidationError from "../../errors/parsePrismaValidationError";
// import config from "../../config";

// import handleClientError from "../errors/handleClientError";

// import handleZodError from "../errors/handleZodError";
// import { IGenericErrorMessage } from "../interface/error";
// import handleValidationError from "../errors/handleValidationError";
// import ApiError from "../errors/ApiError";


// const GlobalErrorHandler = (
//   error: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log(error);
//   let statusCode: any = httpStatus.INTERNAL_SERVER_ERROR;
//   let message = error.message || "Something went wrong!";
//   let errorMessages: IGenericErrorMessage[] = [];

//   // handle prisma client validation errors
//   if (error instanceof Prisma.PrismaClientValidationError) {
//     const simplifiedError = handleValidationError(error);
//     statusCode = simplifiedError.statusCode;
//     message = simplifiedError.message;
//     errorMessages = simplifiedError.errorMessages;
//   }

//   // Handle Zod Validation Errors
//   else if (error instanceof ZodError) {
//     const simplifiedError = handleZodError(error);
//     statusCode = simplifiedError.statusCode;
//     message = simplifiedError.message;
//     errorMessages = simplifiedError.errorMessages;
//   }

//   // Handle Prisma Client Known Request Errors
//   else if (error instanceof Prisma.PrismaClientKnownRequestError) {
//     const simplifiedError = handleClientError(error);
//     statusCode = simplifiedError.statusCode;
//     message = simplifiedError.message;
//     errorMessages = simplifiedError.errorMessages;
//   }

//   // Handle Custom ApiError
//   else if (error instanceof ApiError) {
//     statusCode = error?.statusCode;
//     message = error.message;
//     errorMessages = error?.message
//       ? [
//           {
//             path: "",
//             message: error?.message,
//           },
//         ]
//       : [];
//   } 
  
//   // Handle Errors
//   else if (error instanceof Error) {
//     message = error?.message;
//     errorMessages = error?.message
//       ? [
//           {
//             path: "",
//             message: error?.message,
//           },
//         ]
//       : [];
//   }

//   // Prisma Client Initialization Error
//   else if (error instanceof Prisma.PrismaClientInitializationError) {
//     statusCode = httpStatus.INTERNAL_SERVER_ERROR;
//     message =
//       "Failed to initialize Prisma Client. Check your database connection or Prisma configuration.";
//     errorMessages = [
//       {
//         path: "",
//         message: "Failed to initialize Prisma Client.",
//       },
//     ];
//   }

//   // Prisma Client Rust Panic Error
//   else if (error instanceof Prisma.PrismaClientRustPanicError) {
//     statusCode = httpStatus.INTERNAL_SERVER_ERROR;
//     message =
//       "A critical error occurred in the Prisma engine. Please try again later.";
//     errorMessages = [
//       {
//         path: "",
//         message: "Prisma Client Rust Panic Error",
//       },
//     ];
//   }

//   // Prisma Client Unknown Request Error
//   else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
//     statusCode = httpStatus.INTERNAL_SERVER_ERROR;
//     message = "An unknown error occurred while processing the request.";
//     errorMessages = [
//       {
//         path: "",
//         message: "Prisma Client Unknown Request Error",
//       },
//     ];
//   }

//   // Generic Error Handling (e.g., JavaScript Errors)
//   else if (error instanceof SyntaxError) {
//     statusCode = httpStatus.BAD_REQUEST;
//     message = "Syntax error in the request. Please verify your input.";
//     errorMessages = [
//       {
//         path: "",
//         message: "Syntax Error",
//       },
//     ];
//   } else if (error instanceof TypeError) {
//     statusCode = httpStatus.BAD_REQUEST;
//     message = "Type error in the application. Please verify your input.";
//     errorMessages = [
//       {
//         path: "",
//         message: "Type Error",
//       },
//     ];
//   } else if (error instanceof ReferenceError) {
//     statusCode = httpStatus.BAD_REQUEST;
//     message = "Reference error in the application. Please verify your input.";
//     errorMessages = [
//       {
//         path: "",
//         message: "Reference Error",
//       },
//     ];
//   }
//   // Catch any other error type
//   else {
//     message = "An unexpected error occurred!";
//     errorMessages = [
//       {
//         path: "",
//         message: "An unexpected error occurred!",
//       },
//     ];
//   }

//   res.status(statusCode).json({
//     success: false,
//     message,
//     errorMessages,
//     err: error,
//     stack: config.env !== "production" ? error?.stack : undefined,
//   });
// };

// export default GlobalErrorHandler;
