
export interface CreatePlanDTO {
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  description: string;
  status: "draft" | "published";
  features: string[];
  tags: string[];
}

export interface UpdatePlanDTO {
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  description: string;
  status: "draft" | "published";
  features: string[];
  tags: string[];           
}


export interface PlanDTO {
  _id: string;
  nutritionistId: string;
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  description: string;
  features: string[];
  tags: string[];
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

import { NutritionPlanCategory } from "../../constants/nutritionist/nutritionPlanCategory.constant";

export type GetAllowedPlanCategoriesDTO = NutritionPlanCategory[];

export interface NutritionistPricingDTO {
  status: string;
  minPrice: number;
  maxPrice: number;
}
