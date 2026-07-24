import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";

export const validateDtoMiddleware = <T extends object>(
  DtoClass: ClassConstructor<T>,
) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const dto = plainToInstance(DtoClass, req.body);

    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .flatMap((error) => Object.values(error.constraints ?? {}))
        .join(", ");

      return next(new CustomError(messages, StatusCode.BAD_REQUEST));
    }

    next();
  };
};

export const validateDto = async <T extends object>(
  DtoClass: ClassConstructor<T>,
  payload: unknown,
): Promise<T> => {
  const dto = plainToInstance(DtoClass, payload);

  const errors = await validate(dto);

  if (errors.length > 0) {
    const messages = errors
      .flatMap((error) => Object.values(error.constraints ?? {}))
      .join(", ");

    throw new CustomError(messages, StatusCode.BAD_REQUEST);
  }

  return dto;
};
