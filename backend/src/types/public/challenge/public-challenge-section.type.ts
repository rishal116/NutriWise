export const PUBLIC_CHALLENGE_SECTIONS = [
  "trending",
  "popular",
  "premium",
  "free",
  "new",
] as const;

export type PublicChallengeSection =
  (typeof PUBLIC_CHALLENGE_SECTIONS)[number];