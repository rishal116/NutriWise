import type { INutriSessionListItemProjection } from "../../../types/nutritionist/session/nutri-session-list.projection";
import type { NutriSessionListItemResponseDTO } from "../../../dtos/nutritionist/session/nutri-session-list.dto";

export class NutriSessionListMapper {
  static toResponse(
    session: INutriSessionListItemProjection,
  ): NutriSessionListItemResponseDTO {
    return {
      sessionId: session.sessionId.toString(),
      title: session.title,
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
      ...(session.thumbnailUrl && {
        thumbnailUrl: session.thumbnailUrl,
      }),
      status: session.status,
      participantCount: session.participantCount,
    };
  }
}
