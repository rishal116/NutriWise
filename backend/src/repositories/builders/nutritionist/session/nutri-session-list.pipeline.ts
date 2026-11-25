import { Types, type PipelineStage } from "mongoose";
import type { GetNutriSessionsQueryDTO } from "../../../../dtos/nutritionist/session/nutri-session-list-query.dto";
import type { CursorData } from "../../../../types/cursor.types";
import { SessionRegistrationModel } from "../../../../models/sessionRegistration.model";

export function buildNutriSessionListPipeline(
  nutritionistId: Types.ObjectId,
  query: GetNutriSessionsQueryDTO,
  cursorData?: CursorData | null,
): PipelineStage[] {
  const { search, status, type, sortBy = "latest", limit = 10 } = query;

  const sortConfig = {
    latest: { field: "createdAt", direction: -1 },
    oldest: { field: "createdAt", direction: 1 },
    date_asc: { field: "scheduledAt", direction: 1 },
    date_desc: { field: "scheduledAt", direction: -1 },
  } as const;

  const { field: sortField, direction } = sortConfig[sortBy];
  const comparison = direction === -1 ? "$lt" : "$gt";

  const match: Record<string, unknown> = {
    nutritionistId,
    deletedAt: null,
  };

  if (status) match.status = status;
  if (type) match.type = type;

  const searchTerm = search?.trim();

  if (searchTerm) {
    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    match.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const pipeline: PipelineStage[] = [{ $match: match }];

  if (cursorData) {
    const cursorValue =
      cursorData.value instanceof Date
        ? cursorData.value
        : new Date(cursorData.value);

    const cursorId = new Types.ObjectId(cursorData.id);

    pipeline.push({
      $match: {
        $or: [
          { [sortField]: { [comparison]: cursorValue } },
          {
            [sortField]: cursorValue,
            _id: { [comparison]: cursorId },
          },
        ],
      },
    });
  }

  pipeline.push(
    {
      $sort: {
        [sortField]: direction,
        _id: direction,
      },
    },
    { $limit: limit + 1 },
    {
      $lookup: {
        from: SessionRegistrationModel.collection.name,
        let: { sessionId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$sessionId", "$$sessionId"] },
              status: "registered",
              paymentStatus: {
                $in: ["not_required", "paid"],
              },
            },
          },
          { $count: "count" },
        ],
        as: "registrationStats",
      },
    },
    {
      $project: {
        _id: 0,
        sessionId: "$_id",
        title: 1,
        type: 1,
        pricingType: 1,
        pricing: 1,
        scheduledAt: 1,
        duration: 1,
        endTime: 1,
        thumbnailUrl: 1,
        status: 1,
        participantCount: {
          $ifNull: [{ $arrayElemAt: ["$registrationStats.count", 0] }, 0],
        },
        cursorId: "$_id",
        cursorValue: `$${sortField}`,
      },
    },
  );

  return pipeline;
}
