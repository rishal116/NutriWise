import { IPublicSessionListItemProjection } from "../../../types/public/session/public-session-list-item.projection";
import { IPublicSessionDetailsProjection } from "../../../types/public/session/public-session-details.projection";

import { PublicSessionListItemResponseDTO } from "../../../dtos/public/session/public-session-list-response.dto";
import { PublicSessionDetailsResponseDTO } from "../../../dtos/public/session/public-session-details-response.dto";

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
  ): PublicSessionDetailsResponseDTO {
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

      createdAt: session.createdAt,
    };
  }
}
