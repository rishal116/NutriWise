import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";

// ==========================================
// Generic DTO Constructor Type
// ==========================================
type ClassConstructor<T extends object> = {
  new (): T;
};

// ==========================================
// Format Validation Errors
// ==========================================
const formatValidationErrors = (errors: ValidationError[]): string[] => {
  return errors.flatMap((error) =>
    error.constraints ? Object.values(error.constraints) : []
  );
};

// ==========================================
// Middleware Validation
// ==========================================
export const validateDtoMiddleware = <T extends object>(
  DtoClass: ClassConstructor<T>
) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const dtoInstance = plainToInstance(DtoClass, req.body, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = formatValidationErrors(errors);

      throw new CustomError(
        `Validation failed: ${messages.join(", ")}`,
        StatusCode.BAD_REQUEST
      );
    }

    next();
  };
};

// ==========================================
// Service Layer Validation
// ==========================================
export const validateDto = async <T extends object>(
  DtoClass: ClassConstructor<T>,
  data: unknown
): Promise<void> => {
  const dtoInstance = plainToInstance(DtoClass, data, {
    enableImplicitConversion: true,
  });

  const errors = await validate(dtoInstance, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const messages = formatValidationErrors(errors);

    throw new CustomError(
      `Validation failed: ${messages.join(", ")}`,
      StatusCode.BAD_REQUEST
    );
  }
};