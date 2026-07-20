import { Types } from "mongoose";
import { INutritionistPlanRepository } from "../repositories/interfaces/nutritionist/INutriPlanRepository";

export const generateUniquePlanSlug = async (
  repository: INutritionistPlanRepository,
  nutritionistId: string,
  title: string,
): Promise<string> => {
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug;
  let counter = 2;

  while (
    await repository.exists({
      nutritionistId: new Types.ObjectId(nutritionistId),
      slug,
      isDeleted: false,
    })
  ) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
};
