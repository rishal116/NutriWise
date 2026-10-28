import type { IAdminResource } from "../../../types/admin/resource/resource.types";
import type { AdminResourceResponseDTO } from "../../../dtos/admin/resource/admin-resource-response.dto"; 

export class AdminResourceMapper {
  static toResponseDTO(
    resource: IAdminResource,
  ): AdminResourceResponseDTO {
    return {
      id: resource._id.toString(),
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      content: resource.content,
      fileUrl: resource.fileUrl,
      status: resource.status,
      createdBy: resource.createdBy
        ? {
            id: resource.createdBy._id.toString(),
            fullName: resource.createdBy.fullName,
            profileImage: resource.createdBy.profileImage,
          }
        : null,
      publishedAt: resource.publishedAt,
      viewCount: resource.viewCount,
      likeCount: resource.likeCount,
      commentCount: resource.commentCount,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }
}