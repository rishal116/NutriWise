export const USER_SESSION_SORT_OPTIONS = [
  "upcoming",
  "latest",
  "oldest",
  "title_asc",
  "title_desc",
] as const;

export type UserSessionSortBy =
  (typeof USER_SESSION_SORT_OPTIONS)[number];