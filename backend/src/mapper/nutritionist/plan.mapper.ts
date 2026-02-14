import { CreatePlanDTO } from "../../dtos/nutritionist/nutritionsitPlan.dto";
import { UpdatePlanDTO } from "../../dtos/nutritionist/nutritionsitPlan.dto";
import { IPlan } from "../../models/nutritionistPlan.model";
import { Types } from "mongoose";

export class PlanMapper {
  static toCreateEntity(
    nutritionistId: string,
    dto: CreatePlanDTO
  ): Partial<IPlan> {
    return {
      nutritionistId: new Types.ObjectId(nutritionistId),
      title: dto.title.trim(),
      category: dto.category,
      durationInDays: dto.durationInDays,
      price: dto.price,
      description: dto.description.trim(),
    };
  }

  static toUpdateEntity(dto: UpdatePlanDTO): Partial<IPlan> {
    const entity: Partial<IPlan> = {};

    if (dto.title) entity.title = dto.title.trim();
    if (dto.category) entity.category = dto.category;
    if (dto.durationInDays) entity.durationInDays = dto.durationInDays;
    if (dto.price !== undefined) entity.price = dto.price;
    if (dto.description) entity.description = dto.description.trim();

    return entity;
  }
}
