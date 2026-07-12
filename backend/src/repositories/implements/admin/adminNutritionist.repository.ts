import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IAdminNutritionistRepository } from "../../interfaces/admin/IAdminNutritionistRepository";
import {
  INutritionistProfile,
  NutritionistProfileModel,
} from "../../../models/nutritionistProfile.model";
import { CoachLevel } from "../../../types/nutritionist.types";
import { AdminNutritionistListItemDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { AdminNutritionistDetailsDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";
import { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";

export class AdminNutritionistRepository
  extends BaseRepository<INutritionistProfile>
  implements IAdminNutritionistRepository
{
  constructor() {
    super(NutritionistProfileModel);
  }

  async getNutritionists(query: AdminNutritionistListQueryDto): Promise<{
    nutritionists: AdminNutritionistListItemDto[];
    total: number;
  }> {
    const {
      skip,
      limit,
      search,
      coachLevel,
      availabilityStatus,
      applicationStatus,
      isBlocked,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const nutritionistFilter: Record<string, unknown> = {};
    const userFilter: Record<string, unknown> = {};

    if (coachLevel) {
      nutritionistFilter.coachLevel = coachLevel;
    }

    if (availabilityStatus) {
      nutritionistFilter.availabilityStatus = availabilityStatus;
    }

    if (applicationStatus) {
      nutritionistFilter.applicationStatus = applicationStatus;
    }

    if (typeof isBlocked === "boolean") {
      userFilter["user.isBlocked"] = isBlocked;
    }

    const keyword = search?.trim();

    if (keyword) {
      userFilter.$or = [
        { "user.fullName": { $regex: keyword, $options: "i" } },
        { "user.email": { $regex: keyword, $options: "i" } },
        { "user.username": { $regex: keyword, $options: "i" } },
      ];
    }

    const [nutritionists, count] = await Promise.all([
      this._model.aggregate<AdminNutritionistListItemDto>([
        {
          $match: nutritionistFilter,
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
            _id: "$user._id",
            userId: "$user._id",
            fullName: "$user.fullName",
            email: "$user.email",
            username: "$user.username",
            profileImage: "$user.profileImage",
            isBlocked: "$user.isBlocked",
            coachLevel: 1,
            availabilityStatus: 1,
            totalExperienceYears: 1,
            rating: 1,
            totalReviews: 1,
            totalPeopleCoached: 1,
            createdAt: "$user.createdAt",
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
          $match: nutritionistFilter,
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
      nutritionists,
      total: count[0]?.total ?? 0,
    };
  }

  async getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto | null> {
    const nutritionist =
      await this._model.aggregate<AdminNutritionistDetailsDto>([
        {
          $match: {
            userId: new Types.ObjectId(userId),
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
          $project: {
            // User
            // User
            _id: "$user._id",
            userId: "$user._id",

            fullName: "$user.fullName",
            email: "$user.email",
            username: "$user.username",

            profileImage: "$user.profileImage",
            phone: "$user.phone",
            birthDate: "$user.birthDate",
            gender: "$user.gender",

            roles: "$user.roles",
            activeRole: "$user.activeRole",

            authProvider: "$user.authProvider",
            emailVerifiedAt: "$user.emailVerifiedAt",

            isBlocked: "$user.isBlocked",
            isProfileCompleted: "$user.isProfileCompleted",

            lastLoginAt: "$user.lastLoginAt",

            // Nutritionist Profile
            qualifications: 1,
            experiences: 1,
            certifications: 1,
            specializations: 1,
            languages: 1,

            bio: 1,
            resumeUrl: 1,

            totalExperienceYears: 1,

            availabilityStatus: 1,

            applicationStatus: 1,
            rejectionReason: 1,

            coachLevel: 1,

            rating: 1,
            totalReviews: 1,
            totalPeopleCoached: 1,

            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

    return nutritionist[0] ?? null;
  }

  async updateCoachLevel(
    userId: string,
    coachLevel: CoachLevel,
  ): Promise<void> {
    await this._model.updateOne(
      {
        userId: new Types.ObjectId(userId),
      },
      {
        $set: {
          coachLevel,
        },
      },
    );
  }
}
