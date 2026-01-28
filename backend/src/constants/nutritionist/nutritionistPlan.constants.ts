export const PRICING_RULES = {
  BEGINNER: {
    minPrice: 500,
    maxPrice: 2000,
  },
  VERIFIED: {
    minPrice: 1500,
    maxPrice: 5000,
  },
  EXPERT: {
    minPrice: 3000,
    maxPrice: 10000,
  },
  TOP_COACH: {
    minPrice: 5000,
    maxPrice: 25000,
  },
} as const;

export const DEFAULT_CURRENCY = "USD";

export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  India: "INR",
  USA: "USD",
  Canada: "USD",
  UK: "GBP",
  Germany: "EUR",
  France: "EUR",
  UAE: "AED",
  Australia: "AUD",
};
