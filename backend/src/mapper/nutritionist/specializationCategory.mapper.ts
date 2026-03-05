

import {
  NutritionistSpecialization,
} from "../../constants";

import {
  NutritionPlanCategory,
} from "../../constants";

import {
  SPECIALIZATION_TO_PLAN_CATEGORY_MAP,
} from "../../constants/nutritionist/specili.constant";

export function mapSpecializationsToCategories(
  specializations: NutritionistSpecialization[]
): NutritionPlanCategory[] {
  const set = new Set<NutritionPlanCategory>();

  for (const spec of specializations) {
    const categories =
      SPECIALIZATION_TO_PLAN_CATEGORY_MAP[spec];

    if (!categories || categories.length === 0) {
      set.add(NutritionPlanCategory.GENERAL_NUTRITION);
      continue;
    }

    categories.forEach((c) => set.add(c));
  }

  return Array.from(set);
}