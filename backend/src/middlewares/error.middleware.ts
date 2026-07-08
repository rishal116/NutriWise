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
  const isCustomError = err instanceof CustomError;

  const status = isCustomError
    ? err.statusCode
    : StatusCode.INTERNAL_SERVER_ERROR;

  const message = isCustomError ? err.message : "Something went wrong";

  if (isCustomError && err.isOperational) {
    logger.warn(message, {
      status,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    logger.error("Global Error Middleware", {
      message,
      status,
      error: err,
    });

    console.log("ERROR OBJECT:", err);
  } else {
    logger.error("Unexpected Error", {
      message,
      status,
      method: req.method,
      url: req.originalUrl,
      error: err,
    });

    if (err instanceof Error) {
      console.error(err.stack);
    }
  }

  return res.status(status).json({
    success: false,
    message,
  });
};
