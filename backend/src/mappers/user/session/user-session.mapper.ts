import type {
  IUserSessionDetailsProjection,
  IUserSessionListProjection,
} from "../../../types/user/session/user-session.projection";

import type { UserSessionListResponseDTO } from "../../../dtos/user/session/user-session-list-response.dto";
import type { UserSessionDetailsResponseDTO } from "../../../dtos/user/session/user-session-details-response.dto";

export class UserSessionMapper {
  static toListResponse(
    projection: IUserSessionListProjection,
  ): UserSessionListResponseDTO {
    return {
      registrationId: projection.registrationId.toString(),
      sessionId: projection.sessionId.toString(),
      registrationStatus: projection.registrationStatus,
      registeredAt: projection.registeredAt.toISOString(),
      session: {
        title: projection.session.title,
        type: projection.session.type,
        pricing: {
          type: projection.session.pricing.type,
          ...(projection.session.pricing.amount !== undefined && {
            amount: projection.session.pricing.amount,
          }),
          ...(projection.session.pricing.currency && {
            currency: projection.session.pricing.currency,
          }),
        },
        scheduledAt: projection.session.scheduledAt.toISOString(),
        durationInMinutes: projection.session.durationInMinutes,
        ...(projection.session.thumbnailUrl && {
          thumbnailUrl: projection.session.thumbnailUrl,
        }),
        status: projection.session.status,
      },
    };
  }

  static toDetailsResponse(
    projection: IUserSessionDetailsProjection,
  ): UserSessionDetailsResponseDTO {
    return {
      registrationId: projection.registrationId.toString(),
      sessionId: projection.sessionId.toString(),
      registrationStatus: projection.registrationStatus,
      registeredAt: projection.registeredAt.toISOString(),
      cancelledAt: projection.cancelledAt?.toISOString() ?? null,
      attendedAt: projection.attendedAt?.toISOString() ?? null,
      session: {
        nutritionistId: projection.session.nutritionistId.toString(),
        title: projection.session.title,
        description: projection.session.description,
        type: projection.session.type,
        pricing: {
          type: projection.session.pricing.type,
          ...(projection.session.pricing.amount !== undefined && {
            amount: projection.session.pricing.amount,
          }),
          ...(projection.session.pricing.currency && {
            currency: projection.session.pricing.currency,
          }),
        },
        scheduledAt: projection.session.scheduledAt.toISOString(),
        durationInMinutes: projection.session.durationInMinutes,
        maxParticipants: projection.session.maxParticipants,
        roomId: projection.session.roomId,
        ...(projection.session.thumbnailUrl && {
          thumbnailUrl: projection.session.thumbnailUrl,
        }),
        status: projection.session.status,
      },
    };
  }
}
