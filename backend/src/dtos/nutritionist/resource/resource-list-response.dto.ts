import {
  ResourceCategory,
  ResourceStatus,
  ResourceType,
} from "../../../models/resource.model";

export class NutriResourceListItemDTO {
  resourceId!: string;

  title!: string;
  description!: string;

  type!: ResourceType;
  category!: ResourceCategory;



  status!: ResourceStatus;


  viewCount!: number;

  likeCount!: number;

  commentCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
