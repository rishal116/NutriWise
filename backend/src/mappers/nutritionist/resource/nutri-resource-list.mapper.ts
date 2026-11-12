import { NutriResourceListItemDTO } from "../../../dtos/nutritionist/resource/resource-list-response.dto";
import { INutriResourceProjection } from "../../../types/nutritionist/resource/nutri-resource.projection";

export class NutriResourceListMapper {
  static toDTO(resource: INutriResourceProjection): NutriResourceListItemDTO {
    return {
      resourceId: resource.resourceId.toString(),

      title: resource.title,
      description: resource.description,

      type: resource.type,
      category: resource.category,

    

      status: resource.status,



      viewCount: resource.viewCount,
  
      likeCount: resource.likeCount,
  
      commentCount: resource.commentCount,

      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }

  static toDTOList(
    resources: INutriResourceProjection[],
  ): NutriResourceListItemDTO[] {
    return resources.map((resource) => this.toDTO(resource));
  }
}
