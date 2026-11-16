export const USER_PROGRAM_SORT = {
  NEWEST: "newest",
  OLDEST: "oldest",
  START_DATE: "start_date",
  END_DATE: "end_date",
} as const;

export type UserProgramSort =
  (typeof USER_PROGRAM_SORT)[keyof typeof USER_PROGRAM_SORT];
