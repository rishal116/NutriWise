export enum MeetingStatus {
  SCHEDULED = "scheduled",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum MeetingSortBy {
  SCHEDULED_AT = "scheduledAt",
  CREATED_AT = "createdAt",
  TITLE = "title",
}

export enum MeetingCancelledBy {
  USER = "user",
  NUTRITIONIST = "nutritionist",
}

export enum MeetingSortOrder {
  ASC = "asc",
  DESC = "desc",
}
