import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { UserProgramModel } from "../../../models/userProgram.model";
import { UserRole } from "../../../enums/user.enum";
import { INutriClientRepository } from "../../interfaces/nutritionist/INutriClientRepository";
import {
  GetClientsQueryDTO,
  ClientSortBy,
  ClientStatusFilter,
} from "../../../dtos/nutritionist/client/client-request.dto";
import {
  ClientBrowseResult,
  IClientListProjection,
} from "../../../types/nutriClientList.projection";
import { IClientDetailsProjection } from "../../../types/nutriClientDetails.projection";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

interface ClientProjectionWithCursor extends IClientListProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}

@injectable()
export class NutriClientRepository implements INutriClientRepository {
  async findClients(
    nutritionistId: string | Types.ObjectId,
    query: GetClientsQueryDTO,
  ): Promise<ClientBrowseResult> {
    const {
      search,
      status = ClientStatusFilter.ALL,
      sortBy = ClientSortBy.LATEST,
      cursor,
      limit = 10,
    } = query;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const cursorData = decodeCursor(cursor);

    let sortField = "createdAt";
    let sortDirection: 1 | -1 = -1;

    switch (sortBy) {
      case ClientSortBy.NAME_ASC:
        sortField = "user.fullName";
        sortDirection = 1;
        break;

      case ClientSortBy.NAME_DESC:
        sortField = "user.fullName";
        sortDirection = -1;
        break;

      case ClientSortBy.START_DATE:
        sortField = "startDate";
        sortDirection = -1;
        break;

      case ClientSortBy.END_DATE:
        sortField = "endDate";
        sortDirection = -1;
        break;

      case ClientSortBy.PROGRESS:
        sortField = "completionPercentage";
        sortDirection = -1;
        break;

      default:
        sortField = "createdAt";
        sortDirection = -1;
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          nutritionistId: nutritionistObjectId,
          isDeleted: false,
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
        $match: {
          "user.roles": UserRole.USER,
          "user.isBlocked": false,
          "user.deletedAt": null,
        },
      },

      {
        $lookup: {
          from: "nutritionistplans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },

      {
        $unwind: "$plan",
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
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            {
              "user.fullName": {
                $regex: search,
                $options: "i",
              },
            },
            {
              "user.username": {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (status !== ClientStatusFilter.ALL) {
      pipeline.push({
        $match: {
          status,
        },
      });
    }

    if (cursorData) {
      const comparison =
        sortDirection === -1
          ? {
              $or: [
                {
                  [sortField]: {
                    $lt: cursorData.value,
                  },
                },
                {
                  [sortField]: cursorData.value,
                  _id: {
                    $lt: new Types.ObjectId(cursorData.id),
                  },
                },
              ],
            }
          : {
              $or: [
                {
                  [sortField]: {
                    $gt: cursorData.value,
                  },
                },
                {
                  [sortField]: cursorData.value,
                  _id: {
                    $gt: new Types.ObjectId(cursorData.id),
                  },
                },
              ],
            };

      pipeline.push({
        $match: comparison,
      });
    }

    pipeline.push({
      $sort: {
        [sortField]: sortDirection,
        _id: sortDirection,
      },
    });

    pipeline.push({
      $limit: limit + 1,
    });

    pipeline.push({
      $project: {
        _id: 0,

        clientId: "$user._id",
        userProgramId: "$_id",
        userPlanId: "$userPlan._id",
        planId: "$plan._id",

        fullName: "$user.fullName",
        username: "$user.username",
        profileImage: "$user.profileImage",

        planTitle: "$plan.title",

        subscriptionStatus: "$userPlan.subscriptionStatus",
        programStatus: "$status",

        currentDay: "$currentDay",
        durationDays: "$durationDays",
        completionPercentage: "$completionPercentage",

        startDate: "$startDate",
        endDate: "$endDate",

        cursorId: "$_id",
        cursorValue: `$${sortField}`,
      },
    });

    const result =
      await UserProgramModel.aggregate<ClientProjectionWithCursor>(pipeline);

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const nextCursor = hasMore
      ? encodeCursor({
          value: items[items.length - 1].cursorValue,
          id: items[items.length - 1].cursorId.toString(),
        })
      : null;

    const browseItems = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: browseItems,
      nextCursor,
      hasMore,
    };
  }

  async findClientDetails(
    clientId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IClientDetailsProjection | null> {
    const clientObjectId =
      typeof clientId === "string"
        ? new Types.ObjectId(clientId)
        : clientId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const result = await UserProgramModel.aggregate<IClientDetailsProjection>([
      {
        $match: {
          userId: clientObjectId,
          nutritionistId: nutritionistObjectId,
          isDeleted: false,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $limit: 1,
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
        $lookup: {
          from: "nutritionistplans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },

      {
        $unwind: "$plan",
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
          username: "$user.username",
          email: "$user.email",
          phone: "$user.phone",
          birthDate: "$user.birthDate",
          gender: "$user.gender",
          profileImage: "$user.profileImage",

          userProgramId: "$_id",
          userPlanId: "$userPlan._id",
          planId: "$plan._id",

          planTitle: "$plan.title",

          subscriptionStatus: "$userPlan.subscriptionStatus",
          programStatus: "$status",

          currentDay: "$currentDay",
          durationDays: "$durationDays",
          completionPercentage: "$completionPercentage",

          startDate: "$startDate",
          endDate: "$endDate",

          health: {
            heightCm: "$health.heightCm",
            weightKg: "$health.weightKg",
            activityLevel: "$health.activityLevel",
            dietType: "$health.dietType",
            goal: "$health.goal",
            targetWeightKg: "$health.targetWeightKg",
            preferredTimeline: "$health.preferredTimeline",
          },
        },
      },
    ]);

    return result[0] ?? null;
  }
}