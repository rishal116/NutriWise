import {
  NutritionistSpecialization,
} from "../../constants";

import {
  NutritionPlanCategory,
} from "../../constants";


export const SPECIALIZATION_TO_PLAN_CATEGORY_MAP: Partial<
  Record<NutritionistSpecialization, NutritionPlanCategory[]>
> = {
  [NutritionistSpecialization.WEIGHT_MANAGEMENT]: [
    NutritionPlanCategory.WEIGHT_LOSS,
    NutritionPlanCategory.WEIGHT_GAIN,
  ],

  [NutritionistSpecialization.DIABETES_METABOLIC]: [
    NutritionPlanCategory.DIABETES_MANAGEMENT,
  ],

  [NutritionistSpecialization.SPORTS_NUTRITION]: [
    NutritionPlanCategory.SPORTS_PERFORMANCE,
  ],

  [NutritionistSpecialization.PCOS_HORMONAL]: [
    NutritionPlanCategory.PCOS_HORMONAL,
  ],

  // fallback
  [NutritionistSpecialization.CLINICAL_NUTRITION]: [
    NutritionPlanCategory.GENERAL_NUTRITION,
  ],

  // empty ones
  [NutritionistSpecialization.FOOD_ALLERGIES]: [],
  [NutritionistSpecialization.VEGAN_NUTRITION]: [],
  [NutritionistSpecialization.LIFESTYLE_COACHING]: [],
  [NutritionistSpecialization.FUNCTIONAL_INTEGRATIVE]: [],
  [NutritionistSpecialization.CORPORATE_WELLNESS]: [],
};