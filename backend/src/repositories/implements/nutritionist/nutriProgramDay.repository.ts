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

import {
  IProgramDayProjection,
  ProgramDayBrowseResult,
} from "../../../types/userProgramDay.projection";

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
  ): Promise<ProgramDayBrowseResult> {
    const programId =
      typeof userProgramId === "string"
        ? new Types.ObjectId(userProgramId)
        : userProgramId;

    const days = await this._model
      .find({
        userProgramId: programId,
      })
      .sort({
        dayNumber: 1,
      })
      .lean();

    return {
      items: days.map((day) => ({
        userProgramDayId: day._id,
        userProgramId: day.userProgramId,
        dayNumber: day.dayNumber,

        meals: day.meals.map((meal) => ({
          ...meal,
          _id: meal._id!,
        })),

        workouts: day.workouts.map((workout) => ({
          ...workout,
          _id: workout._id!,
        })),

        habits: day.habits.map((habit) => ({
          ...habit,
          _id: habit._id!,
        })),

        createdAt: day.createdAt,
        updatedAt: day.updatedAt,
      })),
      nextCursor: null,
      hasMore: false,
    };
  }

  async findProgramDayById(
    dayId: string | Types.ObjectId,
  ): Promise<IProgramDayProjection | null> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    const day = await this._model.findById(id).lean();

    if (!day) {
      return null;
    }

    return {
      userProgramDayId: day._id,
      userProgramId: day.userProgramId,
      dayNumber: day.dayNumber,

      meals: day.meals.map((meal) => ({
        ...meal,
        _id: meal._id!,
      })),

      workouts: day.workouts.map((workout) => ({
        ...workout,
        _id: workout._id!,
      })),

      habits: day.habits.map((habit) => ({
        ...habit,
        _id: habit._id!,
      })),

      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    };
  }

  async createProgramDay(
    userProgramId: string | Types.ObjectId,
    dto: CreateProgramDayDTO,
  ): Promise<IProgramDayProjection> {
    const programId =
      typeof userProgramId === "string"
        ? new Types.ObjectId(userProgramId)
        : userProgramId;

    const day = await this._model.create({
      ...dto,
      userProgramId: programId,
    });

    const programDay = day.toObject();

    return {
      userProgramDayId: programDay._id,
      userProgramId: programDay.userProgramId,
      dayNumber: programDay.dayNumber,

      meals: programDay.meals.map((meal) => ({
        ...meal,
        _id: meal._id!,
      })),

      workouts: programDay.workouts.map((workout) => ({
        ...workout,
        _id: workout._id!,
      })),

      habits: programDay.habits.map((habit) => ({
        ...habit,
        _id: habit._id!,
      })),

      createdAt: programDay.createdAt,
      updatedAt: programDay.updatedAt,
    };
  }

  async updateProgramDay(
    dayId: string | Types.ObjectId,
    dto: UpdateProgramDayDTO,
  ): Promise<IProgramDayProjection | null> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    const day = await this._model
      .findByIdAndUpdate(id, dto, {
        new: true,
        runValidators: true,
      })
      .lean();

    if (!day) {
      return null;
    }

    return {
      userProgramDayId: day._id,
      userProgramId: day.userProgramId,
      dayNumber: day.dayNumber,

      meals: day.meals.map((meal) => ({
        ...meal,
        _id: meal._id!,
      })),

      workouts: day.workouts.map((workout) => ({
        ...workout,
        _id: workout._id!,
      })),

      habits: day.habits.map((habit) => ({
        ...habit,
        _id: habit._id!,
      })),

      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    };
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

    const exists = await this._model.exists({
      userProgramId: programId,
      dayNumber,
    });

    return exists !== null;
  }

  async existsById(dayId: string | Types.ObjectId): Promise<boolean> {
    const id = typeof dayId === "string" ? new Types.ObjectId(dayId) : dayId;

    const exists = await this._model.exists({
      _id: id,
    });

    return exists !== null;
  }
}