import type { INutriSessionListProjection } from "../../../types/nutritionist/session/nutri-session-list.projection";
import type { INutriSessionDetailsProjection } from "../../../types/nutritionist/session/nutri-session-details.projection";
import type { NutriSessionListResponseDTO } from "../../../dtos/nutritionist/session/session-list-response.dto";
import type { NutriSessionDetailsResponseDTO } from "../../../dtos/nutritionist/session/session-details-response.dto";

export class NutriSessionMapper {
  static toListResponse(
    session: INutriSessionListProjection,
  ): NutriSessionListResponseDTO {
    return {
      sessionId: session.sessionId.toString(),
      title: session.title,
      type: session.type,
      pricing: {
        type: session.pricing.type,
        amount: session.pricing.amount,
        currency: session.pricing.currency,
      },
      scheduledAt: session.scheduledAt,
      durationInMinutes: session.durationInMinutes,
      thumbnailUrl: session.thumbnailUrl,
      status: session.status,
      registeredCount: session.registeredCount,
      createdAt: session.createdAt,
    };
  }

  static toDetailsResponse(
    session: INutriSessionDetailsProjection,
  ): NutriSessionDetailsResponseDTO {
    return {
      sessionId: session.sessionId.toString(),
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
      roomId: session.roomId,
      thumbnailUrl: session.thumbnailUrl,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
