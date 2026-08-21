import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { IPublicResourceService } from "../../interfaces/public/IPublicResourceService";

import { IResourceRepository } from "../../../repositories/interfaces/public/IResourceRepository";

import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { PublicResourceListItemDTO } from "../../../dtos/public/resource/public-resource-list-item.dto";

import { PublicResourceDetailsDTO } from "../../../dtos/public/resource/public-resource-details.dto";

import { CustomError } from "../../../utils/customError";

import logger from "../../../utils/logger";

import { PublicResourceMapper } from "../../../mapper/public/resource/public-resource.mapper";

@injectable()
export class PublicResourceService implements IPublicResourceService {
  constructor(
    @inject(TYPES.IResourceRepository)
    private readonly _resourceRepository: IResourceRepository,
  ) {}

  async getPublicResources(
    query: PublicResourceListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicResourceListItemDTO>> {
    logger.debug("Fetching public resources");

    const result = await this._resourceRepository.findPublicResources(query);

    const items = result.items.map((resource) =>
      PublicResourceMapper.toListItemDTO(resource),
    );

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor ?? null,
      result.hasMore,
    );
  }

  async getPublicResourceDetails(
    resourceId: string | Types.ObjectId,
  ): Promise<PublicResourceDetailsDTO> {
    logger.debug(
      "Fetching public resource details. resourceId=%s",
      resourceId.toString(),
    );

    this.validateResourceId(resourceId);

    const resource =
      await this._resourceRepository.findPublicResourceDetails(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", 404);
    }

    return PublicResourceMapper.toDetailsDTO(resource);
  }

  async recordResourceView(resourceId: string | Types.ObjectId): Promise<void> {
    logger.debug(
      "Recording resource view. resourceId=%s",
      resourceId.toString(),
    );

    this.validateResourceId(resourceId);

    const resource =
      await this._resourceRepository.findPublicResourceDetails(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", 404);
    }

    await this._resourceRepository.incrementViewCount(resourceId);
  }

  async recordResourceDownload(
    resourceId: string | Types.ObjectId,
  ): Promise<void> {
    logger.debug(
      "Recording resource download. resourceId=%s",
      resourceId.toString(),
    );

    this.validateResourceId(resourceId);

    const resource =
      await this._resourceRepository.findPublicResourceDetails(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", 404);
    }

    if (!resource.isDownloadable) {
      throw new CustomError("This resource is not downloadable", 400);
    }

    await this._resourceRepository.incrementDownloadCount(resourceId);
  }

  async recordResourceShare(
    resourceId: string | Types.ObjectId,
  ): Promise<void> {
    logger.debug(
      "Recording resource share. resourceId=%s",
      resourceId.toString(),
    );

    this.validateResourceId(resourceId);

    const resource =
      await this._resourceRepository.findPublicResourceDetails(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", 404);
    }

    await this._resourceRepository.incrementShareCount(resourceId);
  }

  private validateResourceId(resourceId: string | Types.ObjectId): void {
    if (!Types.ObjectId.isValid(resourceId)) {
      throw new CustomError("Invalid resource ID", 400);
    }
  }
}
