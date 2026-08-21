export enum MeetingStatus {
  SCHEDULED = "scheduled",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum MeetingType {
  VIDEO = "video",
  AUDIO = "audio",
}

export enum MeetingSortBy {
  SCHEDULED_AT = "scheduledAt",
  CREATED_AT = "createdAt",
  TITLE = "title",
}

export enum MeetingSortOrder {
  ASC = "asc",
  DESC = "desc",
}