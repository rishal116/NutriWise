import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { IUserDayTrackingRepository } from "../../../repositories/interfaces/user/IUserDayTrackingRepository";
import { IUserMealTrackingRepository } from "../../../repositories/interfaces/user/IUserMealTrackingRepository";
import { IUserWorkoutTrackingRepository } from "../../../repositories/interfaces/user/IUserWorkoutTrackingRepository";
import { IUserHabitTrackingRepository } from "../../../repositories/interfaces/user/IUserHabitTrackingRepository";

import { IUserDayTrackingService } from "../../interfaces/user/tracking/IUserDayTrackingService";

@injectable()
export class UserDayTrackingService implements IUserDayTrackingService {
  constructor(
    @inject(TYPES.IUserDayTrackingRepository)
    private readonly _dayTrackingRepository: IUserDayTrackingRepository,

    @inject(TYPES.IUserMealTrackingRepository)
    private readonly _mealTrackingRepository: IUserMealTrackingRepository,

    @inject(TYPES.IUserWorkoutTrackingRepository)
    private readonly _workoutTrackingRepository: IUserWorkoutTrackingRepository,

    @inject(TYPES.IUserHabitTrackingRepository)
    private readonly _habitTrackingRepository: IUserHabitTrackingRepository,
  ) {}

  async initializeDayTracking() {
    throw new Error("Method not implemented.");
  }

  async getDayTracking() {
    throw new Error("Method not implemented.");
  }

  async getProgramTracking() {
    throw new Error("Method not implemented.");
  }

  async updateDayTracking() {
    throw new Error("Method not implemented.");
  }

  async recalculateDayProgress() {
    throw new Error("Method not implemented.");
  }

  async completeDay() {
    throw new Error("Method not implemented.");
  }

  async reopenDay() {
    throw new Error("Method not implemented.");
  }
}
