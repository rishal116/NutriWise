import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";

export const validateDtoMiddleware = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    const dtoInstance = plainToInstance(DtoClass, req.body);

    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      const messages = errors
        .flatMap((err) => Object.values(err.constraints || {}))
        .join(", ");
      throw new CustomError(messages, 400);
    }

    next();
  };
};

export const validateDto = async (DtoClass: any, data: any) => {
  const dtoInstance = plainToInstance(DtoClass, data);
  const errors = await validate(dtoInstance);

  if (errors.length > 0) {
    const messages = errors
      .flatMap((err) => Object.values(err.constraints || {}))
      .join(", ");
    throw new CustomError(messages, 400);
  }
};
