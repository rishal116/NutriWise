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
    const match: Record<string, unknown> = {};
    if (coachLevel) {
      match.coachLevel = coachLevel;
    }
    if (availabilityStatus) {
      match.availabilityStatus = availabilityStatus;
    }
    if (applicationStatus) {
      match.applicationStatus = applicationStatus;
    }
    const userMatch: Record<string, unknown> = {
      isDeleted: false,
    };
    if (typeof isBlocked === "boolean") {
      userMatch.isBlocked = isBlocked;
    }
    if (search) {
      userMatch.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }
    const [nutritionists, count] = await Promise.all([
      this._model.aggregate<AdminNutritionistListItemDto>([
        {
          $match: match,
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
            ...userMatch,
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
          $match: match,
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
            ...userMatch,
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

            isBlocked: "$user.isBlocked",
            isProfileCompleted: "$user.isProfileCompleted",

            lastLoginAt: "$user.lastLoginAt",
            lastActiveAt: "$user.lastActiveAt",

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
