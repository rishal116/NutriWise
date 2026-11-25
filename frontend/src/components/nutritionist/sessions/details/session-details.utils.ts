
import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";

import { INDIA_TIME_ZONE } from "./session-details.constants";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  timeZone: INDIA_TIME_ZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  timeZone: INDIA_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export function formatSessionDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Invalid date"
    : DATE_FORMATTER.format(date);
}

export function formatSessionTime(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Invalid time"
    : `${TIME_FORMATTER.format(date)} IST`;
}

export function formatSessionPrice(
  pricingType: NutriSessionDetailsResponseDTO["pricingType"],
  pricing: NutriSessionDetailsResponseDTO["pricing"],
): string {
  if (pricingType === "free") {
    return "Free";
  }

  if (!pricing) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: pricing.currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(pricing.amount);
}
