import { IMeetingWithUser } from "../../types/meetingWithUser.populated";
import { MeetingResponseDTO } from "../../dtos/nutritionist/meetingResponse.dto";

export class MeetingMapper {
  static toResponseDTO(
    meeting: IMeetingWithUser
  ): MeetingResponseDTO {
    return {
      id: meeting._id.toString(),
      title: meeting.title,
      roomId: meeting.roomId,

      user: {
        id: meeting.userId._id.toString(),
        fullName: meeting.userId.fullName,
        email: meeting.userId.email,
      },

      nutritionistId: meeting.nutritionistId.toString(),
      scheduledAt: meeting.scheduledAt,
      startedAt: meeting.startedAt,
      endedAt: meeting.endedAt,
      status: meeting.status,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }

  static toResponseDTOList(
    meetings: IMeetingWithUser[]
  ): MeetingResponseDTO[] {
    return meetings.map(this.toResponseDTO);
  }
}
