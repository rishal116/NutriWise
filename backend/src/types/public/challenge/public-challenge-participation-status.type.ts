export const PUBLIC_CHALLENGE_PARTICIPATION_STATUSES = [
  "not_joined",
  "active",
  "completed",
  "abandoned",
] as const;

export type PublicChallengeParticipationStatus =
  (typeof PUBLIC_CHALLENGE_PARTICIPATION_STATUSES)[number];