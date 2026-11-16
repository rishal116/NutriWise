import type { PipelineStage, Types } from "mongoose";

import type { ProgramStatus } from "../../../../constants/user/program/program-status.constants";

import { UserProgramSort } from "../../../../dtos/user/program/user-Program-list-query.dto";

export const USER_PROGRAM_SORT_FIELD_MAP: Record<
  UserProgramSort,
  { field: string; order: 1 | -1 }
> = {
  [UserProgramSort.NEWEST]: {
    field: "userPlan.createdAt",
    order: -1,
  },
  [UserProgramSort.OLDEST]: {
    field: "userPlan.createdAt",
    order: 1,
  },
  [UserProgramSort.START_DATE]: {
    field: "startDate",
    order: -1,
  },
  [UserProgramSort.END_DATE]: {
    field: "endDate",
    order: 1,
  },
};

interface IUserProgramBrowsePipelineParams {
  userId: Types.ObjectId;
  programStatus?: ProgramStatus;
  searchText?: string;
  sortField: string;
  sortOrder: 1 | -1;
  cursor?: {
    id: Types.ObjectId;
    value: Date;
    sortKey?: string;
  };
  limit: number;
}

const NULL_DATE_FALLBACK = new Date("1970-01-01T00:00:00.000Z");

const createProgramLookups = (): PipelineStage[] => [
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
      from: "users",
      localField: "nutritionistId",
      foreignField: "_id",
      as: "nutritionist",
    },
  },
  {
    $unwind: "$nutritionist",
  },
];

const createCompletionPercentageExpression = () => ({
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
                { $ifNull: ["$progress.completedActivities", 0] },
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
});

const createSearchMatchStage = (searchText: string): PipelineStage => {
  const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return {
    $match: {
      $or: [
        {
          "userPlan.planSnapshot.title": {
            $regex: escapedSearchText,
            $options: "i",
          },
        },
        {
          "nutritionist.fullName": {
            $regex: escapedSearchText,
            $options: "i",
          },
        },
      ],
    },
  };
};

const createCursorMatchStage = (
  sortOrder: 1 | -1,
  cursor: { id: Types.ObjectId; value: Date },
): PipelineStage => ({
  $match: {
    $or: [
      {
        __cursorValue:
          sortOrder === -1 ? { $lt: cursor.value } : { $gt: cursor.value },
      },
      {
        __cursorValue: cursor.value,
        _id: sortOrder === -1 ? { $lt: cursor.id } : { $gt: cursor.id },
      },
    ],
  },
});

export const createUserProgramBrowsePipeline = ({
  userId,
  programStatus,
  searchText,
  sortField,
  sortOrder,
  cursor,
  limit,
}: IUserProgramBrowsePipelineParams): PipelineStage[] => {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        userId,
        ...(programStatus ? { status: programStatus } : {}),
      },
    },
    ...createProgramLookups(),
    {
      $addFields: {
        __cursorValue: {
          $ifNull: [`$${sortField}`, NULL_DATE_FALLBACK],
        },
      },
    },
  ];

  if (searchText) {
    pipeline.push(createSearchMatchStage(searchText));
  }

  if (cursor) {
    pipeline.push(createCursorMatchStage(sortOrder, cursor));
  }

  pipeline.push(
    {
      $sort: {
        __cursorValue: sortOrder,
        _id: sortOrder,
      },
    },
    {
      $limit: limit + 1,
    },
    {
      $project: {
        _id: {
          $toString: "$_id",
        },
        title: "$userPlan.planSnapshot.title",
        nutritionist: {
          _id: {
            $toString: "$nutritionist._id",
          },
          fullName: "$nutritionist.fullName",
          profileImage: {
            $ifNull: ["$nutritionist.profileImage", "$$REMOVE"],
          },
        },
        programStatus: "$status",
        currentDay: {
          $ifNull: ["$progress.currentDay", 1],
        },
        durationDays: "$durationDays",
        completionPercentage: createCompletionPercentageExpression(),
        startDate: {
          $ifNull: ["$startDate", null],
        },
        endDate: {
          $ifNull: ["$endDate", null],
        },
        cursorId: "$_id",
        cursorValue: "$__cursorValue",
      },
    },
  );

  return pipeline;
};

export const createUserProgramDetailsPipeline = (
  userId: Types.ObjectId,
  programId: Types.ObjectId,
): PipelineStage[] => [
  {
    $match: {
      _id: programId,
      userId,
    },
  },
  ...createProgramLookups(),
  {
    $project: {
      _id: 1,
      userPlanId: 1,

      title: "$userPlan.planSnapshot.title",
      description: {
        $ifNull: ["$userPlan.planSnapshot.description", "$$REMOVE"],
      },
      specialization: "$userPlan.planSnapshot.specialization",
      features: {
        $ifNull: ["$userPlan.planSnapshot.features", []],
      },

      purchaseDate: "$userPlan.createdAt",
      purchaseAmount: "$userPlan.amount",
      currency: "$userPlan.currency",

      nutritionist: {
        _id: "$nutritionist._id",
        fullName: "$nutritionist.fullName",
        username: "$nutritionist.username",
        profileImage: {
          $ifNull: ["$nutritionist.profileImage", "$$REMOVE"],
        },
      },

      status: "$status",
      currentDay: {
        $ifNull: ["$progress.currentDay", 1],
      },
      durationDays: "$durationDays",
      completionPercentage: createCompletionPercentageExpression(),

      startDate: {
        $ifNull: ["$startDate", null],
      },
      endDate: {
        $ifNull: ["$endDate", null],
      },
    },
  },
];
