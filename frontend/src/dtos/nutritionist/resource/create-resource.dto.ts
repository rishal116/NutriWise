import {
  ResourceCategory,
  ResourceType,
} from "@/types/nutritionist/resource/resource.types";

export interface CreateNutriResourceDTO {
  title: string;

  description: string;

  type: ResourceType;

  content?: string;

  category: ResourceCategory;


}
