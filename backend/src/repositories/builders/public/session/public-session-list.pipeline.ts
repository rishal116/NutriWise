
import { PipelineStage, Types } from "mongoose";

import type { GetPublicSessionsQueryDTO } from "../../../../dtos/public/session/public-session-list-query.dto";
import type { PublicSessionSortOption } from "../../../../dtos/public/session/public-session-list-query.dto";

import type { CursorData } from "../../../../types/cursor.types";

import {
  buildSessionNutritionistLookupStages,
  buildSessionParticipantCountLookupStage,
  sessionParticipantCountExpression,
} from "../../common/session/session-lookup.pipeline";

const sortConfig = {
  all: {
    field: "scheduledAt",
    direction: 1,
  },
  latest: {
    field: "createdAt",
    direction: -1,
  },
  oldest: {
    field: "createdAt",
    direction: 1,
  },
  upcoming: {
    field: "scheduledAt",
    direction: 1,
  },
  price_low_to_high: {
    field: "sortPrice",
    direction: 1,
  },
  price_high_to_low: {
    field: "sortPrice",
    direction: -1,
  },
} as const;

export const getPublicSessionSortKey = (
  sortBy: PublicSessionSortOption,
): string => {
  const { field, direction } = sortConfig[sortBy];

  return `${sortBy}:${field}:${direction}`;
};

export const buildPublicSessionListPipeline = (
  query: GetPublicSessionsQueryDTO,
  cursor?: CursorData | null,
): PipelineStage[] => {
  const { search, type, pricingType, sortBy = "all", limit = 12 } = query;

  const { field: sortField, direction } = sortConfig[sortBy];
  const comparisonOperator = direction === 1 ? "$gt" : "$lt";

  const matchConditions: Record<string, unknown>[] = [
    {
      deletedAt: null,
      status: { $in: ["scheduled", "live"] },
    },
  ];

  if (sortBy === "upcoming") {
    matchConditions.push({
      scheduledAt: { $gte: new Date() },
    });
  }

  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    const escapedSearch = normalizedSearch.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    matchConditions.push({
      $or: [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ],
    });
  }

  if (type) {
    matchConditions.push({ type });
  }

  if (pricingType) {
    matchConditions.push({ pricingType });
  }

  const pipeline: PipelineStage[] = [];

  if (
    sortBy === "price_low_to_high" ||
    sortBy === "price_high_to_low"
  ) {
    pipeline.push({
      $addFields: {
        sortPrice: {
          $ifNull: ["$pricing.amount", 0],
        },
      },
    });
  }

  if (cursor) {
    const cursorId = new Types.ObjectId(cursor.id);

    const cursorValue =
      sortField === "scheduledAt" || sortField === "createdAt"
        ? new Date(cursor.value)
        : cursor.value;

    matchConditions.push({
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
    });
  }

  pipeline.push(
    {
      $match: {
        $and: matchConditions,
      },
    },
    {
      $sort: {
        [sortField]: direction,
        _id: direction,
      },
    },
    ...buildSessionNutritionistLookupStages(),
    {
      $limit: limit + 1,
    },
    buildSessionParticipantCountLookupStage(),
    {
      $project: {
        _id: 0,
        item: {
          sessionId: {
            $toString: "$_id",
          },
          title: "$title",
          description: "$description",
          type: "$type",
          pricingType: "$pricingType",
          pricing: "$pricing",
          scheduledAt: "$scheduledAt",
          duration: "$duration",
          maxParticipants: "$maxParticipants",
          participantCount: sessionParticipantCountExpression,
          thumbnailUrl: "$thumbnailUrl",
          status: "$status",
          nutritionist: {
            nutritionistId: {
              $toString: "$nutritionist._id",
            },
            name: "$nutritionist.fullName",
            profileImage: "$nutritionist.profileImage",
          },
        },
        cursorId: {
          $toString: "$_id",
        },
        cursorValue: `$${sortField}`,
      },
    },
  );

  return pipeline;
};
