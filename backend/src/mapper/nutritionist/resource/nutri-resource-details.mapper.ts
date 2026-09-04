import { Types } from "mongoose";

import { NutriResourceDetailsResponseDTO } from "../../../dtos/nutritionist/resource/resource-details-response.dto";
import { IResource } from "../../../models/resource.model";
import { INutriResourceDetailsProjection } from "../../../types/nutritionist/resource/nutri-resource-details.projection";

export class NutriResourceDetailsMapper {
  static toDTO(
    resource: INutriResourceDetailsProjection,
  ): NutriResourceDetailsResponseDTO {
    return {
      resourceId: resource.resourceId.toString(),
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      content: resource.content,
      fileUrl: resource.fileUrl,
      thumbnailUrl: resource.thumbnailUrl,
      status: resource.status,
      publishedAt: resource.publishedAt,
      viewCount: resource.viewCount,
      likeCount: resource.likeCount,
      bookmarkCount: resource.bookmarkCount,
      commentCount: resource.commentCount,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }

  static fromResource(
    resource: IResource & { _id: Types.ObjectId },
  ): INutriResourceDetailsProjection {
    return {
      resourceId: resource._id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      content: resource.content,
      fileUrl: resource.fileUrl,
      thumbnailUrl: resource.thumbnailUrl,
      status: resource.status,
      publishedAt: resource.publishedAt,
      viewCount: resource.viewCount,
      likeCount: resource.likeCount,
      bookmarkCount: resource.bookmarkCount,
      commentCount: resource.commentCount,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }
}
