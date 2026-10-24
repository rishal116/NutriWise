import { Types } from "mongoose";

import { UserProgramModel } from "../../../models/userProgram.model";
import { UserProgramDayModel } from "../../../models/userProgramDay.model";
import { UserDayTrackingModel } from "../../../models/userDayTracking.model";
import { UserActivityTrackingModel } from "../../../models/userActivityTracking.model";
import { UserProgramProgressModel } from "../../../models/userProgramProgress.model";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import type {
  DayActivityResult,
  ProgramDaysQuery,
  ProgramDaySummary,
  ProgramProgressOverview,
  ProgramProgressScope,
} from "../../../types/nutritionist/program-progress/program-progress.types";
import { INutriProgramProgressRepository } from "../../interfaces/nutritionist/INutriProgramProgressRepository";

export class NutriProgramProgressRepository implements INutriProgramProgressRepository {
  async findProgramOverview(
    scope: ProgramProgressScope,
  ): Promise<ProgramProgressOverview | null> {
    const program = await UserProgramModel.findOne({
      _id: new Types.ObjectId(scope.userProgramId),
      userId: new Types.ObjectId(scope.clientId),
      nutritionistId: new Types.ObjectId(scope.nutritionistId),
    })
      .select(
        "_id userId nutritionistId userPlanId planId status startDate endDate durationDays",
      )
      .lean()
      .exec();

    if (!program) {
      return null;
    }

    const progress = await UserProgramProgressModel.findOne({
      userId: program.userId,
      userProgramId: program._id,
    })
      .select(
        "totalDays completedDays currentDay totalActivities completedActivities skippedActivities currentStreak longestStreak lastCompletedDay",
      )
      .lean()
      .exec();

    const totalActivities = progress?.totalActivities ?? 0;
    const completedActivities = progress?.completedActivities ?? 0;

    return {
      userProgramId: program._id.toString(),
      clientId: program.userId.toString(),
      nutritionistId: program.nutritionistId.toString(),
      userPlanId: program.userPlanId.toString(),
      planId: program.planId.toString(),
      status: program.status,
      startDate: program.startDate,
      endDate: program.endDate,
      durationDays: program.durationDays,
      currentDay: progress?.currentDay ?? 1,
      completedDays: progress?.completedDays ?? 0,
      totalDays: progress?.totalDays ?? program.durationDays,
      totalActivities,
      completedActivities,
      skippedActivities: progress?.skippedActivities ?? 0,
      completionPercentage:
        totalActivities > 0
          ? Math.round((completedActivities / totalActivities) * 100)
          : 0,
      currentStreak: progress?.currentStreak ?? 0,
      longestStreak: progress?.longestStreak ?? 0,
      lastCompletedDay: progress?.lastCompletedDay ?? 0,
    };
  }

