import type { IPublicSessionListItemProjection } from "../../../types/public/session/public-session-list-item.projection";
import type { IPublicSessionDetailsProjection } from "../../../types/public/session/public-session-details.projection";
import type { PublicSessionListItemResponseDTO } from "../../../dtos/public/session/public-session-list-response.dto";
import type { PublicSessionDetailsResponseDTO } from "../../../dtos/public/session/public-session-details-response.dto";
export type PublicSessionDetailsMappedDTO = Omit<
  PublicSessionDetailsResponseDTO,
  "isRegistered"
>;

export class PublicSessionMapper {
  static toListResponse(
    session: IPublicSessionListItemProjection,
  ): PublicSessionListItemResponseDTO {
    return {
      sessionId: session.sessionId,
      title: session.title,
      description: session.description,
      type: session.type,
      pricing: {
        type: session.pricing.type,
        amount: session.pricing.amount,
        currency: session.pricing.currency,
      },
      scheduledAt: session.scheduledAt,
      durationInMinutes: session.durationInMinutes,
      maxParticipants: session.maxParticipants,
      thumbnailUrl: session.thumbnailUrl,
      status: session.status,
      nutritionist: {
        nutritionistId: session.nutritionist.nutritionistId,
        name: session.nutritionist.name,
        profileImage: session.nutritionist.profileImage,
      },
    };
  }

  static toDetailsResponse(
    session: IPublicSessionDetailsProjection,
  ): PublicSessionDetailsMappedDTO {
    return {
      sessionId: session.sessionId,
      title: session.title,
      description: session.description,
      type: session.type,
      pricing: {
        type: session.pricing.type,
        amount: session.pricing.amount,
        currency: session.pricing.currency,
      },
      scheduledAt: session.scheduledAt,
      durationInMinutes: session.durationInMinutes,
      maxParticipants: session.maxParticipants,
      thumbnailUrl: session.thumbnailUrl,
      status: session.status,
      nutritionist: {
        nutritionistId: session.nutritionist.nutritionistId,
        name: session.nutritionist.name,
        profileImage: session.nutritionist.profileImage,
        bio: session.nutritionist.bio,
      },
    };
  }
}
