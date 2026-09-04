import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { INutriResourceService } from "../../interfaces/nutritionist/INutriResourceService";
import { INutriResourceRepository } from "../../../repositories/interfaces/nutritionist/INutriResourceRepository";
import { CreateNutriResourceDTO } from "../../../dtos/nutritionist/resource/create-resource.dto";
import { UpdateNutriResourceDTO } from "../../../dtos/nutritionist/resource/update-resource.dto";
import { GetNutriResourceParamsDTO } from "../../../dtos/nutritionist/resource/resource-params.dto";
import { GetNutriResourcesQueryDTO } from "../../../dtos/nutritionist/resource/resource-list-query.dto";
import { NutriResourceListItemDTO } from "../../../dtos/nutritionist/resource/resource-list-response.dto";
import { NutriResourceDetailsResponseDTO } from "../../../dtos/nutritionist/resource/resource-details-response.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { NutriResourceListMapper } from "../../../mapper/nutritionist/resource/nutri-resource-list.mapper";
import { NutriResourceDetailsMapper } from "../../../mapper/nutritionist/resource/nutri-resource-details.mapper";
import { Types } from "mongoose";
import { uploadToCloudinary } from "../../../utils/cloudinaryUploads.util";
import { ResourceType } from "cloudinary";

@injectable()
export class NutriResourceService implements INutriResourceService {
  constructor(
    @inject(TYPES.INutriResourceRepository)
    private readonly _nutriResourceRepository: INutriResourceRepository,
  ) {}

