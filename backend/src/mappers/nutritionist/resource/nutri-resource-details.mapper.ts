import { Types } from "mongoose";

import { NutriResourceDetailsResponseDTO } from "../../../dtos/nutritionist/resource/resource-details-response.dto";
import { IResource } from "../../../models/resource.model";
import { INutriResourceProjection } from "../../../types/nutritionist/resource/nutri-resource.projection";

export class NutriResourceDetailsMapper {
  static toDTO(
    resource: INutriResourceProjection,
  ): NutriResourceDetailsResponseDTO {
    return {
      resourceId: resource.resourceId.toString(),
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      content: resource.content,
      fileUrl: resource.fileUrl,

      status: resource.status,
      publishedAt: resource.publishedAt,
      viewCount: resource.viewCount,
      likeCount: resource.likeCount,

      commentCount: resource.commentCount,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }

  static fromResource(
  resource: IResource & { _id: Types.ObjectId },
  isLikedByMe = false,
  isViewedByMe = false,
): INutriResourceProjection {
  return {
    resourceId: resource._id,
    title: resource.title,
    description: resource.description,
    type: resource.type,
    category: resource.category,
    content: resource.content,
    fileUrl: resource.fileUrl,

    status: resource.status,
    publishedAt: resource.publishedAt,
    viewCount: resource.viewCount,
    likeCount: resource.likeCount,
    commentCount: resource.commentCount,

    isLikedByMe,
    isViewedByMe,

    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
}
}
