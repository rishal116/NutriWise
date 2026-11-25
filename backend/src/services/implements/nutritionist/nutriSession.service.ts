import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";

import type { INutriSessionService } from "../../interfaces/nutritionist/INutriSessionService";
import type { INutriSessionRepository } from "../../../repositories/interfaces/nutritionist/INutriSessionRepository";
import type { ICloudinaryService } from "../../interfaces/common/ICloudinaryService";

import type { GetNutriSessionsQueryDTO } from "../../../dtos/nutritionist/session/nutri-session-list-query.dto";
import type { CreateNutriSessionDTO } from "../../../dtos/nutritionist/session/create-session.dto";
import type { UpdateNutriSessionDTO } from "../../../dtos/nutritionist/session/update-session.dto";

import type { NutriSessionListItemResponseDTO } from "../../../dtos/nutritionist/session/nutri-session-list.dto";
import type { NutriSessionDetailsResponseDTO } from "../../../dtos/nutritionist/session/nutri-session-details.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { NutriSessionListMapper } from "../../../mappers/nutritionist/session/nutri-session-list.mapper";
import { NutriSessionDetailsMapper } from "../../../mappers/nutritionist/session/nutri-session-details.mapper";
import { NutriSessionPersistenceMapper } from "../../../mappers/nutritionist/session/nutri-session.persistence.mapper";

import { NutriSessionValidation } from "../../../validations/nutritionist/session/nutri-session.validation";

import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { toObjectId } from "../../../utils/object-id.util";
import logger from "../../../utils/logger";
import { decodeCursor } from "../../../utils/cursor.util";
import { NUTRI_SESSION_SORT_CONFIG } from "../../../constants/nutritionist/session/session-sort.constants";

interface SessionThumbnail {
  thumbnailUrl: string;
  thumbnailPublicId: string;
}

@injectable()
export class NutriSessionService implements INutriSessionService {
  constructor(
    @inject(TYPES.INutriSessionRepository)
    private readonly _nutriSessionRepository: INutriSessionRepository,

    @inject(TYPES.ICloudinaryService)
    private readonly _cloudinaryService: ICloudinaryService,
  ) {}

