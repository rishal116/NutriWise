import { Types } from "mongoose";

import { CustomError } from "./customError";
import { StatusCode } from "../enums/statusCode.enum";

export const toObjectId = (id: string, fieldName: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throw new CustomError(`Invalid ${fieldName}`, StatusCode.BAD_REQUEST);
  }

  return new Types.ObjectId(id);
};
