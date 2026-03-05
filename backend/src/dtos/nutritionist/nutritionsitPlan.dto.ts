
export interface CreatePlanDTO {
  title: string;
  category: string;
  durationInDays: 30 | 90 | 180;
  price: number;
  description: string;
  status: "draft" | "published";
  features: string[];
}

export interface UpdatePlanDTO {
  title?: string;
  category?: string;
  durationInDays?: 30 | 90 | 180;
  price?: number;
  description?: string;
  status?: "draft" | "published" ;
  features?: string[];            
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
