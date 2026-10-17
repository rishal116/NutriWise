import { Types } from "mongoose";
import type { CursorData } from "../types/cursor.types";

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

    if (typeof decoded !== "object" || decoded === null) {
      throw new Error("Invalid cursor");
    }

    if (
      !("id" in decoded) ||
      typeof decoded.id !== "string" ||
      !Types.ObjectId.isValid(decoded.id) ||
      new Types.ObjectId(decoded.id).toHexString() !== decoded.id.toLowerCase()
    ) {
      throw new Error("Invalid cursor");
    }

    if (
      !("value" in decoded) ||
      !(
        typeof decoded.value === "string" ||
        (typeof decoded.value === "number" && Number.isFinite(decoded.value))
      )
    ) {
      throw new Error("Invalid cursor");
    }

    if (
      "sortKey" in decoded &&
      decoded.sortKey !== undefined &&
      typeof decoded.sortKey !== "string"
    ) {
      throw new Error("Invalid cursor");
    }

    return decoded as CursorData;
  } catch {
    throw new Error("Invalid cursor");
  }
}
