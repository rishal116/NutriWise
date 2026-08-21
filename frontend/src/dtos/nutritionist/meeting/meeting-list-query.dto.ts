import {
  MeetingStatus,
  MeetingType,
  MeetingSortBy,
  MeetingSortOrder,
} from "@/enums/nutritionist/meeting/meeting.enum";

export interface MeetingListQueryDTO {
  limit?: number;
  cursor?: string;
  search?: string;
  status?: MeetingStatus;
  type?: MeetingType;
  sortBy?: MeetingSortBy;
  sortOrder?: MeetingSortOrder;
}
