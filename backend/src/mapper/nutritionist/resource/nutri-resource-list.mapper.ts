import { NutriResourceListItemDTO } from "../../../dtos/nutritionist/resource/resource-list-response.dto";
import { INutriResourceListProjection } from "../../../types/nutritionist/resource/nutri-resource-list.projection";

export class NutriResourceListMapper {
  static toDTO(
    resource: INutriResourceListProjection,
  ): NutriResourceListItemDTO {
    return {
      resourceId: resource.resourceId.toString(),

      title: resource.title,
      description: resource.description,

      type: resource.type,
      category: resource.category,

      thumbnailUrl: resource.thumbnailUrl,

      status: resource.status,

      isDownloadable: resource.isDownloadable,

      viewCount: resource.viewCount,
      downloadCount: resource.downloadCount,
      likeCount: resource.likeCount,
      bookmarkCount: resource.bookmarkCount,
      commentCount: resource.commentCount,

      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }

  static toDTOList(
    resources: INutriResourceListProjection[],
  ): NutriResourceListItemDTO[] {
    return resources.map((resource) => this.toDTO(resource));
  }
}
