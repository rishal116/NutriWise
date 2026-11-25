import { Types, type UpdateQuery } from "mongoose";

import type { ISession } from "../../../models/session.model";
import type { CreateNutriSessionDTO } from "../../../dtos/nutritionist/session/create-session.dto";
import type { UpdateNutriSessionDTO } from "../../../dtos/nutritionist/session/update-session.dto";

interface SessionThumbnail {
  thumbnailUrl: string;
  thumbnailPublicId: string;
}

export class NutriSessionPersistenceMapper {
  static toCreateModel(
    nutritionistId: string,
    dto: CreateNutriSessionDTO,
    thumbnail?: SessionThumbnail,
    roomId?: string,
  ): Partial<ISession> {
    return {
      nutritionistId: new Types.ObjectId(nutritionistId),
      title: dto.title,
      description: dto.description,
      type: dto.type,
      pricingType: dto.pricingType,
      ...(dto.pricing && {
        pricing: {
          amount: dto.pricing.amount,
          currency: dto.pricing.currency,
        },
      }),
      scheduledAt: dto.scheduledAt,
      duration: dto.duration,
      ...(dto.endTime && { endTime: dto.endTime }),
      maxParticipants: dto.maxParticipants,
      ...(roomId && { roomId }),
      ...(thumbnail && {
        thumbnailUrl: thumbnail.thumbnailUrl,
        thumbnailPublicId: thumbnail.thumbnailPublicId,
      }),
      status: "draft",
      deletedAt: null,
    };
  }

  static toUpdateModel(
    dto: UpdateNutriSessionDTO,
    thumbnail?: SessionThumbnail,
  ): UpdateQuery<ISession> {
    const set: UpdateQuery<ISession>["$set"] = {};

    if (dto.title !== undefined) set.title = dto.title;
    if (dto.description !== undefined) set.description = dto.description;
    if (dto.type !== undefined) set.type = dto.type;
    if (dto.pricingType !== undefined) set.pricingType = dto.pricingType;

    if (dto.pricing !== undefined) {
      set.pricing = {
        amount: dto.pricing.amount,
        currency: dto.pricing.currency,
      };
    }

    if (dto.scheduledAt !== undefined) set.scheduledAt = dto.scheduledAt;
    if (dto.duration !== undefined) set.duration = dto.duration;
    if (dto.endTime !== undefined) set.endTime = dto.endTime;

    if (dto.maxParticipants !== undefined) {
      set.maxParticipants = dto.maxParticipants;
    }

    if (thumbnail) {
      set.thumbnailUrl = thumbnail.thumbnailUrl;
      set.thumbnailPublicId = thumbnail.thumbnailPublicId;
    }

    return { $set: set };
  }
}
