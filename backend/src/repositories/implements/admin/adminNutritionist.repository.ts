import { BaseRepository } from "../common/base.repository";
import { IAdminNutritionistRepository } from "../../interfaces/admin/IAdminNutritionistRepository";
import {
  NutritionistProfileModel,
  INutritionistProfile,
} from "../../../models/nutritionistProfile.model";
import { Types } from "mongoose";
import { NutritionistLevel } from "../../../enums/nutritionist.enum";
import { VerificationStatus } from "../../../models/nutritionistProfile.model";
import { PipelineStage } from "mongoose";
import { IUserDTOInput } from "../../../dtos/admin/user.dto";

export class AdminNutritionistRepository
  extends BaseRepository<INutritionistProfile>
  implements IAdminNutritionistRepository
{
  constructor() {
    super(NutritionistProfileModel);
  }

  async findByUserId(userId: string): Promise<INutritionistProfile | null> {
    return this._model.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  async getNutritionistApplications(
    skip: number,
    limit: number,
    search?: string,
  ): Promise<{
    nutritionists: IUserDTOInput[];
    total: number;
  }> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          verificationStatus: { $in: ["pending", "rejected"] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.isDeleted": false,
          ...(search
            ? {
                $or: [
                  {
                    "user.fullName": {
                      $regex: search,
                      $options: "i",
                    },
                  },
                  {
                    "user.email": {
                      $regex: search,
                      $options: "i",
                    },
                  },
                ],
              }
            : {}),
        },
      },
      {
        $project: {
          _id: "$user._id",
          fullName: "$user.fullName",
          email: "$user.email",
          roles: "$user.roles",
          activeRole: "$user.activeRole",
          isBlocked: "$user.isBlocked",
          nutritionistStatus: "$verificationStatus",
          rejectionReason: "$rejectionReason",
          createdAt: "$user.createdAt",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const nutritionists = await this._model.aggregate<IUserDTOInput>(pipeline);

    const totalPipeline: PipelineStage[] = [
      {
        $match: {
          verificationStatus: { $in: ["pending", "rejected"] },
        },
      },
      {
        $count: "total",
      },
    ];

    const totalResult = await this._model.aggregate<{ total: number }>(
      totalPipeline,
    );

    return {
      nutritionists,
      total: totalResult[0]?.total || 0,
    };
  }

  async updateNutritionistLevel(
    userId: string,
    level: NutritionistLevel,
  ): Promise<INutritionistProfile | null> {
    return this._model
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        {
          $set: {
            coachLevel: level,
          },
        },
        { new: true },
      )
      .exec();
  }

  async updateVerificationStatus(
    userId: string,
    status: VerificationStatus,
    rejectionReason = "",
  ): Promise<INutritionistProfile | null> {
    return this._model
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        {
          $set: {
            verificationStatus: status,
            rejectionReason,
          },
        },
        { new: true },
      )
      .exec();
  }
}
