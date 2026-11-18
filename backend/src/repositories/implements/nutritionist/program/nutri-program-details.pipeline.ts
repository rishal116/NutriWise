import type { PipelineStage, Types } from "mongoose";

interface INutriProgramDetailsPipelineOptions {
  programId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
}

export const buildNutriProgramDetailsPipeline = ({
  programId,
  nutritionistId,
}: INutriProgramDetailsPipelineOptions): PipelineStage[] => [
  {
    $match: {
      _id: programId,
      nutritionistId,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            fullName: 1,
            profileImage: 1,
          },
        },
      ],
      as: "client",
    },
  },
  {
    $unwind: "$client",
  },
  {
    $lookup: {
      from: "userplans",
      localField: "userPlanId",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            amount: 1,
            currency: 1,
            createdAt: 1,
            "planSnapshot.title": 1,
            "planSnapshot.description": 1,
            "planSnapshot.specialization": 1,
            "planSnapshot.features": 1,
          },
        },
      ],
      as: "purchase",
    },
  },
  {
    $unwind: "$purchase",
  },
  {
    $lookup: {
      from: "userprogramprogresses",
      localField: "_id",
      foreignField: "userProgramId",
      pipeline: [
        {
          $project: {
            totalDays: 1,
            completedDays: 1,
            currentDay: 1,
            totalActivities: 1,
            completedActivities: 1,
            skippedActivities: 1,
            currentStreak: 1,
            longestStreak: 1,
            lastCompletedDay: 1,
            lastActivityAt: 1,
          },
        },
      ],
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
    $project: {
      _id: 0,
      userProgramId: "$_id",
      client: {
        userId: "$client._id",
        fullName: "$client.fullName",
        profileImage: "$client.profileImage",
      },
      purchase: {
        amount: "$purchase.amount",
        currency: "$purchase.currency",
        purchasedAt: "$purchase.createdAt",
        planTitle: "$purchase.planSnapshot.title",
        planDescription: "$purchase.planSnapshot.description",
        specialization: "$purchase.planSnapshot.specialization",
        features: {
          $ifNull: ["$purchase.planSnapshot.features", []],
        },
      },
      program: {
        status: "$status",
        startDate: "$startDate",
        endDate: "$endDate",
        durationDays: "$durationDays",
        createdAt: "$createdAt",
        lifecycle: "$lifecycle",
        cancellationReason: "$cancellationReason",
        cancelledBy: "$cancelledBy",
      },
      progress: {
        totalDays: {
          $ifNull: ["$progress.totalDays", "$durationDays"],
        },
        completedDays: {
          $ifNull: ["$progress.completedDays", 0],
        },
        currentDay: {
          $ifNull: ["$progress.currentDay", 1],
        },
        totalActivities: {
          $ifNull: ["$progress.totalActivities", 0],
        },
        completedActivities: {
          $ifNull: ["$progress.completedActivities", 0],
        },
        skippedActivities: {
          $ifNull: ["$progress.skippedActivities", 0],
        },
        completionPercentage: {
          $cond: [
            {
              $gt: [{ $ifNull: ["$progress.totalActivities", 0] }, 0],
            },
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        {
                          $min: [
                            {
                              $ifNull: ["$progress.completedActivities", 0],
                            },
                            "$progress.totalActivities",
                          ],
                        },
                        "$progress.totalActivities",
                      ],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
            0,
          ],
        },
        currentStreak: {
          $ifNull: ["$progress.currentStreak", 0],
        },
        longestStreak: {
          $ifNull: ["$progress.longestStreak", 0],
        },
        lastCompletedDay: {
          $ifNull: ["$progress.lastCompletedDay", 0],
        },
        lastActivityAt: {
          $ifNull: ["$progress.lastActivityAt", null],
        },
      },
    },
  },
];
