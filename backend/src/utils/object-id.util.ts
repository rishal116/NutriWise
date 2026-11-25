import { Types } from "mongoose";

import { CustomError } from "./customError";
import { StatusCode } from "../enums/statusCode.enum";

export const toObjectId = (
  id: string | Types.ObjectId,
  fieldName: string,
): Types.ObjectId => {
  if (id instanceof Types.ObjectId) {
    return id;
  }

  if (!Types.ObjectId.isValid(id)) {
    throw new CustomError(
      `Invalid ${fieldName}`,
      StatusCode.BAD_REQUEST,
    );
  }

  return new Types.ObjectId(id);
};