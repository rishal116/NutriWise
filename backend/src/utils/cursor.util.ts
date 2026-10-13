import { Types } from "mongoose";

import { CursorData } from "../types/cursor.types";

export function encodeCursor(cursor: CursorData): string {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

export function decodeCursor(cursor?: string): CursorData | null {
  if (!cursor) {
    return null;
  }

  try {
    const decoded: unknown = JSON.parse(
      Buffer.from(cursor, "base64url").toString("utf-8"),
    );

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("id" in decoded) ||
      typeof decoded.id !== "string" ||
      !Types.ObjectId.isValid(decoded.id) ||
      !("value" in decoded) ||
      !(
        typeof decoded.value === "string" || typeof decoded.value === "number"
      ) ||
      ("sortKey" in decoded &&
        decoded.sortKey !== undefined &&
        typeof decoded.sortKey !== "string")
    ) {
      throw new Error("Invalid cursor");
    }

    return decoded as CursorData;
  } catch {
    throw new Error("Invalid cursor");
  }
}
