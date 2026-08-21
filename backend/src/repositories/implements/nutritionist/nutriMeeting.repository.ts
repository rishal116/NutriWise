import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { INutriMeetingRepository } from "../../interfaces/nutritionist/INutriMeetingRepository";
import {
  IMeeting,
  MeetingModel,
  MeetingStatus,
} from "../../../models/meeting.model";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import {
  MeetingListQueryDTO,
  MeetingSortBy,
  MeetingSortOrder,
} from "../../../dtos/nutritionist/meeting/meeting-list-query.dto";
import { MeetingDetails } from "../../../types/nutritionist/meeting/meeting-details.type";
import {
  MeetingCard,
  MeetingCardWithCursor,
} from "../../../types/nutritionist/meeting/meeting-card.type";

export class NutriMeetingRepository
  extends BaseRepository<IMeeting>
  implements INutriMeetingRepository
{
  constructor() {
    super(MeetingModel);
  }

  async findByNutritionistId(
    nutritionistId: string,
    query: MeetingListQueryDTO,
  ): Promise<CursorPaginationResult<MeetingCard>> {
    const {
      limit = 12,
      cursor,
      search,
      status,
      type,
      sortBy = MeetingSortBy.SCHEDULED_AT,
      sortOrder = MeetingSortOrder.DESC,
    } = query;

    const searchText = search?.trim();
    const cursorData = decodeCursor(cursor);

    const nutritionistObjectId = new Types.ObjectId(nutritionistId);

    const sortOrderValue = sortOrder === MeetingSortOrder.DESC ? -1 : 1;

    const cursorSortKey = `${sortBy}:${sortOrder}`;

    if (cursorData?.sortKey && cursorData.sortKey !== cursorSortKey) {
      throw new Error("Invalid cursor");
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          nutritionistId: nutritionistObjectId,
          isDeleted: false,

          ...(status && {
            status,
          }),

          ...(type && {
            type,
          }),
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
    ];

    if (searchText) {
      pipeline.push({
        $match: {
          $or: [
            {
              title: {
                $regex: searchText,
                $options: "i",
              },
            },
            {
              "user.fullName": {
                $regex: searchText,
                $options: "i",
              },
            },
            {
              "user.email": {
                $regex: searchText,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    let sortField: string;

    switch (sortBy) {
      case MeetingSortBy.CREATED_AT:
        sortField = "createdAt";
        break;

      case MeetingSortBy.TITLE:
        sortField = "title";
        break;

      case MeetingSortBy.SCHEDULED_AT:
      default:
        sortField = "scheduledAt";
        break;
    }

    if (cursorData) {
      let cursorValue: string | Date = cursorData.value as string;

      if (
        sortBy === MeetingSortBy.SCHEDULED_AT ||
        sortBy === MeetingSortBy.CREATED_AT
      ) {
        cursorValue = new Date(cursorData.value as string);
      }

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]:
                sortOrderValue === -1
                  ? { $lt: cursorValue }
                  : { $gt: cursorValue },
            },
            {
              [sortField]: cursorValue,
              _id:
                sortOrderValue === -1
                  ? { $lt: new Types.ObjectId(cursorData.id) }
                  : { $gt: new Types.ObjectId(cursorData.id) },
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
          _id: {
            $toString: "$_id",
          },

          title: 1,

          user: {
            _id: {
              $toString: "$user._id",
            },
            fullName: "$user.fullName",
            email: "$user.email",
            profileImage:"$user.profileImage",
          },

          scheduledAt: 1,

          durationInMinutes: 1,

          status: 1,

          type: 1,

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

  async findMeetingDetailsById(
    nutritionistId: string,
    meetingId: string,
  ): Promise<MeetingDetails | null> {
    const meetingObjectId = new Types.ObjectId(meetingId);
    const nutritionistObjectId = new Types.ObjectId(nutritionistId);

    const meeting = await this._model
      .findOne({
        _id: meetingObjectId,
        nutritionistId: nutritionistObjectId,
        isDeleted: false,
      })
      .populate("userId", "_id fullName email profileImage")
      .lean()
      .exec();

    if (!meeting) {
      return null;
    }
    const populatedUser = meeting.userId as unknown as {
      _id: Types.ObjectId;
      fullName: string;
      email: string;
      profileImage?: string;
    };

    return {
      _id: meeting._id,
      title: meeting.title,
      nutritionistId: meeting.nutritionistId,

      user: {
        _id: populatedUser._id,
        fullName: populatedUser.fullName,
        email: populatedUser.email,
        ...(populatedUser.profileImage && {
          profileImage: populatedUser.profileImage,
        }),
      },

      roomId: meeting.roomId,
      scheduledAt: meeting.scheduledAt,
      durationInMinutes: meeting.durationInMinutes,
      status: meeting.status,
      type: meeting.type,

      startedAt: meeting.startedAt,
      endedAt: meeting.endedAt,

      nutritionistJoinedAt: meeting.nutritionistJoinedAt,
      userJoinedAt: meeting.userJoinedAt,

      isCancelledByUser: meeting.isCancelledByUser,
      isCancelledByNutritionist: meeting.isCancelledByNutritionist,

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
      .populate("userId", "_id fullName email profileImage")
      .lean()
      .exec();

    if (!meeting) {
      return null;
    }

    const populatedUser = meeting.userId as unknown as {
      _id: Types.ObjectId;
      fullName: string;
      email: string;
      profileImage?: string;
    };

    return {
      _id: meeting._id,
      title: meeting.title,
      nutritionistId: meeting.nutritionistId,
      user: {
        _id: populatedUser._id,
        fullName: populatedUser.fullName,
        email: populatedUser.email,
        ...(populatedUser.profileImage && {
          profileImage: populatedUser.profileImage,
        }),
      },

      roomId: meeting.roomId,
      scheduledAt: meeting.scheduledAt,
      durationInMinutes: meeting.durationInMinutes,
      status: meeting.status,
      type: meeting.type,

      startedAt: meeting.startedAt,
      endedAt: meeting.endedAt,

      nutritionistJoinedAt: meeting.nutritionistJoinedAt,
      userJoinedAt: meeting.userJoinedAt,

      isCancelledByUser: meeting.isCancelledByUser,
      isCancelledByNutritionist: meeting.isCancelledByNutritionist,

      isDeleted: meeting.isDeleted,

      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }

  async updateStatusByRoomId(
    roomId: string,
    status: MeetingStatus,
    extraFields?: Partial<IMeeting>,
  ): Promise<MeetingDetails | null> {
    return this._model
      .findOneAndUpdate(
        {
          roomId,
          isDeleted: false,
        },
        {
          $set: {
            status,
            ...extraFields,
          },
        },
        {
          new: true,
        },
      )
      .lean<MeetingDetails | null>()
      .exec();
  }
}
