import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { UserRole } from "../../../../enums/user.enum";
import {
  ClientSortBy,
  ClientStatusFilter,
  GetClientsQueryDTO,
} from "../../../../dtos/nutritionist/client/client-request.dto";
import { UserProgramModel } from "../../../../models/userProgram.model";
import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import type { IClientListProjection } from "../../../../types/nutritionist/client/nutriClientList.projection";
import { decodeCursor, encodeCursor } from "../../../../utils/cursor.util";
import { toObjectId } from "./client-query.utils";
import { INutriClientListQuery } from "../../../interfaces/nutritionist/client/INutriClientListQuery";

interface ClientProjectionWithCursor extends IClientListProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | Date;
}

type SortDirection = 1 | -1;

interface ClientSortStage {
  field: string;
  direction: SortDirection;
}

function getClientSortStage(sortBy: ClientSortBy): ClientSortStage {
  switch (sortBy) {
    case ClientSortBy.NAME_ASC:
      return { field: "fullName", direction: 1 };

    case ClientSortBy.NAME_DESC:
      return { field: "fullName", direction: -1 };

    case ClientSortBy.START_DATE:
      return { field: "earliestStartDate", direction: -1 };

    case ClientSortBy.END_DATE:
      return { field: "latestEndDate", direction: -1 };

    case ClientSortBy.LATEST:
    default:
      return { field: "latestProgramDate", direction: -1 };
  }
}

function getCursorValue(value: unknown): string | Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === "string") {
    return value;
  }

  throw new Error("Cannot create a cursor from a missing sort value");
}

@injectable()
export class NutriClientListQuery implements INutriClientListQuery {
  async execute(
    nutritionistId: string | Types.ObjectId,
    query: GetClientsQueryDTO,
  ): Promise<CursorPaginationResult<IClientListProjection>> {
    const {
      search,
      status = ClientStatusFilter.ALL,
      sortBy = ClientSortBy.LATEST,
      cursor,
      limit = 10,
    } = query;

    const nutritionistObjectId = toObjectId(nutritionistId);
    const cursorData = decodeCursor(cursor);
    const { field: sortField, direction: sortDirection } =
      getClientSortStage(sortBy);

    const isNameSort = sortField === "fullName";
    const cursorOperator = sortDirection === -1 ? "$lt" : "$gt";

    const sortStage: Record<string, SortDirection> = {
      [sortField]: sortDirection,
      _id: sortDirection,
    };

    const pipeline: PipelineStage[] = [
      {
        $match: {
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
    ];

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          "user.fullName": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      });
    }

    pipeline.push({
      $project: {
        clientId: "$user._id",
        fullName: "$user.fullName",
        profileImage: "$user.profileImage",
        program: {
          userProgramId: "$_id",
          userPlanId: "$userPlan._id",
          planId: "$planId",
          planTitle: "$userPlan.planSnapshot.title",
          programStatus: "$status",
          currentDay: { $ifNull: ["$progress.currentDay", 1] },
          durationDays: "$durationDays",
          completionPercentage: {
            $cond: [
              { $gt: [{ $ifNull: ["$progress.totalDays", 0] }, 0] },
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
                              { $ifNull: ["$progress.completedDays", 0] },
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
        programCreatedAt: "$createdAt",
      },
    });

    if (status !== ClientStatusFilter.ALL) {
      pipeline.push({
        $match: {
          "program.programStatus": status,
        },
      });
    }

    pipeline.push(
      {
        $group: {
          _id: "$clientId",
          fullName: { $first: "$fullName" },
          profileImage: { $first: "$profileImage" },
          programs: { $push: "$program" },
          latestProgramDate: { $max: "$programCreatedAt" },
          earliestStartDate: { $min: "$program.startDate" },
          latestEndDate: { $max: "$program.endDate" },
        },
      },
      {
        $set: {
          earliestStartDate: {
            $ifNull: ["$earliestStartDate", new Date(0)],
          },
          latestEndDate: {
            $ifNull: ["$latestEndDate", new Date(0)],
          },
          latestProgramDate: {
            $ifNull: ["$latestProgramDate", new Date(0)],
          },
        },
      },
    );

    if (cursorData) {
      const cursorId = toObjectId(cursorData.id);
      let cursorValue: string | Date = cursorData.value as string;

      if (!isNameSort) {
        const parsedDate = new Date(cursorData.value);

        if (Number.isNaN(parsedDate.getTime())) {
          throw new Error("Invalid cursor");
        }

        cursorValue = parsedDate;
      } else if (typeof cursorData.value !== "string") {
        throw new Error("Invalid cursor");
      }

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]: {
                [cursorOperator]: cursorValue,
              },
            },
            {
              [sortField]: cursorValue,
              _id: {
                [cursorOperator]: cursorId,
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      { $sort: sortStage },
      { $limit: limit + 1 },
      {
        $project: {
          _id: 0,
          clientId: "$_id",
          fullName: 1,
          profileImage: 1,
          programs: 1,
          cursorId: "$_id",
          cursorValue: `$${sortField}`,
        },
      },
    );

    const result =
      await UserProgramModel.aggregate<ClientProjectionWithCursor>(pipeline);

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const lastItem = items.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            value:
              getCursorValue(lastItem.cursorValue) instanceof Date
                ? (lastItem.cursorValue as Date).toISOString()
                : lastItem.cursorValue,
            id: lastItem.cursorId.toString(),
            sortKey: `${sortBy}:${search?.trim() ?? ""}:${status}`,
          })
        : null;

    return {
      items: items.map(
        ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
      ),
      nextCursor,
      hasMore,
    };
  }
}
