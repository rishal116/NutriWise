import type { IPublicSessionProjection } from "../../../types/public/session/public-session.projection";
import type { SessionRoomDetailsResponseDTO } from "../../../dtos/public/session/session-room-details-response.dto";

export class SessionRoomMapper {
  static toResponse(
    session: IPublicSessionProjection,
  ): SessionRoomDetailsResponseDTO {
    return {
      sessionId: session.sessionId,
      title: session.title,
      description: session.description,
      type: session.type,
      status: session.status,
      scheduledAt: session.scheduledAt,
      duration: session.duration,
      nutritionist: {
        nutritionistId: session.nutritionist.nutritionistId,
        name: session.nutritionist.name,
        ...(session.nutritionist.profileImage && {
          profileImage: session.nutritionist.profileImage,
        }),
      },
    };
  }
}