  private validateResourceFiles(
    type: ResourceType,
    file?: Express.Multer.File,
    thumbnail?: Express.Multer.File,
  ): void {
    const MAX_PDF_SIZE = 10 * 1024 * 1024;
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024;

    if (type === "article" && file) {
      throw new CustomError(
        "Article resources must not contain a main file.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (type === "pdf") {
      if (!file) {
        throw new CustomError(
          "PDF resource requires a file.",
          StatusCode.BAD_REQUEST,
        );
      }

      if (file.mimetype !== "application/pdf") {
        throw new CustomError(
          "Only PDF files are allowed.",
          StatusCode.BAD_REQUEST,
        );
      }

      if (file.size > MAX_PDF_SIZE) {
        throw new CustomError(
          "PDF file size must not exceed 10 MB.",
          StatusCode.BAD_REQUEST,
        );
      }
    }

    if (type === "video") {
      if (!file) {
        throw new CustomError(
          "Video resource requires a file.",
          StatusCode.BAD_REQUEST,
        );
      }

      const allowedVideoTypes = ["video/mp4", "video/webm"];

      if (!allowedVideoTypes.includes(file.mimetype)) {
        throw new CustomError(
          "Only MP4 and WebM video files are allowed.",
          StatusCode.BAD_REQUEST,
        );
      }

      if (file.size > MAX_VIDEO_SIZE) {
        throw new CustomError(
          "Video file size must not exceed 100 MB.",
          StatusCode.BAD_REQUEST,
        );
      }
    }

    if (type === "infographic") {
      if (!file) {
        throw new CustomError(
          "Infographic resource requires a file.",
          StatusCode.BAD_REQUEST,
        );
      }

      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedImageTypes.includes(file.mimetype)) {
        throw new CustomError(
          "Only JPG, PNG, and WebP images are allowed.",
          StatusCode.BAD_REQUEST,
        );
      }

      if (file.size > MAX_IMAGE_SIZE) {
        throw new CustomError(
          "Infographic file size must not exceed 10 MB.",
          StatusCode.BAD_REQUEST,
        );
      }
    }

    if (thumbnail) {
      const allowedThumbnailTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedThumbnailTypes.includes(thumbnail.mimetype)) {
        throw new CustomError(
          "Thumbnail must be a JPG, PNG, or WebP image.",
          StatusCode.BAD_REQUEST,
        );
      }

      if (thumbnail.size > MAX_THUMBNAIL_SIZE) {
        throw new CustomError(
          "Thumbnail size must not exceed 5 MB.",
          StatusCode.BAD_REQUEST,
        );
      }
    }
  }

  async createResource(
    nutritionistId: string,
    dto: CreateNutriResourceDTO,
    file?: Express.Multer.File,
    thumbnail?: Express.Multer.File,
  ): Promise<NutriResourceDetailsResponseDTO> {
    logger.debug("Creating resource. nutritionistId=%s", nutritionistId);

    const validatedDto = await validateDto(CreateNutriResourceDTO, dto);

    const nutritionistObjectId = new Types.ObjectId(nutritionistId);

    this.validateResourceFiles(dto.type, file, thumbnail);
    let fileUrl: string | undefined;
    let thumbnailUrl: string | undefined;

    if (file) {
      fileUrl = await uploadToCloudinary(file, "nutriwise/resources");
    }

    if (thumbnail) {
      thumbnailUrl = await uploadToCloudinary(
        thumbnail,
        "nutriwise/resources/thumbnails",
      );
    }

    const resource = await this._nutriResourceRepository.create({
      ...validatedDto,
      fileUrl,
      thumbnailUrl,
      createdBy: nutritionistObjectId,
    });

    logger.info(
      "Resource created. resourceId=%s nutritionistId=%s",
      resource._id,
      nutritionistId,
    );

    const projection = NutriResourceDetailsMapper.fromResource(resource);

    return NutriResourceDetailsMapper.toDTO(projection);
  }

  async getResources(
    nutritionistId: string,
    query: GetNutriResourcesQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriResourceListItemDTO>> {
    logger.debug(
      "Fetching nutritionist resources. nutritionistId=%s",
      nutritionistId,
    );
    const validatedQuery = await validateDto(GetNutriResourcesQueryDTO, query);
    const result = await this._nutriResourceRepository.findResources(
      nutritionistId,
      validatedQuery,
    );
    logger.info(
      "Fetched %d resources. nutritionistId=%s",
      result.items.length,
      nutritionistId,
    );
    return new InfiniteScrollResponseDTO(
      NutriResourceListMapper.toDTOList(result.items),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getResourceDetails(
    nutritionistId: string,
    params: GetNutriResourceParamsDTO,
  ): Promise<NutriResourceDetailsResponseDTO> {
    logger.debug(
      "Fetching resource details. nutritionistId=%s resourceId=%s",
      nutritionistId,
      params.resourceId,
    );
    const validatedParams = await validateDto(
      GetNutriResourceParamsDTO,
      params,
    );
    const resource = await this._nutriResourceRepository.findResourceDetails(
      validatedParams.resourceId,
      nutritionistId,
    );
    if (!resource) {
      logger.warn(
        "Resource not found. nutritionistId=%s resourceId=%s",
        nutritionistId,
        validatedParams.resourceId,
      );
      throw new CustomError("Resource not found", StatusCode.NOT_FOUND);
    }
    return NutriResourceDetailsMapper.toDTO(resource);
  }

  async updateResource(
    nutritionistId: string,
    params: GetNutriResourceParamsDTO,
    dto: UpdateNutriResourceDTO,
  ): Promise<NutriResourceDetailsResponseDTO> {
    logger.debug(
      "Updating resource. nutritionistId=%s resourceId=%s",
      nutritionistId,
      params.resourceId,
    );
    const validatedParams = await validateDto(
      GetNutriResourceParamsDTO,
      params,
    );
    const validatedDto = await validateDto(UpdateNutriResourceDTO, dto);
    const resource = await this._nutriResourceRepository.findResourceDetails(
      validatedParams.resourceId,
      nutritionistId,
    );
    if (!resource) {
      throw new CustomError("Resource not found", StatusCode.NOT_FOUND);
    }
    if (resource.status === "archived") {
      throw new CustomError(
        "Archived resources cannot be updated",
        StatusCode.BAD_REQUEST,
      );
    }
    const updatedResource = await this._nutriResourceRepository.updateById(
      validatedParams.resourceId,
      validatedDto,
    );
    if (!updatedResource) {
      throw new CustomError(
        "Resource update failed",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    return NutriResourceDetailsMapper.toDTO(
      NutriResourceDetailsMapper.fromResource(updatedResource),
    );
  }

  async publishResource(
    nutritionistId: string,
    params: GetNutriResourceParamsDTO,
  ): Promise<NutriResourceDetailsResponseDTO> {
    logger.debug(
      "Publishing resource. nutritionistId=%s resourceId=%s",
      nutritionistId,
      params.resourceId,
    );

    const validatedParams = await validateDto(
      GetNutriResourceParamsDTO,
      params,
    );

    const resource = await this._nutriResourceRepository.publishResource(
      validatedParams.resourceId,
      nutritionistId,
      new Date(),
    );

    if (!resource) {
      throw new CustomError(
        "Resource not found or cannot be published",
        StatusCode.BAD_REQUEST,
      );
    }

    return NutriResourceDetailsMapper.toDTO(resource);
  }

  async archiveResource(
    nutritionistId: string,
    params: GetNutriResourceParamsDTO,
  ): Promise<NutriResourceDetailsResponseDTO> {
    logger.debug(
      "Archiving resource. nutritionistId=%s resourceId=%s",
      nutritionistId,
      params.resourceId,
    );

    const validatedParams = await validateDto(
      GetNutriResourceParamsDTO,
      params,
    );

    const resource = await this._nutriResourceRepository.archiveResource(
      validatedParams.resourceId,
      nutritionistId,
    );

    if (!resource) {
      throw new CustomError(
        "Resource not found or cannot be archived",
        StatusCode.BAD_REQUEST,
      );
    }

    return NutriResourceDetailsMapper.toDTO(resource);
  }
}
