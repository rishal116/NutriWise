import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export class NutriResourceDetailsResponseDTO {
  resourceId!: string;

  title!: string;
  description!: string;

  type!: ResourceType;
  category!: ResourceCategory;

  content?: string;
  fileUrl?: string;
  thumbnailUrl?: string;

  status!: ResourceStatus;
  publishedAt?: Date;


  viewCount!: number;
  likeCount!: number;
  bookmarkCount!: number;
  commentCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
