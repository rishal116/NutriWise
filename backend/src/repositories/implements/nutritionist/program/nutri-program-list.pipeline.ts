import type { PipelineStage, Types } from "mongoose";

import {
  ProgramSortBy,
  type GetProgramsQueryDTO,
} from "../../../../dtos/nutritionist/program/nutri-program-request.dto";

import { PROGRAM_SORT_CONFIG } from "../../../../constants/nutritionist/program/nutri-program.repository.constants";

interface INutriProgramListPipelineOptions {
  nutritionistId: Types.ObjectId;
  query: GetProgramsQueryDTO;
  cursorValue?: string | number | Date;
  cursorId?: Types.ObjectId;
}

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildNutriProgramListPipeline = ({
  nutritionistId,
  query,
  cursorValue,
  cursorId,
}: INutriProgramListPipelineOptions): PipelineStage[] => {
  const {
    search,
    programStatus = "all",
    sortBy = ProgramSortBy.LATEST,
  } = query;

  const { field: sortField, direction: sortDirection } =
    PROGRAM_SORT_CONFIG[sortBy];

  const pipeline: PipelineStage[] = [
    {
      $match: {
        nutritionistId,
        ...(programStatus !== "all" ? { status: programStatus } : {}),
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
              username: 1,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "userplans",
        localField: "userPlanId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              "planSnapshot.title": 1,
              "planSnapshot.specialization": 1,
            },
          },
        ],
        as: "userPlan",
      },
    },
    {
      $unwind: "$userPlan",
    },
    {
      $lookup: {
        from: "userprogramprogresses",
        localField: "_id",
        foreignField: "userProgramId",
        pipeline: [
          {
            $project: {
              currentDay: 1,
              completedActivities: 1,
              totalActivities: 1,
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
      $addFields: {
        currentDay: {
          $ifNull: ["$progress.currentDay", 1],
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
      },
    },
  ];

  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    const escapedSearch = escapeRegex(normalizedSearch);

    pipeline.push({
      $match: {
        $or: [
          {
            "user.fullName": {
              $regex: escapedSearch,
              $options: "i",
            },
          },
          {
            "user.username": {
              $regex: escapedSearch,
              $options: "i",
            },
          },
          {
            "userPlan.planSnapshot.title": {
              $regex: escapedSearch,
              $options: "i",
            },
          },
        ],
      },
    });
  }

  if (cursorValue !== undefined && cursorId) {
    const comparisonOperator = sortDirection === -1 ? "$lt" : "$gt";

    pipeline.push({
      $match: {
        $or: [
          {
            [sortField]: {
              [comparisonOperator]: cursorValue,
            },
          },
          {
            [sortField]: cursorValue,
            _id: {
              [comparisonOperator]: cursorId,
            },
          },
        ],
      },
    });
  }

  pipeline.push(
    {
      $sort: {
        [sortField]: sortDirection,
        _id: sortDirection,
      },
    },
    {
      $project: {
        _id: 0,
        userProgramId: "$_id",
        userId: "$user._id",
        userFullName: "$user.fullName",
        userProfileImage: "$user.profileImage",
        planTitle: "$userPlan.planSnapshot.title",
        specialization: "$userPlan.planSnapshot.specialization",
        programStatus: "$status",
        currentDay: 1,
        startDate: 1,
        endDate: 1,
        durationDays: 1,
        completionPercentage: 1,
        cursorId: "$_id",
        cursorValue: `$${sortField}`,
      },
    },
  );

  return pipeline;
};
