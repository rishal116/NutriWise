import { MeetingDetails } from "../../../types/user/meeting/user-meeting-details.type";
import { UserMeetingDetailsResponseDTO } from "../../../dtos/user/meeting/user-meeting-details-response.dto";

export class UserMeetingDetailsMapper {
  static toResponseDTO(meeting: MeetingDetails): UserMeetingDetailsResponseDTO {
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
      ...(meeting.startedAt && {
        startedAt: meeting.startedAt,
      }),
      ...(meeting.endedAt && {
        endedAt: meeting.endedAt,
      }),
      ...(meeting.cancelledBy && {
        cancelledBy: meeting.cancelledBy,
      }),
      ...(meeting.cancellationReason && {
        cancellationReason: meeting.cancellationReason,
      }),
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }
}