  async findProgramDays(
    input: ProgramDaysQuery,
  ): Promise<CursorPaginationResult<ProgramDaySummary> | null> {
    const { scope, cursor, limit } = input;

    const program = await UserProgramModel.findOne({
      _id: new Types.ObjectId(scope.userProgramId),
      userId: new Types.ObjectId(scope.clientId),
      nutritionistId: new Types.ObjectId(scope.nutritionistId),
    })
      .select("_id userId")
      .lean()
      .exec();

    if (!program) {
      return null;
    }

    const decodedCursor = decodeCursor(cursor);
    const dayFilter: {
      userProgramId: Types.ObjectId;
      $or?: Array<
        | {
            dayNumber: { $gt: number };
          }
        | {
            dayNumber: number;
            _id: { $gt: Types.ObjectId };
          }
      >;
    } = {
      userProgramId: program._id,
    };

    if (decodedCursor) {
      const cursorId = new Types.ObjectId(decodedCursor.id);
      const cursorDayNumber = Number(decodedCursor.value);

      dayFilter.$or = [
        { dayNumber: { $gt: cursorDayNumber } },
        {
          dayNumber: cursorDayNumber,
          _id: { $gt: cursorId },
        },
      ];
    }

    const safeLimit = Math.min(Math.max(Math.trunc(limit) || 14, 1), 30);

    const days = await UserProgramDayModel.find(dayFilter)
      .select("_id dayNumber")
      .sort({ dayNumber: 1, _id: 1 })
      .limit(safeLimit + 1)
      .lean()
      .exec();

    const hasMore = days.length > safeLimit;
    const page = days.slice(0, safeLimit);

    if (page.length === 0) {
      return {
        items: [],
        nextCursor: null,
        hasMore: false,
      };
    }

    const trackingRecords = await UserDayTrackingModel.find({
      userId: program.userId,
      userProgramId: program._id,
      dayNumber: { $in: page.map((day) => day.dayNumber) },
    })
      .select(
        "dayNumber date status totalActivities completedActivities skippedActivities isLocked",
      )
      .lean()
      .exec();

    const trackingByDay = new Map(
      trackingRecords.map((tracking) => [tracking.dayNumber, tracking]),
    );

    const items = page.map((day): ProgramDaySummary => {
      const tracking = trackingByDay.get(day.dayNumber);
      const totalActivities = tracking?.totalActivities ?? 0;
      const completedActivities = tracking?.completedActivities ?? 0;

      return {
        dayNumber: day.dayNumber,
        date: tracking?.date ?? null,
        status: tracking?.status ?? null,
        totalActivities,
        completedActivities,
        skippedActivities: tracking?.skippedActivities ?? 0,
        completionPercentage:
          totalActivities > 0
            ? Math.round((completedActivities / totalActivities) * 100)
            : 0,
        isLocked: tracking?.isLocked ?? false,
      };
    });

    const lastDay = page[page.length - 1];

    const nextCursor =
      hasMore && lastDay
        ? encodeCursor({
            value: lastDay.dayNumber,
            id: lastDay._id.toString(),
            sortKey: "dayNumber",
          })
        : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async findDayActivityResults(
    input: ProgramProgressScope & { dayNumber: number },
  ): Promise<DayActivityResult[] | null> {
    const program = await UserProgramModel.findOne({
      _id: new Types.ObjectId(input.userProgramId),
      userId: new Types.ObjectId(input.clientId),
      nutritionistId: new Types.ObjectId(input.nutritionistId),
    })
      .select("_id userId")
      .lean()
      .exec();

    if (!program) {
      return null;
    }

    const day = await UserProgramDayModel.findOne({
      userProgramId: program._id,
      dayNumber: input.dayNumber,
    })
      .select("_id activities")
      .lean()
      .exec();

    if (!day) {
      return null;
    }

    const tracking = await UserActivityTrackingModel.find({
      userId: program.userId,
      userProgramId: program._id,
      userProgramDayId: day._id,
    })
      .select(
        "activityId title category valueType status recordedValue recordedText unit evidence skippedReason notes nutritionistFeedback lastUpdatedBy startedAt completedAt",
      )
      .lean()
      .exec();

    const trackingByActivityId = new Map(
      tracking.map((item) => [item.activityId.toString(), item]),
    );

    return day.activities
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((activity) => {
        const result = trackingByActivityId.get(activity._id.toString());

        return {
          activityId: activity._id.toString(),
          title: activity.title,
          category: activity.category,
          valueType: activity.valueType,
          targetValue: activity.targetValue,
          targetUnit: activity.unit,
          status: result?.status ?? "not_started",
          recordedValue: result?.recordedValue,
          recordedText: result?.recordedText,
          unit: result?.unit ?? activity.unit,
          evidence: result?.evidence ?? [],
          skippedReason: result?.skippedReason,
          notes: result?.notes,
          nutritionistFeedback: result?.nutritionistFeedback,
          lastUpdatedBy: result?.lastUpdatedBy ?? "system",
          startedAt: result?.startedAt ?? null,
          completedAt: result?.completedAt ?? null,
        };
      });
  }
}
