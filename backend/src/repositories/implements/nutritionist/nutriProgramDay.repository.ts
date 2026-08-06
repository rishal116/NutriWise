import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import {
  IUserProgramDay,
  UserProgramDayModel,
} from "../../../models/userProgramDay.model";
import { INutriProgramDayRepository } from "../../interfaces/nutritionist/INutriProgramDayRepository";
import {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/program/program-day-request.dto";
import { IProgramDayProjection } from "../../../types/nutritionist/program/program-day.projection";
import { IProgramDayCardProjection } from "../../../types/nutritionist/program/program-day-card.projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

@injectable()
export class NutriProgramDayRepository
  extends BaseRepository<IUserProgramDay>
  implements INutriProgramDayRepository
{
  constructor() {
    super(UserProgramDayModel);
  }

  async findProgramDays(
    userProgramId: string | Types.ObjectId,
  ): Promise<CursorPaginationResult<IProgramDayCardProjection>> {
    const programId =
      typeof userProgramId === "string"
        ? new Types.ObjectId(userProgramId)
        : userProgramId;

    const days = await this._model
      .find(
        {
          userProgramId: programId,
        },
        {
          _id: 1,
          userProgramId: 1,
          dayNumber: 1,
          activities: 1,
        },
      )
      .sort({
        dayNumber: 1,
      })
      .lean<IUserProgramDay[]>();

    return {
      items: days.map((day) => ({
        userProgramDayId: day._id,
        userProgramId: day.userProgramId,
        dayNumber: day.dayNumber,
        activityCount: day.activities.length,
      })),
      nextCursor: null,
      hasMore: false,
    };
  }

  async findProgramDayById(
    dayId: string | Types.ObjectId,
  ): Promise<IProgramDayProjection | null> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    return this._model.findById(id).lean<IProgramDayProjection | null>();
  }

  async createProgramDay(
    userProgramId: string | Types.ObjectId,
    dto: CreateProgramDayDTO,
  ): Promise<IProgramDayProjection> {
    const programId =
      typeof userProgramId === "string"
        ? new Types.ObjectId(userProgramId)
        : userProgramId;

    return this._model.create({
      ...dto,
      userProgramId: programId,
    });
  }

  async updateProgramDay(
    dayId: string | Types.ObjectId,
    dto: UpdateProgramDayDTO,
  ): Promise<IProgramDayProjection | null> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    return this._model
      .findByIdAndUpdate(id, dto, {
        new: true,
        runValidators: true,
      })
      .lean<IProgramDayProjection | null>();
  }

  async deleteProgramDay(dayId: string | Types.ObjectId): Promise<boolean> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    const result = await this._model.deleteOne({
      _id: id,
    });

    return result.deletedCount > 0;
  }

  async existsByDayNumber(
    userProgramId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<boolean> {
    const programId =
      typeof userProgramId === "string"
        ? new Types.ObjectId(userProgramId)
        : userProgramId;

    return (
      (await this._model.exists({
        userProgramId: programId,
        dayNumber,
      })) !== null
    );
  }

  async existsById(dayId: string | Types.ObjectId): Promise<boolean> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    return (
      (await this._model.exists({
        _id: id,
      })) !== null
    );
  }
}
