import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessage = result.error.issues[0].message;

      throw new CustomError(errorMessage, StatusCode.BAD_REQUEST);
    }

    req.body = result.data;

    next();
  };
