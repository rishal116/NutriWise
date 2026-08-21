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
import { IClientListProjection } from "../../../types/nutriClientList.projection";
import {
  IClientDetailsProjection,
  IMeetingClientOption,
} from "../../../types/nutriClientDetails.projection";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

interface ClientProjectionWithCursor extends IClientListProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}

@injectable()
export class NutriClientRepository implements INutriClientRepository {
  async findClients(
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
    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const cursorData = decodeCursor(cursor);

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
          from: "nutritionistplans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },

      {
        $unwind: {
          path: "$plan",
          preserveNullAndEmptyArrays: true,
        },
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

    pipeline.push({
      $project: {
        clientId: "$user._id",

        fullName: "$user.fullName",
        username: "$user.username",
        profileImage: "$user.profileImage",

        program: {
          userProgramId: "$_id",
          userPlanId: "$userPlan._id",
          planId: "$planId",

          planTitle: "$userPlan.planSnapshot.title",

          subscriptionStatus: "$userPlan.subscriptionStatus",
          programStatus: "$status",

          currentDay: {
            $ifNull: ["$progress.currentDay", 1],
          },

          durationDays: "$durationDays",

          completionPercentage: {
            $ifNull: ["$progress.completionPercentage", 0],
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

    pipeline.push({
      $group: {
        _id: "$clientId",

        fullName: {
          $first: "$fullName",
        },

        username: {
          $first: "$username",
        },

        profileImage: {
          $first: "$profileImage",
        },

        programs: {
          $push: "$program",
        },

        latestProgramDate: {
          $max: "$programCreatedAt",
        },

        earliestStartDate: {
          $min: "$program.startDate",
        },

        latestEndDate: {
          $max: "$program.endDate",
        },
      },
    });

    let sortStage: Record<string, 1 | -1>;

    switch (sortBy) {
      case ClientSortBy.NAME_ASC:
        sortStage = {
          fullName: 1,
          _id: 1,
        };
        break;

      case ClientSortBy.NAME_DESC:
        sortStage = {
          fullName: -1,
          _id: -1,
        };
        break;

      case ClientSortBy.START_DATE:
        sortStage = {
          earliestStartDate: -1,
          _id: -1,
        };
        break;

      case ClientSortBy.END_DATE:
        sortStage = {
          latestEndDate: -1,
          _id: -1,
        };
        break;

      case ClientSortBy.LATEST:
      default:
        sortStage = {
          latestProgramDate: -1,
          _id: -1,
        };
        break;
    }

    if (cursorData) {
      const sortField = Object.keys(sortStage)[0];
      const sortDirection = sortStage[sortField];

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
      $sort: sortStage,
    });

    pipeline.push({
      $limit: limit + 1,
    });

    pipeline.push({
      $project: {
        _id: 0,

        clientId: "$_id",

        fullName: 1,
        username: 1,
        profileImage: 1,

        programs: 1,

        cursorId: "$_id",

        cursorValue:
          sortBy === ClientSortBy.NAME_ASC || sortBy === ClientSortBy.NAME_DESC
            ? "$fullName"
            : sortBy === ClientSortBy.START_DATE
              ? "$earliestStartDate"
              : sortBy === ClientSortBy.END_DATE
                ? "$latestEndDate"
                : "$latestProgramDate",
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
      typeof clientId === "string" ? new Types.ObjectId(clientId) : clientId;

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
          username: "$user.username",
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
            planId: "$plan._id",

            planTitle: "$plan.title",

            subscriptionStatus: "$userPlan.subscriptionStatus",
            programStatus: "$status",

            currentDay: {
              $ifNull: ["$progress.currentDay", 1],
            },

            durationDays: "$durationDays",

            completionPercentage: {
              $ifNull: ["$progress.completionPercentage", 0],
            },

            startDate: "$startDate",
            endDate: "$endDate",
          },
        },
      },

      {
        $group: {
          _id: "$clientId",

          clientId: {
            $first: "$clientId",
          },

          fullName: {
            $first: "$fullName",
          },

          username: {
            $first: "$username",
          },

          email: {
            $first: "$email",
          },

          phone: {
            $first: "$phone",
          },

          birthDate: {
            $first: "$birthDate",
          },

          gender: {
            $first: "$gender",
          },

          profileImage: {
            $first: "$profileImage",
          },

          health: {
            $first: "$health",
          },

          programs: {
            $push: "$program",
          },
        },
      },

      {
        $project: {
          _id: 0,
          clientId: 1,
          fullName: 1,
          username: 1,
          email: 1,
          phone: 1,
          birthDate: 1,
          gender: 1,
          profileImage: 1,
          health: 1,
          programs: 1,
        },
      },
    ]);

    return result[0] ?? null;
  }

  async findMeetingEligibleClients(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IMeetingClientOption[]> {
    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    return UserProgramModel.aggregate<IMeetingClientOption>([
      {
        $match: {
          nutritionistId: nutritionistObjectId,
          isDeleted: false,

          status: "active",
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

      {
        $unwind: "$userPlan",
      },

      {
        $match: {
          "userPlan.subscriptionStatus": "active",
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
        $group: {
          _id: "$user._id",

          clientId: {
            $first: "$user._id",
          },

          fullName: {
            $first: "$user.fullName",
          },

          username: {
            $first: "$user.username",
          },

          email: {
            $first: "$user.email",
          },

          profileImage: {
            $first: "$user.profileImage",
          },
        },
      },

      {
        $project: {
          _id: 0,
          clientId: 1,
          fullName: 1,
          username: 1,
          email: 1,
          profileImage: 1,
        },
      },

      {
        $sort: {
          fullName: 1,
          clientId: 1,
        },
      },
    ]);
  }
}
