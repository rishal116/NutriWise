import {
  MeetingSortBy,
  MeetingSortOrder,
} from "@/enums/user/meeting/user-meeting.enum";

export interface UserMeetingListQueryDTO {
  limit?: number;
  cursor?: string;
  search?: string;
  status?: string;
  type?: string;
  sortBy?: MeetingSortBy;
  sortOrder?: MeetingSortOrder;
}