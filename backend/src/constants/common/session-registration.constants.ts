export const SESSION_REGISTRATION_STATUSES = [
  "registered",
  "cancelled",
  "attended",
  "absent",
] as const;

export type SessionRegistrationStatus =
  (typeof SESSION_REGISTRATION_STATUSES)[number];
