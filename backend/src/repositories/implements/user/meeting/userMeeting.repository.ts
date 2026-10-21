import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import { IUserMeetingRepository } from "../../../interfaces/user/meeting/IUserMeetingRepository";
import {
  IMeeting,
  MeetingCancelledBy,
  MeetingModel,
  MeetingStatus,
} from "../../../../models/meeting.model";
import { encodeCursor, decodeCursor } from "../../../../utils/cursor.util";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import {
  UserMeetingListQueryDTO,
  MeetingSortBy,
  MeetingSortOrder,
} from "../../../../dtos/user/meeting/user-meeting-list-query.dto";
import {
  MeetingCard,
  MeetingCardWithCursor,
} from "../../../../types/user/meeting/user-meeting-card.type";
import { MeetingDetails } from "../../../../types/user/meeting/user-meeting-details.type";

export class UserMeetingRepository
  extends BaseRepository<IMeeting>
  implements IUserMeetingRepository
{
  constructor() {
    super(MeetingModel);
  }

  async findUserMeetings(
    userId: string,
    query: UserMeetingListQueryDTO,
  ): Promise<CursorPaginationResult<MeetingCard>> {
    const {
      limit = 12,
      cursor,
      search,
      status,
      sortBy = MeetingSortBy.SCHEDULED_AT,
      sortOrder = MeetingSortOrder.DESC,
    } = query;

    const searchText = search?.trim();
    const cursorData = decodeCursor(cursor);

    const userObjectId = new Types.ObjectId(userId);
    const sortOrderValue = sortOrder === MeetingSortOrder.DESC ? -1 : 1;
    const cursorSortKey = `${sortBy}:${sortOrder}`;

    if (cursorData?.sortKey && cursorData.sortKey !== cursorSortKey) {
      throw new Error("Invalid cursor: sorting options have changed.");
    }

    const sortField: "scheduledAt" | "createdAt" | "title" = sortBy;

    let cursorValue: string | Date | undefined;
    let cursorId: Types.ObjectId | undefined;

    if (cursorData) {
      if (!Types.ObjectId.isValid(cursorData.id)) {
        throw new Error("Invalid cursor: invalid meeting ID.");
      }

      cursorId = new Types.ObjectId(cursorData.id);

      if (
        sortBy === MeetingSortBy.SCHEDULED_AT ||
        sortBy === MeetingSortBy.CREATED_AT
      ) {
        cursorValue = new Date(cursorData.value);

        if (Number.isNaN(cursorValue.getTime())) {
          throw new Error("Invalid cursor: invalid date.");
        }
      } else {
        if (typeof cursorData.value !== "string") {
          throw new Error("Invalid cursor: invalid title.");
        }

        cursorValue = cursorData.value;
      }
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userObjectId,
          isDeleted: false,
          ...(status ? { status } : {}),
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

    if (searchText) {
      const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: escapedSearch, $options: "i" } },
            {
              "nutritionist.fullName": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "nutritionist.email": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (cursorData && cursorValue !== undefined && cursorId) {
      const comparisonOperator = sortOrderValue === -1 ? "$lt" : "$gt";

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
          [sortField]: sortOrderValue,
          _id: sortOrderValue,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          title: 1,
          nutritionist: {
            _id: { $toString: "$nutritionist._id" },
            fullName: "$nutritionist.fullName",
            email: "$nutritionist.email",
            profileImage: "$nutritionist.profileImage",
          },
          scheduledAt: 1,
          durationInMinutes: 1,
          status: 1,
          cursorId: "$_id",
          cursorValue: `$${sortField}`,
        },
      },
    );

    const result = await this._model.aggregate<MeetingCardWithCursor>(pipeline);

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value:
              lastItem.cursorValue instanceof Date
                ? lastItem.cursorValue.toISOString()
                : lastItem.cursorValue,
            sortKey: cursorSortKey,
          })
        : null;

    const cleanItems: MeetingCard[] = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async findMeetingDetails(
    userId: string,
    meetingId: string,
  ): Promise<MeetingDetails | null> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(meetingId)) {
      return null;
    }

    const meeting = await this._model
      .findOne({
        _id: new Types.ObjectId(meetingId),
        userId: new Types.ObjectId(userId),
        isDeleted: false,
      })
      .populate<{
        nutritionistId: {
          _id: Types.ObjectId;
          fullName: string;
          email: string;
          profileImage?: string;
        };
      }>("nutritionistId", "_id fullName email profileImage")
      .lean()
      .exec();

    if (!meeting || !meeting.nutritionistId) {
      return null;
    }

    const nutritionist = meeting.nutritionistId;

    return {
      _id: meeting._id,
      title: meeting.title,

      nutritionist: {
        _id: nutritionist._id,
        fullName: nutritionist.fullName,
        email: nutritionist.email,
        ...(nutritionist.profileImage
          ? { profileImage: nutritionist.profileImage }
          : {}),
      },

      roomId: meeting.roomId,
      scheduledAt: meeting.scheduledAt,
      durationInMinutes: meeting.durationInMinutes,
      status: meeting.status,

      ...(meeting.startedAt ? { startedAt: meeting.startedAt } : {}),
      ...(meeting.endedAt ? { endedAt: meeting.endedAt } : {}),
      ...(meeting.cancelledBy ? { cancelledBy: meeting.cancelledBy } : {}),
      ...(meeting.cancellationReason
        ? { cancellationReason: meeting.cancellationReason }
        : {}),

      isDeleted: meeting.isDeleted,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }

  async findByRoomId(roomId: string): Promise<MeetingDetails | null> {
    const meeting = await this._model
      .findOne({
        roomId,
        isDeleted: false,
      })
      .populate<{
        nutritionistId: {
          _id: Types.ObjectId;
          fullName: string;
          email: string;
          profileImage?: string;
        };
      }>("nutritionistId", "_id fullName email profileImage")
      .lean()
      .exec();

    if (!meeting || !meeting.nutritionistId) {
      return null;
    }

    const nutritionist = meeting.nutritionistId;

    return {
      _id: meeting._id,
      title: meeting.title,

      nutritionist: {
        _id: nutritionist._id,
        fullName: nutritionist.fullName,
        email: nutritionist.email,
        ...(nutritionist.profileImage
          ? { profileImage: nutritionist.profileImage }
          : {}),
      },

      roomId: meeting.roomId,
      scheduledAt: meeting.scheduledAt,
      durationInMinutes: meeting.durationInMinutes,
      status: meeting.status,

      ...(meeting.startedAt ? { startedAt: meeting.startedAt } : {}),
      ...(meeting.endedAt ? { endedAt: meeting.endedAt } : {}),
      ...(meeting.cancelledBy ? { cancelledBy: meeting.cancelledBy } : {}),

      isDeleted: meeting.isDeleted,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }

  async cancelMeeting(userId: string, meetingId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(meetingId)) {
      return false;
    }

    const result = await this._model.updateOne(
      {
        _id: new Types.ObjectId(meetingId),
        userId: new Types.ObjectId(userId),
        isDeleted: false,
        status: MeetingStatus.SCHEDULED,
      },
      {
        $set: {
          status: MeetingStatus.CANCELLED,
          cancelledBy: MeetingCancelledBy.USER,
        },
      },
    );

    return result.modifiedCount === 1;
  }
}
