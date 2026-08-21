import { MeetingCard } from "../../../types/user/meeting/user-meeting-card.type";
import { UserMeetingListResponseDTO } from "../../../dtos/user/meeting/user-meeting-list-response.dto";

export class UserMeetingListMapper {
  static toResponseDTO(
    meeting: MeetingCard,
  ): UserMeetingListResponseDTO {
    return {
      id: meeting._id,

      title: meeting.title,

      nutritionist: {
        id: meeting.nutritionist._id,
        fullName: meeting.nutritionist.fullName,
        email: meeting.nutritionist.email,
        ...(meeting.nutritionist.profileImage && {
          profileImage: meeting.nutritionist.profileImage,
        }),
      },

      scheduledAt: meeting.scheduledAt,

      durationInMinutes: meeting.durationInMinutes,

      status: meeting.status,

      type: meeting.type,
    };
  }

  static toResponseDTOList(
    meetings: MeetingCard[],
  ): UserMeetingListResponseDTO[] {
    return meetings.map((meeting) =>
      this.toResponseDTO(meeting),
    );
  }
}