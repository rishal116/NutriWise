
import {
  MeetingStatus,
  MeetingSortBy,
  MeetingSortOrder,
} from "@/enums/nutritionist/meeting/meeting.enum";

export interface MeetingListQueryDTO {
  limit?: number;
  cursor?: string;
  search?: string;
  status?: MeetingStatus;
  sortBy?: MeetingSortBy;
  sortOrder?: MeetingSortOrder;
}
