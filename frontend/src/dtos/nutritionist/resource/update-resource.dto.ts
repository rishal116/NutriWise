import {
  ResourceCategory,
  ResourceType,
} from "@/types/nutritionist/resource/resource.types";

export class UpdateNutriResourceDTO {
  title?: string;

  description?: string;

  type?: ResourceType;

  content?: string;

  externalUrl?: string;

  category?: ResourceCategory;

  isDownloadable?: boolean;
}
