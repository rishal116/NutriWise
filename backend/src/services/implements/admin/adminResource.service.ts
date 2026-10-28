import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";
import { validateDto } from "../../../middlewares/validateDto.middleware";

import type { IAdminResourceRepository } from "../../../repositories/interfaces/admin/IAdminResourceRepository";
import type { IAdminResourceService } from "../../interfaces/admin/IAdminResourceService";
import type {
  IAdminResource,
  IAdminResourceQuery,
} from "../../../types/admin/resource/resource.types";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { AdminResourceQueryDTO } from "../../../dtos/admin/resource/admin-resource.dto";
import type { AdminResourceResponseDTO } from "../../../dtos/admin/resource/admin-resource-response.dto";
import { AdminResourceMapper } from "../../../mappers/admin/resource/admin-resource.mapper";

@injectable()
export class AdminResourceService implements IAdminResourceService {
  constructor(
    @inject(TYPES.IAdminResourceRepository)
    private readonly adminResourceRepository: IAdminResourceRepository,
  ) {}

  async getResources(
    query: AdminResourceQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminResourceResponseDTO>> {
    const validatedQuery = await validateDto(AdminResourceQueryDTO, query);

    const repositoryQuery: IAdminResourceQuery = {
      limit: validatedQuery.limit,
      cursor: validatedQuery.cursor,
    };

    const result: CursorPaginationResult<IAdminResource> =
      await this.adminResourceRepository.getResources(repositoryQuery);

    return new InfiniteScrollResponseDTO(
      result.items.map(AdminResourceMapper.toResponseDTO),
      result.nextCursor,
      result.hasMore,
    );
  }

  async deleteResource(resourceId: string): Promise<void> {
    if (!Types.ObjectId.isValid(resourceId)) {
      throw new CustomError("Invalid resource ID", StatusCode.BAD_REQUEST);
    }

    const resource = await this.adminResourceRepository.findById(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", StatusCode.NOT_FOUND);
    }

    const deletedCount = await this.adminResourceRepository.deleteOne({
      _id: new Types.ObjectId(resourceId),
    });

    if (deletedCount === 0) {
      throw new CustomError(
        "Resource could not be deleted",
        StatusCode.NOT_FOUND,
      );
    }
  }
}
