import { IMeetingWithNutri } from "../../types/meetingWithNutri.populated";
import { UserMeetingResponseDTO } from "../../dtos/user/userMeetingResponse.dto";

export class UserMeetingMapper {
  static toResponseDTO(
    meeting: IMeetingWithNutri
  ): UserMeetingResponseDTO {
    return {
      id: meeting._id.toString(),
      title: meeting.title,
      roomId: meeting.roomId,
      userId: meeting.userId._id.toString(),
      nutritionist: {
        id: meeting.nutritionistId._id.toString(),
        fullName: meeting.nutritionistId.fullName,
        email: meeting.nutritionistId.email,
      },
      scheduledAt: meeting.scheduledAt,
      startedAt: meeting.startedAt,
      endedAt: meeting.endedAt,
      status: meeting.status,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }

  static toResponseDTOList(
    meetings: IMeetingWithNutri[]
  ): UserMeetingResponseDTO[] {
    return meetings.map(this.toResponseDTO);
  }
}
