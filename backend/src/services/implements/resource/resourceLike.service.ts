import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

import { IResourceLikeRepository } from "../../../repositories/interfaces/resource/IResourceLikeRepository";
import { IResourceRepository } from "../../../repositories/interfaces/resource/IResourceRepository";
import { IResourceLikeService } from "../../interfaces/resource/IResourceLikeService";

@injectable()
export class ResourceLikeService implements IResourceLikeService {
  constructor(
    @inject(TYPES.IResourceLikeRepository)
    private readonly _resourceLikeRepository: IResourceLikeRepository,

    @inject(TYPES.IResourceRepository)
    private readonly _resourceRepository: IResourceRepository,
  ) {}

  async likeResource(resourceId: string, userId: string): Promise<void> {
    this.validateIds(resourceId, userId);

    const resourceObjectId = new Types.ObjectId(resourceId);
    const userObjectId = new Types.ObjectId(userId);

    const resource = await this._resourceRepository.findById(resourceObjectId);

    if (!resource) {
      throw new CustomError("Resource not found", StatusCode.NOT_FOUND);
    }

    const existingLike =
      await this._resourceLikeRepository.existsByResourceAndUser(
        resourceObjectId,
        userObjectId,
      );

    if (existingLike) {
      return;
    }

    try {
      await this._resourceLikeRepository.create({
        resourceId: resourceObjectId,
        userId: userObjectId,
      });
    } catch (error) {
      if (
        error !== null &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 11000
      ) {
        return;
      }

      throw error;
    }

    await this._resourceRepository.incrementLikeCount(resourceObjectId);
  }

  async unlikeResource(resourceId: string, userId: string): Promise<void> {
    this.validateIds(resourceId, userId);

    const resourceObjectId = new Types.ObjectId(resourceId);
    const userObjectId = new Types.ObjectId(userId);

    const resource = await this._resourceRepository.findById(resourceObjectId);

    if (!resource) {
      throw new CustomError("Resource not found", StatusCode.NOT_FOUND);
    }

    const deleted = await this._resourceLikeRepository.deleteByResourceAndUser(
      resourceObjectId,
      userObjectId,
    );

    if (!deleted) {
      return;
    }

    await this._resourceRepository.decrementLikeCount(resourceObjectId);
  }

  private validateIds(resourceId: string, userId: string): void {
    if (
      !Types.ObjectId.isValid(resourceId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      throw new CustomError(
        "Invalid resource or user ID",
        StatusCode.BAD_REQUEST,
      );
    }
  }
}
