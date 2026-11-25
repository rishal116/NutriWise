
import type { IPublicSessionProjection } from "../../../types/public/session/public-session.projection";
import type { PublicSessionResponseDTO } from "../../../dtos/public/session/public-session-response.dto";

export class PublicSessionMapper {
  static toResponse(
    session: IPublicSessionProjection,
  ): PublicSessionResponseDTO {
    return {
      sessionId: session.sessionId,
      title: session.title,
      description: session.description,
      type: session.type,
      pricing: {
        type: session.pricingType,
        ...(session.pricing && {
          amount: session.pricing.amount,
          currency: session.pricing.currency,
        }),
      },
      scheduledAt: session.scheduledAt,
      duration: session.duration,
      maxParticipants: session.maxParticipants,
      participantCount: session.participantCount,
      ...(session.thumbnailUrl && {
        thumbnailUrl: session.thumbnailUrl,
      }),
      status: session.status,
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
