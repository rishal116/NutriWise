import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";
import logger from "../utils/logger";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = StatusCode.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  else if (err instanceof Error) {
    message = err.message;
  }

  logger.error("Global Error Middleware", {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    message,
  });

  return res.status(statusCode).json({
    success: false,
    message,
  });
};