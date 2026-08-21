import { MeetingDetails } from "../../../types/nutritionist/meeting/meeting-details.type";
import { MeetingDetailsResponseDTO } from "../../../dtos/nutritionist/meeting/meeting-details-response.dto";

export class MeetingDetailsMapper {
  static toResponseDTO(meeting: MeetingDetails): MeetingDetailsResponseDTO {
    return {
      id: meeting._id.toString(),
      title: meeting.title,
      nutritionistId: meeting.nutritionistId.toString(),

      user: {
        id: meeting.user._id.toString(),
        fullName: meeting.user.fullName,
        email: meeting.user.email,
        ...(meeting.user.profileImage && {
          profileImage: meeting.user.profileImage,
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
