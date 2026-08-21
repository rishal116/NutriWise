import { PublicResourceListItemDTO } from "../../../dtos/public/resource/public-resource-list-item.dto";
import { PublicResourceDetailsDTO } from "../../../dtos/public/resource/public-resource-details.dto";

import { IResourceListItemProjection } from "../../../types/public/resource/resource-list-item-projection";
import { IResourceDetailsProjection } from "../../../types/public/resource/resource-details-projection";

export class PublicResourceMapper {
  static toListItemDTO(
    resource: IResourceListItemProjection,
  ): PublicResourceListItemDTO {
    return {
      resourceId: resource.resourceId,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      thumbnailUrl: resource.thumbnailUrl,
      category: resource.category,
      isDownloadable: resource.isDownloadable,

      viewCount: resource.viewCount,
      downloadCount: resource.downloadCount,
      likeCount: resource.likeCount,
      bookmarkCount: resource.bookmarkCount,
      shareCount: resource.shareCount,
      commentCount: resource.commentCount,

      publishedAt: resource.publishedAt,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }

  static toDetailsDTO(
    resource: IResourceDetailsProjection,
  ): PublicResourceDetailsDTO {
    return {
      resourceId: resource.resourceId,
      title: resource.title,
      description: resource.description,
      type: resource.type,

      content: resource.content,
      fileUrl: resource.fileUrl,
      externalUrl: resource.externalUrl,
      thumbnailUrl: resource.thumbnailUrl,

      category: resource.category,
      isDownloadable: resource.isDownloadable,

      viewCount: resource.viewCount,
      downloadCount: resource.downloadCount,
      likeCount: resource.likeCount,
      bookmarkCount: resource.bookmarkCount,
      shareCount: resource.shareCount,
      commentCount: resource.commentCount,

      publishedAt: resource.publishedAt,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }
}