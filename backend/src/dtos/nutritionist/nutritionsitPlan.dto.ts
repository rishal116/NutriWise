
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
  status?: "draft" | "published";
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
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}


export interface GetSpecializationsDTO {
  specializations: string[];
}

export interface NutritionistPricingDTO {
  status: string;
  minPrice: number;
  maxPrice: number;
}
