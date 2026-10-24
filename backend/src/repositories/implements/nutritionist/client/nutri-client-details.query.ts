import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { UserRole } from "../../../../enums/user.enum";
import { UserProgramModel } from "../../../../models/userProgram.model";
import type { IClientDetailsProjection } from "../../../../types/nutritionist/client/nutriClientDetails.projection";
import { toObjectId } from "./client-query.utils";
import { INutriClientDetailsQuery } from "../../../interfaces/nutritionist/client/INutriClientDetailsQuery";

@injectable()
export class NutriClientDetailsQuery implements INutriClientDetailsQuery {
  async execute(
    clientId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IClientDetailsProjection | null> {
    const clientObjectId = toObjectId(clientId);
    const nutritionistObjectId = toObjectId(nutritionistId);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: clientObjectId,
          nutritionistId: nutritionistObjectId,
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
      { $unwind: "$user" },
      {
        $match: {
          "user.roles": UserRole.USER,
          "user.isBlocked": false,
          "user.deletedAt": null,
        },
      },
      {
        $lookup: {
          from: "userplans",
          localField: "userPlanId",
          foreignField: "_id",
          as: "userPlan",
        },
      },
      { $unwind: "$userPlan" },
      {
        $lookup: {
          from: "userprogramprogresses",
          localField: "_id",
          foreignField: "userProgramId",
          as: "progress",
        },
      },
      {
        $unwind: {
          path: "$progress",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "healthdetails",
          localField: "userId",
          foreignField: "userId",
          as: "health",
        },
      },
      {
        $unwind: {
          path: "$health",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          clientId: "$user._id",
          fullName: "$user.fullName",
          email: "$user.email",
          phone: "$user.phone",
          birthDate: "$user.birthDate",
          gender: "$user.gender",
          profileImage: "$user.profileImage",
          health: {
            heightCm: "$health.heightCm",
            weightKg: "$health.weightKg",
            activityLevel: "$health.activityLevel",
            dietType: "$health.dietType",
            goal: "$health.goal",
            targetWeightKg: "$health.targetWeightKg",
            preferredTimeline: "$health.preferredTimeline",
          },
          program: {
            userProgramId: "$_id",
            userPlanId: "$userPlan._id",
            planId: "$planId",
            planTitle: "$userPlan.planSnapshot.title",
            programStatus: "$status",
            currentDay: {
              $ifNull: ["$progress.currentDay", 1],
            },
            durationDays: "$durationDays",
            completionPercentage: {
              $cond: [
                {
                  $gt: [{ $ifNull: ["$progress.totalDays", 0] }, 0],
                },
                {
                  $min: [
                    100,
                    {
                      $max: [
                        0,
                        {
                          $multiply: [
                            {
                              $divide: [
                                {
                                  $ifNull: ["$progress.completedDays", 0],
                                },
                                "$progress.totalDays",
                              ],
                            },
                            100,
                          ],
                        },
                      ],
                    },
                  ],
                },
                0,
              ],
            },
            startDate: "$startDate",
            endDate: "$endDate",
          },
        },
      },
      {
        $group: {
          _id: "$clientId",
          clientId: { $first: "$clientId" },
          fullName: { $first: "$fullName" },
          email: { $first: "$email" },
          phone: { $first: "$phone" },
          birthDate: { $first: "$birthDate" },
          gender: { $first: "$gender" },
          profileImage: { $first: "$profileImage" },
          health: { $first: "$health" },
          programs: { $push: "$program" },
        },
      },
      {
        $project: {
          _id: 0,
          clientId: 1,
          fullName: 1,
          email: 1,
          phone: 1,
          birthDate: 1,
          gender: 1,
          profileImage: 1,
          health: 1,
          programs: 1,
        },
      },
      { $limit: 1 },
    ];

    const result =
      await UserProgramModel.aggregate<IClientDetailsProjection>(pipeline);

    return result[0] ?? null;
  }
}
