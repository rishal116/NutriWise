export const CURRENCIES = [
  "inr",
  "usd",
  "eur",
  "gbp",
  "aed",
] as const;

export type Currency = (typeof CURRENCIES)[number];