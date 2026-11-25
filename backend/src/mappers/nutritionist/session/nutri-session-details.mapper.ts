import type { INutriSessionDetailsProjection } from "../../../types/nutritionist/session/nutri-session-details.projection";
import type { NutriSessionDetailsResponseDTO } from "../../../dtos/nutritionist/session/nutri-session-details.dto";

export class NutriSessionDetailsMapper {
  static toResponse(
    session: INutriSessionDetailsProjection,
  ): NutriSessionDetailsResponseDTO {
    return {
      sessionId: session.sessionId.toString(),
      title: session.title,
      description: session.description,
      type: session.type,
      pricingType: session.pricingType,
      ...(session.pricing && {
        pricing: {
          amount: session.pricing.amount,
          currency: session.pricing.currency,
        },
      }),
      scheduledAt: session.scheduledAt,
      duration: session.duration,
      ...(session.endTime && { endTime: session.endTime }),
      maxParticipants: session.maxParticipants,
      roomId: session.roomId,
      ...(session.thumbnailUrl && {
        thumbnailUrl: session.thumbnailUrl,
      }),
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
