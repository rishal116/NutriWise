import { injectable } from "inversify";
import { Types } from "mongoose";

import { UserModel } from "../../../../models/user.model";
import { UserProgramModel } from "../../../../models/userProgram.model";
import { UserChallengeModel } from "../../../../models/userChallenge.model";

import { IUserDashboardRepository } from "../../../interfaces/user/account/IUserDashboardRepository";

import type { IUserDashboardOverviewProjection } from "../../../../types/user/dashboard/user-dashboard-overview.projection";

interface ActiveProgramProjection {
  id: Types.ObjectId;
  title: string;
  nutritionist: {
    id: Types.ObjectId;
    fullName: string;
    profileImage?: string;
  };
  status: string;
  currentDay: number;
  durationDays: number;
  completionPercentage: number;
  startDate: Date;
  endDate: Date;
}

@injectable()
export class UserDashboardRepository implements IUserDashboardRepository {
  async getOverview(
    userId: string,
  ): Promise<IUserDashboardOverviewProjection | null> {
    const userObjectId = new Types.ObjectId(userId);

    const [user, activeProgram, activePrograms, joinedChallenges] =
      await Promise.all([
        this.getUser(userObjectId),
        this.getActiveProgram(userObjectId),
        this.getActiveProgramCount(userObjectId),
        this.getJoinedChallengeCount(userObjectId),
      ]);

    if (!user) {
      return null;
    }

    return {
      user: {
        fullName: user.fullName,
        profileImage: user.profileImage,
      },

      coaching: {
        activeProgram,
      },

      summary: {
        activePrograms,
        joinedChallenges,
      },
    };
  }

  private async getUser(userId: Types.ObjectId) {
    return UserModel.findOne({
      _id: userId,
      deletedAt: null,
    })
      .select({
        fullName: 1,
        profileImage: 1,
      })
      .lean()
      .exec();
  }

  private async getActiveProgram(
    userId: Types.ObjectId,
  ): Promise<ActiveProgramProjection | null> {
    const result = await UserProgramModel.aggregate<ActiveProgramProjection>([
      {
        $match: {
          userId,
          status: "active",
          endDate: {
            $gt: new Date(),
          },
          isDeleted: false,
        },
      },
      {
        $sort: {
          startDate: -1,
          _id: -1,
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "userplans",
          localField: "userPlanId",
          foreignField: "_id",
          as: "userPlan",
        },
      },
      {
        $unwind: "$userPlan",
      },
      {
        $lookup: {
          from: "users",
          localField: "nutritionistId",
          foreignField: "_id",
          as: "nutritionist",
        },
      },
      {
        $unwind: "$nutritionist",
      },
      {
        $project: {
          _id: 0,

          id: "$_id",

          title: "$userPlan.planSnapshot.title",

          nutritionist: {
            id: "$nutritionist._id",
            fullName: "$nutritionist.fullName",
            profileImage: "$nutritionist.profileImage",
          },

          status: 1,
          currentDay: 1,
          durationDays: 1,
          completionPercentage: 1,
          startDate: 1,
          endDate: 1,
        },
      },
    ]);

    return result[0] ?? null;
  }

  private async getActiveProgramCount(userId: Types.ObjectId): Promise<number> {
    return UserProgramModel.countDocuments({
      userId,
      status: "active",
      endDate: {
        $gt: new Date(),
      },
      isDeleted: false,
    });
  }

  private async getJoinedChallengeCount(
    userId: Types.ObjectId,
  ): Promise<number> {
    return UserChallengeModel.countDocuments({
      userId,
    });
  }
}
