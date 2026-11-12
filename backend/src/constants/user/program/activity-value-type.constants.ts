export const ACTIVITY_VALUE_TYPES = [
  "boolean",
  "number",
  "duration",
  "photo",
  "text",
] as const;

export type ActivityValueType = (typeof ACTIVITY_VALUE_TYPES)[number];
