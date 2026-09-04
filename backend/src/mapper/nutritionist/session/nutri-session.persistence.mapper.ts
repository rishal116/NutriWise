import { Types, UpdateQuery } from "mongoose";

import { ISession } from "../../../models/session.model";

import { CreateNutriSessionDTO } from "../../../dtos/nutritionist/session/create-session.dto";

import { UpdateNutriSessionDTO } from "../../../dtos/nutritionist/session/update-session.dto";

export class NutriSessionPersistenceMapper {
  static toCreateModel(
    nutritionistId: string,
    dto: CreateNutriSessionDTO,
    thumbnailUrl?: string,
    roomId?: string,
  ): Partial<ISession> {
    return {
      nutritionistId: new Types.ObjectId(nutritionistId),

      title: dto.title,

      description: dto.description,

      type: dto.type,

      pricing: {
        type: dto.pricing.type,
        amount: dto.pricing.amount,
        currency: dto.pricing.currency,
      },

      scheduledAt: dto.scheduledAt,

      durationInMinutes: dto.durationInMinutes,

      maxParticipants: dto.maxParticipants,

      roomId,

      thumbnailUrl,

      status: "draft",
    };
  }

  static toUpdateModel(dto: UpdateNutriSessionDTO): UpdateQuery<ISession> {
    const update: UpdateQuery<ISession> = {};

    if (dto.title !== undefined) {
      update.$set = {
        ...update.$set,
        title: dto.title,
      };
    }

    if (dto.description !== undefined) {
      update.$set = {
        ...update.$set,
        description: dto.description,
      };
    }

    if (dto.type !== undefined) {
      update.$set = {
        ...update.$set,
        type: dto.type,
      };
    }

    if (dto.pricing !== undefined) {
      update.$set = {
        ...update.$set,
        pricing: {
          type: dto.pricing.type,
          amount: dto.pricing.amount,
          currency: dto.pricing.currency,
        },
      };
    }

    if (dto.scheduledAt !== undefined) {
      update.$set = {
        ...update.$set,
        scheduledAt: dto.scheduledAt,
      };
    }

    if (dto.durationInMinutes !== undefined) {
      update.$set = {
        ...update.$set,
        durationInMinutes: dto.durationInMinutes,
      };
    }

    if (dto.maxParticipants !== undefined) {
      update.$set = {
        ...update.$set,
        maxParticipants: dto.maxParticipants,
      };
    }

    return update;
  }
}
