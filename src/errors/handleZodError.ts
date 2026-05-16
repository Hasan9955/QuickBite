import { ZodError, ZodIssue } from "zod";
import { IGenericErrorMessage } from "../interface/error.js";
import { IGenericErrorResponse } from "../interface/common.js";



const handleZodError = (error: ZodError): IGenericErrorResponse => {

  const errors: IGenericErrorMessage[] = error.issues.map((issue: ZodIssue) => ({
    path: String(issue.path[issue.path.length - 1] ?? ""),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages: errors,
  };
};


export default handleZodError;
