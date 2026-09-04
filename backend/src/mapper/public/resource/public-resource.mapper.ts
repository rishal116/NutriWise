import { PublicResourceListItemDTO } from "../../../dtos/public/resource/public-resource-list-item.dto";
import { PublicResourceDetailsDTO } from "../../../dtos/public/resource/public-resource-details.dto";
import { ResourceCommentDTO } from "../../../dtos/public/resource/resource-comment.dto";

import { IResourceListItemProjection } from "../../../types/public/resource/resource-list-item-projection";
import { IResourceDetailsProjection } from "../../../types/public/resource/resource-details-projection";
import { IResourceComment } from "../../../models/resourceComment.model";

export class PublicResourceMapper {
  static toListItemDTO(
    resource: IResourceListItemProjection,
  ): PublicResourceListItemDTO {
    return {
      resourceId: resource.resourceId.toString(),
      title: resource.title,
      description: resource.description,
      type: resource.type,
      thumbnailUrl: resource.thumbnailUrl,
      category: resource.category,
      isDownloadable: resource.isDownloadable,
      viewCount: resource.viewCount,
      likeCount: resource.likeCount,
      bookmarkCount: resource.bookmarkCount,
      commentCount: resource.commentCount,
      publishedAt: resource.publishedAt,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }

  static toCommentDTO(comment: IResourceComment): ResourceCommentDTO {
    return {
      commentId: comment._id.toString(),
      userId: comment.userId.toString(),
      content: comment.content,
      isEdited: comment.isEdited,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  static toDetailsDTO(
    resource: IResourceDetailsProjection,
    comments: IResourceComment[],
    interaction: {
      isLiked: boolean;
      isBookmarked: boolean;
    },
  ): PublicResourceDetailsDTO {
    return {
      resourceId: resource.resourceId.toString(),
      title: resource.title,
      description: resource.description,
      type: resource.type,
      content: resource.content,
      fileUrl: resource.fileUrl,
      thumbnailUrl: resource.thumbnailUrl,
      category: resource.category,
      isDownloadable: resource.isDownloadable,

      isLiked: interaction.isLiked,
      isBookmarked: interaction.isBookmarked,

      viewCount: resource.viewCount,
      likeCount: resource.likeCount,
      bookmarkCount: resource.bookmarkCount,
      commentCount: resource.commentCount,

      comments: comments.map((comment) =>
        PublicResourceMapper.toCommentDTO(comment),
      ),

      publishedAt: resource.publishedAt,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }
}
