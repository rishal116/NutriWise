import { MeetingCard } from "../../../types/nutritionist/meeting/meeting-card.type";
import { MeetingCardResponseDTO } from "../../../dtos/nutritionist/meeting/meeting-card-response.dto";

export class MeetingMapper {
  static toCardResponseDTO(meeting: MeetingCard): MeetingCardResponseDTO {
    return {
      id: meeting._id,
      title: meeting.title,
      user: {
        id: meeting.user._id,
        fullName: meeting.user.fullName,
        email: meeting.user.email,
        profileImage:meeting.user.profileImage
      },
      scheduledAt: meeting.scheduledAt,
      durationInMinutes: meeting.durationInMinutes,
      status: meeting.status,
      type: meeting.type,
    };
  }

  static toCardResponseDTOList(
    meetings: MeetingCard[],
  ): MeetingCardResponseDTO[] {
    return meetings.map((meeting) => this.toCardResponseDTO(meeting));
  }
}
