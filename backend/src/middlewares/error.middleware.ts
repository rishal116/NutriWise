import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global Error Middleware:", err);

  const status = err instanceof CustomError ? err.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
  const message = err instanceof CustomError ? err.message : "Something went wrong";

  res.status(status).json({
    success: false,
    error: message,
  });
};