  async getSessions(
    nutritionistId: string,
    query: GetNutriSessionsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriSessionListItemResponseDTO>> {
    const nutritionistObjectId = toObjectId(nutritionistId, "nutritionist ID");

    const validatedQuery = await NutriSessionValidation.validateQuery(query);

    logger.info("Fetching nutritionist sessions", { nutritionistId });

    const cursor = decodeCursor(validatedQuery.cursor);

    const sortBy = validatedQuery.sortBy ?? "latest";
    const { field, direction } = NUTRI_SESSION_SORT_CONFIG[sortBy];

    const expectedSortKey = `${sortBy}:${field}:${direction}`;

    if (cursor?.sortKey && cursor.sortKey !== expectedSortKey) {
      throw new CustomError(
        "Cursor does not match the selected sorting option",
        StatusCode.BAD_REQUEST,
      );
    }
    const sessionResult = await this._nutriSessionRepository.findSessions(
      nutritionistObjectId,
      validatedQuery,
      cursor,
    );

    const sessionItems = sessionResult.items.map((session) =>
      NutriSessionListMapper.toResponse(session),
    );

    logger.info("Nutritionist sessions retrieved successfully", {
      nutritionistId,
      count: sessionItems.length,
      hasMore: sessionResult.hasMore,
    });

    return new InfiniteScrollResponseDTO(
      sessionItems,
      sessionResult.nextCursor,
      sessionResult.hasMore,
    );
  }

  async getSessionDetails(
    sessionId: string,
    nutritionistId: string,
  ): Promise<NutriSessionDetailsResponseDTO> {
    const sessionObjectId = toObjectId(sessionId, "session ID");
    const nutritionistObjectId = toObjectId(nutritionistId, "nutritionist ID");

    logger.info("Fetching nutritionist session details", {
      sessionId,
      nutritionistId,
    });

    const sessionDetails =
      await this._nutriSessionRepository.findSessionDetails(
        sessionObjectId.toString(),
        nutritionistObjectId.toString(),
      );

    if (!sessionDetails) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    return NutriSessionDetailsMapper.toResponse(sessionDetails);
  }

  async createSession(
    nutritionistId: string,
    dto: CreateNutriSessionDTO,
    thumbnail?: Express.Multer.File,
  ): Promise<void> {
    const nutritionistObjectId = toObjectId(nutritionistId, "nutritionist ID");

    const validatedDto = await NutriSessionValidation.validateCreate(dto);

    logger.info("Creating nutritionist session", {
      nutritionistId,
      hasThumbnail: Boolean(thumbnail),
    });

    let thumbnailAsset: SessionThumbnail | undefined;

    if (thumbnail) {
      const uploadResult = await this._cloudinaryService.upload(
        thumbnail,
        "nutriwise/sessions",
      );

      thumbnailAsset = {
        thumbnailUrl: uploadResult.secureUrl,
        thumbnailPublicId: uploadResult.publicId,
      };
    }

    try {
      const sessionData = NutriSessionPersistenceMapper.toCreateModel(
        nutritionistObjectId.toString(),
        validatedDto,
        thumbnailAsset,
        `session_${uuidv4()}`,
      );

      await this._nutriSessionRepository.create(sessionData);

      logger.info("Nutritionist session created successfully", {
        nutritionistId,
        hasThumbnail: Boolean(thumbnailAsset),
      });
    } catch (error) {
      if (thumbnailAsset) {
        await this._cloudinaryService
          .delete(thumbnailAsset.thumbnailPublicId)
          .catch((cleanupError: unknown) => {
            logger.error("Failed to clean up session thumbnail", {
              nutritionistId,
              publicId: thumbnailAsset.thumbnailPublicId,
              error: cleanupError,
            });
          });
      }

      throw error;
    }
  }

  async updateSession(
    sessionId: string,
    nutritionistId: string,
    dto: UpdateNutriSessionDTO,
    thumbnail?: Express.Multer.File,
  ): Promise<void> {
    const sessionObjectId = toObjectId(sessionId, "session ID");
    const nutritionistObjectId = toObjectId(nutritionistId, "nutritionist ID");

    logger.info("Updating nutritionist session", {
      sessionId,
      nutritionistId,
      hasNewThumbnail: Boolean(thumbnail),
    });

    const existingSession = await this._nutriSessionRepository.findById(
      sessionObjectId.toString(),
    );

    if (
      !existingSession ||
      existingSession.deletedAt !== null ||
      !existingSession.nutritionistId.equals(nutritionistObjectId)
    ) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    const validatedDto = await NutriSessionValidation.validateUpdate(
      dto,
      existingSession,
      Boolean(thumbnail),
    );

    let newThumbnail: SessionThumbnail | undefined;

    if (thumbnail) {
      const uploadResult = await this._cloudinaryService.upload(
        thumbnail,
        "nutriwise/sessions",
      );

      newThumbnail = {
        thumbnailUrl: uploadResult.secureUrl,
        thumbnailPublicId: uploadResult.publicId,
      };
    }

    try {
      const updateData = NutriSessionPersistenceMapper.toUpdateModel(
        validatedDto,
        newThumbnail,
      );

      await this._nutriSessionRepository.updateOne(
        {
          _id: sessionObjectId,
          nutritionistId: nutritionistObjectId,
          deletedAt: null,
        },
        updateData,
      );
    } catch (error) {
      if (newThumbnail) {
        await this._cloudinaryService
          .delete(newThumbnail.thumbnailPublicId)
          .catch((cleanupError: unknown) => {
            logger.error("Failed to clean up replacement session thumbnail", {
              sessionId,
              publicId: newThumbnail.thumbnailPublicId,
              error: cleanupError,
            });
          });
      }

      throw error;
    }

    if (newThumbnail && existingSession.thumbnailPublicId) {
      await this._cloudinaryService
        .delete(existingSession.thumbnailPublicId)
        .catch((cleanupError: unknown) => {
          logger.error("Failed to delete previous session thumbnail", {
            sessionId,
            publicId: existingSession.thumbnailPublicId,
            error: cleanupError,
          });
        });
    }

    logger.info("Nutritionist session updated successfully", {
      sessionId,
      nutritionistId,
      thumbnailUpdated: Boolean(newThumbnail),
    });
  }

  async deleteSession(
    sessionId: string,
    nutritionistId: string,
  ): Promise<void> {
    const sessionObjectId = toObjectId(sessionId, "session ID");
    const nutritionistObjectId = toObjectId(nutritionistId, "nutritionist ID");

    const session = await this._nutriSessionRepository.findById(
      sessionObjectId.toString(),
    );

    if (
      !session ||
      session.deletedAt !== null ||
      !session.nutritionistId.equals(nutritionistObjectId)
    ) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    const deleted = await this._nutriSessionRepository.updateOne(
      {
        _id: sessionObjectId,
        nutritionistId: nutritionistObjectId,
        deletedAt: null,
      },
      {
        $set: {
          deletedAt: new Date(),
        },
      },
    );

    if (!deleted) {
      throw new CustomError(
        "Session could not be deleted. Please try again.",
        StatusCode.CONFLICT,
      );
    }

    if (session.thumbnailPublicId) {
      await this._cloudinaryService
        .delete(session.thumbnailPublicId)
        .catch((cleanupError: unknown) => {
          logger.error("Failed to delete session thumbnail after deletion", {
            sessionId,
            publicId: session.thumbnailPublicId,
            error: cleanupError,
          });
        });
    }

    logger.info("Nutritionist session deleted successfully", {
      sessionId,
      nutritionistId,
    });
  }

  async publishSession(
    sessionId: string,
    nutritionistId: string,
  ): Promise<void> {
    const sessionObjectId = toObjectId(sessionId, "session ID");
    const nutritionistObjectId = toObjectId(nutritionistId, "nutritionist ID");

    const session = await this._nutriSessionRepository.findById(
      sessionObjectId.toString(),
    );

    if (
      !session ||
      session.deletedAt !== null ||
      !session.nutritionistId.equals(nutritionistObjectId)
    ) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    if (session.status !== "draft") {
      throw new CustomError(
        "Only draft sessions can be published",
        StatusCode.BAD_REQUEST,
      );
    }

    NutriSessionValidation.validatePublish(session);

    const modifiedCount = await this._nutriSessionRepository.updateOne(
      {
        _id: sessionObjectId,
        nutritionistId: nutritionistObjectId,
        status: "draft",
        deletedAt: null,
        scheduledAt: { $gt: new Date() },
      },
      {
        $set: { status: "scheduled" },
      },
    );

    if (modifiedCount === 0) {
      throw new CustomError(
        "Session could not be published because it may have changed. Please try again.",
        StatusCode.CONFLICT,
      );
    }

    logger.info("Nutritionist session published successfully", {
      sessionId,
      nutritionistId,
    });
  }
}
