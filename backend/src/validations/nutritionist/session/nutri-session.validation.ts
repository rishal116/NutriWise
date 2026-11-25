import { validateDto } from "../../../middlewares/validateDto.middleware";

import { GetNutriSessionsQueryDTO } from "../../../dtos/nutritionist/session/nutri-session-list-query.dto";
import { CreateNutriSessionDTO } from "../../../dtos/nutritionist/session/create-session.dto";
import { UpdateNutriSessionDTO } from "../../../dtos/nutritionist/session/update-session.dto";

import type { ISession } from "../../../models/session.model";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

export class NutriSessionValidation {
  static async validateQuery(
    query: GetNutriSessionsQueryDTO,
  ): Promise<GetNutriSessionsQueryDTO> {
    return validateDto(GetNutriSessionsQueryDTO, query);
  }

  static async validateCreate(
    dto: CreateNutriSessionDTO,
  ): Promise<CreateNutriSessionDTO> {
    const validatedDto = await validateDto(CreateNutriSessionDTO, dto);

    this.validatePricing(validatedDto.pricingType, validatedDto.pricing);
    this.validateSchedule(validatedDto.scheduledAt, validatedDto.endTime, true);

    return validatedDto;
  }

  static async validateUpdate(
    dto: UpdateNutriSessionDTO,
    existingSession: ISession,
    hasThumbnail: boolean,
  ): Promise<UpdateNutriSessionDTO> {
    const validatedDto = await validateDto(UpdateNutriSessionDTO, dto);

    const hasDtoChanges = Object.values(validatedDto).some(
      (value) => value !== undefined,
    );

    if (!hasDtoChanges && !hasThumbnail) {
      throw new CustomError(
        "At least one field or thumbnail is required to update the session",
        StatusCode.BAD_REQUEST,
      );
    }

    const finalPricingType =
      validatedDto.pricingType ?? existingSession.pricingType;

    const finalPricing =
      finalPricingType === "free"
        ? undefined
        : (validatedDto.pricing ?? existingSession.pricing);

    this.validatePricing(finalPricingType, finalPricing);

    const finalScheduledAt =
      validatedDto.scheduledAt ?? existingSession.scheduledAt;

    const finalEndTime = validatedDto.endTime ?? existingSession.endTime;

    if (validatedDto.scheduledAt !== undefined) {
      this.validateSchedule(finalScheduledAt, finalEndTime, true);
    } else if (
      validatedDto.endTime !== undefined &&
      finalEndTime !== undefined &&
      finalEndTime <= finalScheduledAt
    ) {
      throw new CustomError(
        "Session end time must be after its scheduled time",
        StatusCode.BAD_REQUEST,
      );
    }

    return validatedDto;
  }

  static validatePublish(session: ISession): void {
    this.validateSchedule(session.scheduledAt, session.endTime, true);
  }

  private static validatePricing(
    pricingType: ISession["pricingType"],
    pricing: ISession["pricing"],
  ): void {
    if (pricingType === "free" && pricing !== undefined) {
      throw new CustomError(
        "Free sessions must not have pricing details",
        StatusCode.BAD_REQUEST,
      );
    }

    if (pricingType === "paid" && (!pricing || pricing.amount <= 0)) {
      throw new CustomError(
        "Paid sessions require a valid price",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private static validateSchedule(
    scheduledAt: Date,
    endTime?: Date,
    requireFuture = false,
  ): void {
    if (requireFuture && scheduledAt <= new Date()) {
      throw new CustomError(
        "Session scheduled time must be in the future",
        StatusCode.BAD_REQUEST,
      );
    }

    if (endTime && endTime <= scheduledAt) {
      throw new CustomError(
        "Session end time must be after its scheduled time",
        StatusCode.BAD_REQUEST,
      );
    }
  }
}
