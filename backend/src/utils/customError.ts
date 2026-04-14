import { StatusCode } from "../enums/statusCode.enum";
import logger from "./logger";

export class CustomError extends Error {
  public statusCode: StatusCode;
  public isOperational: boolean;
  public originalError?: unknown;

  constructor(
    message: string,
    statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR,
    originalError?: unknown,
  ) {
    super(message);

    this.name = "CustomError";
    this.statusCode = statusCode;
    this.isOperational = true;
    this.originalError = originalError;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export function handleRepositoryError(error: unknown, message: string): never {
  if (error instanceof CustomError) {
    throw error;
  }

  logger.error("Repository error", { error });

  throw new CustomError(message, StatusCode.INTERNAL_SERVER_ERROR, error);
}
