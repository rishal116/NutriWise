import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { CreateMeetingDTO } from "../../../dtos/nutritionist/meeting/create-meeting.dto";
import { MeetingCardResponseDTO } from "../../../dtos/nutritionist/meeting/meeting-card-response.dto";
import { MeetingDetailsResponseDTO } from "../../../dtos/nutritionist/meeting/meeting-details-response.dto";
import { MeetingListQueryDTO } from "../../../dtos/nutritionist/meeting/meeting-list-query.dto";
import { UpdateMeetingDTO } from "../../../dtos/nutritionist/meeting/update-meeting.dto";
import { MeetingStatus } from "../../../models/meeting.model";

export interface INutriMeetingService {
  getMeetings(
    nutritionistId: string,
    query: MeetingListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<MeetingCardResponseDTO>>;

  getMeetingDetails(
    nutritionistId: string,
    meetingId: string,
  ): Promise<MeetingDetailsResponseDTO>;

  createMeeting(nutritionistId: string, data: CreateMeetingDTO): Promise<void>;

  updateMeetingStatus(roomId: string, status: MeetingStatus): Promise<void>;

  updateMeeting(
    nutritionistId: string,
    meetingId: string,
    data: UpdateMeetingDTO,
  ): Promise<void>;

  cancelMeeting(
    nutritionistId: string,
    meetingId: string,
    cancellationReason: string,
  ): Promise<void>;
}
