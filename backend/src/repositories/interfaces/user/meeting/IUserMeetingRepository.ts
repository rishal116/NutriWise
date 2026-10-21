import { MeetingCard } from "../../../../types/user/meeting/user-meeting-card.type";
import { MeetingDetails } from "../../../../types/user/meeting/user-meeting-details.type";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { UserMeetingListQueryDTO } from "../../../../dtos/user/meeting/user-meeting-list-query.dto";
import { IMeeting } from "../../../../models/meeting.model";
import { IBaseRepository } from "../../common/IBaseRepository";

export interface IUserMeetingRepository extends IBaseRepository<IMeeting> {
  findUserMeetings(
    userId: string,
    query: UserMeetingListQueryDTO,
  ): Promise<CursorPaginationResult<MeetingCard>>;

  findMeetingDetails(
    userId: string,
    meetingId: string,
  ): Promise<MeetingDetails | null>;

  findByRoomId(roomId: string): Promise<MeetingDetails | null>;

  cancelMeeting(userId: string, meetingId: string): Promise<boolean>;
}
