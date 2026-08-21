import { MeetingCard } from "../../../../types/user/meeting/user-meeting-card.type";
import { MeetingDetails } from "../../../../types/user/meeting/user-meeting-details.type";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { UserMeetingListQueryDTO } from "../../../../dtos/user/meeting/user-meeting-list-query.dto";
import { IMeeting, MeetingStatus } from "../../../../models/meeting.model";

export interface IUserMeetingRepository {
  findUserMeetings(
    userId: string,
    query: UserMeetingListQueryDTO,
  ): Promise<CursorPaginationResult<MeetingCard>>;

  findMeetingDetails(
    userId: string,
    meetingId: string,
  ): Promise<MeetingDetails | null>;

  findByRoomId(roomId: string): Promise<MeetingDetails | null>;

  updateStatusByRoomId(
    roomId: string,
    status: MeetingStatus,
    extraFields?: Partial<IMeeting>,
  ): Promise<MeetingDetails | null>;
}
