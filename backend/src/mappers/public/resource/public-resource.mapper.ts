import { PublicResourceDTO } from "../../../dtos/public/resource/public-resource.dto";
import { IResourceProjection } from "../../../types/public/resource/public-resource.projection";

export class PublicResourceMapper {
  static toDTO(resource: IResourceProjection): PublicResourceDTO {
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
      isLikedByMe: resource.isLikedByMe ?? false,
      isViewedByMe: resource.isViewedByMe ?? false,
      createdBy: {
        userId: resource.createdBy.userId.toString(),
        fullName: resource.createdBy.fullName,
      },
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }
}
