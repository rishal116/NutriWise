import { IMeeting, MeetingStatus } from "../../../models/meeting.model";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { MeetingListQueryDTO } from "../../../dtos/nutritionist/meeting/meeting-list-query.dto";
import { IBaseRepository } from "../common/IBaseRepository";
import { MeetingDetails } from "../../../types/nutritionist/meeting/meeting-details.type";
import { MeetingCard } from "../../../types/nutritionist/meeting/meeting-card.type";

export interface INutriMeetingRepository extends IBaseRepository<IMeeting> {
  findByNutritionistId(
    nutritionistId: string,
    query: MeetingListQueryDTO,
  ): Promise<CursorPaginationResult<MeetingCard>>;

  findMeetingDetailsById(
    nutritionistId: string,
    meetingId: string,
  ): Promise<MeetingDetails | null>;

  findByRoomId(roomId: string): Promise<MeetingDetails | null>;

  updateStatusByRoomId(
    roomId: string,
    status: MeetingStatus,
    extraFields?: Partial<IMeeting>,
  ): Promise<MeetingDetails | null>;
}
