
import { Types } from "mongoose";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";

export function toObjectId(
  value: string | Types.ObjectId,
): Types.ObjectId {
  if (value instanceof Types.ObjectId) {
    return value;
  }

  if (!Types.ObjectId.isValid(value)) {
    throw new CustomError("Invalid ID", StatusCode.BAD_REQUEST);
  }

  return new Types.ObjectId(value);
}
