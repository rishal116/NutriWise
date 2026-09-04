import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "@/types/nutritionist/resource/resource.types";

export class NutriResourceListItemDTO {
  resourceId!: string;

  title!: string;
  description!: string;

  type!: ResourceType;
  category!: ResourceCategory;

  thumbnailUrl?: string;

  status!: ResourceStatus;



  viewCount!: number;
  likeCount!: number;
  bookmarkCount!: number;
  commentCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
