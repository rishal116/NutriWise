import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { IPublicResourceService } from "../../interfaces/public/IPublicResourceService";
import { IPublicResourceRepository } from "../../../repositories/interfaces/public/IPublicResourceRepository";
import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { PublicResourceDTO } from "../../../dtos/public/resource/public-resource.dto";
import { CustomError } from "../../../utils/customError";
import logger from "../../../utils/logger";
import { PublicResourceMapper } from "../../../mappers/public/resource/public-resource.mapper";

@injectable()
export class PublicResourceService implements IPublicResourceService {
  constructor(
    @inject(TYPES.IPublicResourceRepository)
    private readonly _resourceRepository: IPublicResourceRepository,
  ) {}

  async getPublicResources(
    query: PublicResourceListQueryDTO,
    userId?: string | Types.ObjectId,
  ): Promise<InfiniteScrollResponseDTO<PublicResourceDTO>> {
    logger.debug("Fetching public resources");

    const result = await this._resourceRepository.findPublicResources(
      query,
      userId,
    );

    const items = result.items.map((resource) =>
      PublicResourceMapper.toDTO(resource),
    );

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor ?? null,
      result.hasMore,
    );
  }

  async getPublicResourceDetails(
    resourceId: string | Types.ObjectId,
    userId?: string | Types.ObjectId,
  ): Promise<PublicResourceDTO> {
    logger.debug(
      "Fetching public resource details. resourceId=%s",
      resourceId.toString(),
    );

    this.validateResourceId(resourceId);

    const resource = await this._resourceRepository.findPublicResourceDetails(
      resourceId,
      userId,
    );

    if (!resource) {
      throw new CustomError("Resource not found", 404);
    }

    return PublicResourceMapper.toDTO(resource);
  }

  private validateResourceId(resourceId: string | Types.ObjectId): void {
    if (!Types.ObjectId.isValid(resourceId)) {
      throw new CustomError("Invalid resource ID", 400);
    }
  }
}
