import { injectable, inject } from "inversify";
import mongoose from "mongoose";
import { TYPES } from "../../../types/types";

import { IAdminChallengeService } from "../../interfaces/admin/IAdminChallengeService";
import { IChallengeRepository } from "../../../repositories/interfaces/challenge/IChallengeRepository";
import { ITaskRepository } from "../../../repositories/interfaces/challenge/ITaskRepository";
import { IChallengeTemplateRepository } from "../../../repositories/interfaces/challenge/IChallengeTemplateRepository";

import { UpdateChallengeDTO } from "../../../dtos/challenge/challenge.dto";
import {
  CreateChallengeDTO,
  ChallengeUploadFiles,
} from "../../../dtos/challenge/createChallenge.dto";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

import { IChallenge } from "../../../models/challenge.model";
import logger from "../../../utils/logger";

import { normalizeChallengeDto } from "../../../helper/challenge/challengeNormalizer";
import { validateChallengeDto } from "../../../helper/challenge/challengeValidator";
import { uploadHeroMedia } from "../../../helper/challenge/challengeMediaProcessor";
import { processChallengeMedia } from "../../../helper/challenge/challengeMediaProcessor";
import { buildChallengeData } from "../../../helper/challenge/challengeBuilder";

@injectable()
export class AdminChallengeService implements IAdminChallengeService {
  constructor(
    @inject(TYPES.IChallengeRepository)
    private _challengeRepository: IChallengeRepository,

    @inject(TYPES.ITaskRepository)
    private _taskRepository: ITaskRepository,

    @inject(TYPES.IChallengeTemplateRepository)
    private _templateRepository: IChallengeTemplateRepository,
  ) {}

  async createChallenge(
    dto: CreateChallengeDTO,
    files: ChallengeUploadFiles,
    adminId: string,
  ): Promise<IChallenge> {
    console.log(dto);
    
    normalizeChallengeDto(dto);

    validateChallengeDto(dto);

    const session = await mongoose.startSession();
    session.startTransaction();

    logger.info("Create challenge started", {
      adminId,
      title: dto.title,
      action: "CREATE_CHALLENGE_START",
    });

    try {
      await uploadHeroMedia(dto, files, adminId);

      dto.media = await processChallengeMedia(dto, files, adminId);

      const slug = await this._generateUniqueSlug(dto.title);

      const challengeData: Partial<IChallenge> = buildChallengeData(
        dto,
        slug,
        adminId,
      );

      const challenge = await this._challengeRepository.create(
        challengeData,
        session,
      );

      await session.commitTransaction();

      logger.info("Challenge creation completed successfully", {
        challengeId: challenge._id.toString(),
        adminId,
        slug,
        action: "CREATE_CHALLENGE_SUCCESS",
      });

      return challenge;
    } catch (err) {
      await session.abortTransaction();

      logger.error("Challenge creation failed", {
        adminId,
        title: dto.title,
        error: (err as Error).message,
        stack: err instanceof Error ? err.stack : undefined,
        action: "CREATE_CHALLENGE_FAILED",
      });

      if (err instanceof CustomError) {
        throw err;
      }

      throw new CustomError(
        "Failed to create challenge",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }

  async getChallenges(page: number, limit: number) {
    logger.info("Fetching challenges list", {
      page,
      limit,
      action: "GET_CHALLENGES",
    });

    return this._challengeRepository.findAllPaginated(page, limit);
  }

  async getChallengeById(id: string) {
    logger.info("Fetching challenge by ID", {
      challengeId: id,
      action: "GET_CHALLENGE_BY_ID",
    });

    const challenge = await this._challengeRepository.findById(id);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    return challenge;
  }

  async updateChallenge(id: string, dto: UpdateChallengeDTO) {
    logger.info("Updating challenge", {
      challengeId: id,
      updates: Object.keys(dto),
      action: "UPDATE_CHALLENGE",
    });

    const updated = await this._challengeRepository.updateById(id, dto);

    if (!updated) {
      throw new CustomError(
        "Challenge not found for update",
        StatusCode.NOT_FOUND,
      );
    }

    return updated;
  }

  async deleteChallenge(id: string): Promise<void> {
    logger.warn("Soft deleting challenge", {
      challengeId: id,
      action: "DELETE_CHALLENGE",
    });

    const challenge = await this._challengeRepository.findById(id);

    if (!challenge) {
      throw new CustomError(
        "Challenge not found for deletion",
        StatusCode.NOT_FOUND,
      );
    }

    await this._challengeRepository.softDelete(id);
  }

  async publishChallenge(id: string): Promise<IChallenge | null> {
    logger.info("Publishing challenge", {
      challengeId: id,
      action: "PUBLISH_CHALLENGE",
    });

    const published = await this._challengeRepository.updateStatus(
      id,
      "published",
    );

    if (!published) {
      throw new CustomError(
        "Challenge not found for publishing",
        StatusCode.NOT_FOUND,
      );
    }

    return published;
  }

  private async _generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (await this._challengeRepository.findBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    logger.info("Generated unique challenge slug", {
      title,
      slug,
      action: "GENERATE_SLUG",
    });

    return slug;
  }
}
