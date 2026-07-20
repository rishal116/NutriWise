import { NutritionistCursor } from "../types/cursor.types";

export function encodeCursor(cursor: NutritionistCursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
}

export function decodeCursor(cursor?: string): NutritionistCursor | null {
  if (!cursor) {
    return null;
  }

  return JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
}
