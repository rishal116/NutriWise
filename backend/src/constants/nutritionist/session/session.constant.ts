export const CREATE_SESSION_LIMITS = {
  titleMin: 5,
  titleMax: 100,
  descriptionMin: 20,
  descriptionMax: 2000,
  priceMin: 50,
  priceMax: 10000,
  durationMin: 15,
  durationMax: 180,
  participantsMin: 2,
  participantsMax: 100,
  thumbnailMaxBytes: 5 * 1024 * 1024,
} as const;