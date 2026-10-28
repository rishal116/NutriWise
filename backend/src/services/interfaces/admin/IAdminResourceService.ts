import type { AdminResourceQueryDTO } from "../../../dtos/admin/resource/admin-resource.dto";
import type { AdminResourceResponseDTO } from "../../../dtos/admin/resource/admin-resource-response.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IAdminResourceService {
  getResources(
    query: AdminResourceQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminResourceResponseDTO>>;

  deleteResource(resourceId: string): Promise<void>;
}