import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { TYPES } from "../../../types/types";

import { IResourceViewService } from "../../interfaces/resource/IResourceViewService";
import { IResourceViewRepository } from "../../../repositories/interfaces/resource/IResourceViewRepository";
import { IResourceRepository } from "../../../repositories/interfaces/resource/IResourceRepository";

@injectable()
export class ResourceViewService implements IResourceViewService {
  constructor(
    @inject(TYPES.IResourceViewRepository)
    private readonly resourceViewRepository: IResourceViewRepository,

    @inject(TYPES.IResourceRepository)
    private readonly resourceRepository: IResourceRepository,
  ) {}

  async viewResource(resourceId: string, userId: string): Promise<void> {
    this.validateIds(resourceId, userId);

    const resourceObjectId = new Types.ObjectId(resourceId);
    const userObjectId = new Types.ObjectId(userId);

    const resource = await this.resourceRepository.findById(resourceObjectId);

    if (!resource) {
      throw new CustomError("Resource not found", StatusCode.NOT_FOUND);
    }

    const newView = await this.resourceViewRepository.recordView(
      resourceObjectId,
      userObjectId,
    );

    if (!newView) {
      return;
    }

    await this.resourceRepository.updateOne(
      { _id: resourceObjectId },
      { $inc: { viewCount: 1 } },
    );
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
