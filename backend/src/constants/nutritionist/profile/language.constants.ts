export const LANGUAGES = [
  "english",
  "hindi",
  "malayalam",
  "tamil",
  "kannada",
  "telugu",
  "marathi",
  "gujarati",
  "bengali",
  "urdu",
] as const;

export type Language = (typeof LANGUAGES)[number];
