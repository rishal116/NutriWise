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
import {
  MeetingByRoomRecord,
  MeetingRoomRecord,
  MeetingStatusUpdateFields,
} from "../../../types/nutritionist/meeting/meeting-repository.types";

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
      sortBy = MeetingSortBy.SCHEDULED_AT,
      sortOrder = MeetingSortOrder.ASC,
    } = query;

    if (!Types.ObjectId.isValid(nutritionistId)) {
      throw new Error("Invalid nutritionist ID");
    }

    const nutritionistObjectId = new Types.ObjectId(nutritionistId);
    const searchText = search?.trim();
    const cursorData = decodeCursor(cursor);

    const sortOrderValue = sortOrder === MeetingSortOrder.DESC ? -1 : 1;
    const comparisonOperator = sortOrderValue === -1 ? "$lt" : "$gt";
    const cursorSortKey = `${sortBy}:${sortOrder}`;

    if (cursorData && cursorData.sortKey !== cursorSortKey) {
      throw new Error("Invalid cursor");
    }

    let sortField: "scheduledAt" | "createdAt" | "title";

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

    const pipeline: PipelineStage[] = [
      {
        $match: {
          nutritionistId: nutritionistObjectId,
          isDeleted: false,
          ...(status && { status }),
        },
      },
    ];

    if (cursorData) {
      let cursorValue: Date | string;

      if (
        sortBy === MeetingSortBy.SCHEDULED_AT ||
        sortBy === MeetingSortBy.CREATED_AT
      ) {
        if (typeof cursorData.value !== "string") {
          throw new Error("Invalid cursor");
        }

        const parsedDate = new Date(cursorData.value);

        if (Number.isNaN(parsedDate.getTime())) {
          throw new Error("Invalid cursor");
        }

        cursorValue = parsedDate;
      } else {
        if (typeof cursorData.value !== "string") {
          throw new Error("Invalid cursor");
        }

        cursorValue = cursorData.value;
      }

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
                [comparisonOperator]: new Types.ObjectId(cursorData.id),
              },
            },
          ],
        },
      });
    }

    const userLookup: PipelineStage[] = [
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
      const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push(...userLookup, {
        $match: {
          $or: [
            {
              title: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "user.fullName": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "user.email": {
                $regex: escapedSearch,
                $options: "i",
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
    );

    if (!searchText) {
      pipeline.push(...userLookup);
    }

    pipeline.push({
      $project: {
        _id: { $toString: "$_id" },
        title: 1,
        user: {
          _id: { $toString: "$user._id" },
          fullName: "$user.fullName",
          email: "$user.email",
          profileImage: "$user.profileImage",
        },
        scheduledAt: 1,
        durationInMinutes: 1,
        status: 1,
        cursorId: "$_id",
        cursorValue: `$${sortField}`,
      },
    });

    const result = await this._model
      .aggregate<MeetingCardWithCursor>(pipeline)
      .exec();

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
    if (
      !Types.ObjectId.isValid(nutritionistId) ||
      !Types.ObjectId.isValid(meetingId)
    ) {
      return null;
    }

    type PopulatedMeeting = Omit<IMeeting, "userId"> & {
      userId: {
        _id: Types.ObjectId;
        fullName: string;
        email: string;
        profileImage?: string;
      };
    };

    const meeting = await this._model
      .findOne({
        _id: new Types.ObjectId(meetingId),
        nutritionistId: new Types.ObjectId(nutritionistId),
        isDeleted: false,
      })
      .select(
        "_id title nutritionistId userId roomId scheduledAt durationInMinutes status startedAt endedAt cancelledBy cancellationReason createdAt updatedAt",
      )
      .populate<{ userId: PopulatedMeeting["userId"] }>({
        path: "userId",
        select: "_id fullName email profileImage",
      })
      .lean<PopulatedMeeting>()
      .exec();

    if (!meeting?.userId || !("fullName" in meeting.userId)) {
      return null;
    }

    return {
      _id: meeting._id,
      title: meeting.title,
      nutritionistId: meeting.nutritionistId,
      user: {
        _id: meeting.userId._id,
        fullName: meeting.userId.fullName,
        email: meeting.userId.email,
        ...(meeting.userId.profileImage
          ? { profileImage: meeting.userId.profileImage }
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
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
    };
  }

  async findMeetingByRoomId(
    roomId: string,
  ): Promise<MeetingByRoomRecord | null> {
    return this._model
      .findOne({ roomId, isDeleted: false })
      .select(
        "_id nutritionistId userId roomId status durationInMinutes startedAt endedAt",
      )
      .lean<MeetingByRoomRecord | null>()
      .exec();
  }

  async updateStatusByRoomId(
    roomId: string,
    status: MeetingStatus,
    extraFields?: MeetingStatusUpdateFields,
  ): Promise<MeetingRoomRecord | null> {
    return this._model
      .findOneAndUpdate(
        {
          roomId,
          isDeleted: false,
        },
        {
          $set: {
            ...extraFields,
            status,
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .select(
        "_id nutritionistId userId roomId status durationInMinutes startedAt endedAt cancelledBy",
      )
      .lean<MeetingRoomRecord | null>()
      .exec();
  }

  async updateMeetingById(
    nutritionistId: string,
    meetingId: string,
    data: Pick<IMeeting, "title" | "scheduledAt" | "durationInMinutes">,
  ): Promise<IMeeting | null> {
    if (
      !Types.ObjectId.isValid(nutritionistId) ||
      !Types.ObjectId.isValid(meetingId)
    ) {
      return null;
    }

    return this._model
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(meetingId),
          nutritionistId: new Types.ObjectId(nutritionistId),
          status: MeetingStatus.SCHEDULED,
          isDeleted: false,
        },
        {
          $set: data,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .lean<IMeeting | null>()
      .exec();
  }
}
