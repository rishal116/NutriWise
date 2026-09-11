import { MeetingDetails } from "../../../types/user/meeting/user-meeting-details.type";
import { UserMeetingDetailsResponseDTO } from "../../../dtos/user/meeting/user-meeting-details-response.dto";

export class UserMeetingDetailsMapper {
  static toResponseDTO(
    meeting: MeetingDetails,
  ): UserMeetingDetailsResponseDTO {
    return {
      id: meeting._id.toString(),

      title: meeting.title,

      nutritionist: {
        id: meeting.nutritionist._id.toString(),
        fullName: meeting.nutritionist.fullName,
        email: meeting.nutritionist.email,
        ...(meeting.nutritionist.profileImage && {
          profileImage: meeting.nutritionist.profileImage,
        }),
      },

      roomId: meeting.roomId,

      scheduledAt: meeting.scheduledAt,

      durationInMinutes: meeting.durationInMinutes,

      status: meeting.status,

      type: meeting.type,

      startedAt: meeting.startedAt,

      endedAt: meeting.endedAt,

      nutritionistJoinedAt: meeting.nutritionistJoinedAt,

      userJoinedAt: meeting.userJoinedAt,

      isCancelledByUser: meeting.isCancelledByUser,

      isCancelledByNutritionist: meeting.isCancelledByNutritionist,

      createdAt: meeting.createdAt,

      updatedAt: meeting.updatedAt,
    };
  }
}