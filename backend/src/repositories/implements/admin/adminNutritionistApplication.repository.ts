import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IAdminNutritionistApplicationRepository } from "../../interfaces/admin/IAdminNutritionistApplicationRepository";
import {
  INutritionistProfile,
  NutritionistProfileModel,
} from "../../../models/nutritionistProfile.model";
import { ApplicationStatus } from "../../../types/nutritionist.types";
import { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";
import { AdminNutritionistApplicationListItemDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";

export class AdminNutritionistApplicationRepository
  extends BaseRepository<INutritionistProfile>
  implements IAdminNutritionistApplicationRepository
{
  constructor() {
    super(NutritionistProfileModel);
  }

  async getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<{
    applications: AdminNutritionistApplicationListItemDto[];
    total: number;
  }> {
    const {
      skip,
      limit,
      search,
      applicationStatus,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const profileFilter: Record<string, unknown> = {};
    const userFilter: Record<string, unknown> = {};

    if (applicationStatus) {
      profileFilter.applicationStatus = applicationStatus;
    }

    const keyword = search?.trim();

    if (keyword) {
      userFilter.$or = [
        { "user.fullName": { $regex: keyword, $options: "i" } },
        { "user.email": { $regex: keyword, $options: "i" } },
        { "user.username": { $regex: keyword, $options: "i" } },
      ];
    }

    const [applications, count] = await Promise.all([
      this._model.aggregate<AdminNutritionistApplicationListItemDto>([
        {
          $match: profileFilter,
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
            "user.deletedAt": null,
            ...userFilter,
          },
        },
        {
          $project: {
            _id: 1,
            userId: "$user._id",
            fullName: "$user.fullName",
            email: "$user.email",
            profileImage: "$user.profileImage",
            applicationStatus: 1,
            createdAt: 1,
          },
        },
        {
          $sort: {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]),

      this._model.aggregate([
        {
          $match: profileFilter,
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
            "user.deletedAt": null,
            ...userFilter,
          },
        },
        {
          $count: "total",
        },
      ]),
    ]);

    return {
      applications,
      total: count[0]?.total ?? 0,
    };
  }

  async updateApplicationStatus(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<void> {
    await this._model.updateOne(
      {
        userId: new Types.ObjectId(userId),
      },
      {
        $set: {
          applicationStatus: status,
          rejectionReason: status === "rejected" ? rejectionReason : undefined,
        },
        $unset:
          status === "approved"
            ? {
                rejectionReason: "",
              }
            : {},
      },
    );
  }
}
