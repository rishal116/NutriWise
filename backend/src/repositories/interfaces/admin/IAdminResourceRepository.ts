import type {
  IAdminResource,
  IAdminResourceQuery,
} from "../../../types/admin/resource/resource.types";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { IResource } from "../../../models/resource.model";
import type { IBaseRepository } from "../common/IBaseRepository";

export interface IAdminResourceRepository
  extends IBaseRepository<IResource> {
  getResources(
    query: IAdminResourceQuery,
  ): Promise<CursorPaginationResult<IAdminResource>>;
}