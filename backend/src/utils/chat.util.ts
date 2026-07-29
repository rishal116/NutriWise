import { Types } from "mongoose";

export const buildDirectKey = (
  firstUserId: string | Types.ObjectId,
  secondUserId: string | Types.ObjectId,
): string => {
  return [firstUserId.toString(), secondUserId.toString()].sort().join("_");
};
