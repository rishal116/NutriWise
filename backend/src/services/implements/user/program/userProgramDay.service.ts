import { inject, injectable } from "inversify";

import { StatusCode } from "../../../../enums/statusCode.enum";
import { TYPES } from "../../../../types/types";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { UserProgramDayListQueryDTO } from "../../../../dtos/user/program/user-program-day-list-query.dto";
import type { UserProgramDayListResponseDTO } from "../../../../dtos/user/program/user-program-day-list-response.dto";
import type { UserProgramDayDetailsResponseDTO } from "../../../../dtos/user/program/user-program-day-details-response.dto";
import type { IUserProgramDayRepository } from "../../../../repositories/interfaces/user/program/IUserProgramDayRepository";
import type { IUserProgramDayService } from "../../../interfaces/user/program/IUserProgramDayService";
import { UserProgramDayListMapper } from "../../../../mappers/user/program/user-program-day-list.mapper";
import { UserProgramDayDetailsMapper } from "../../../../mappers/user/program/user-program-day-details.mapper";
import { CustomError } from "../../../../utils/customError";
import logger from "../../../../utils/logger";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { IUserDayTrackingService } from "../../../interfaces/user/tracking/IUserDayTrackingService";
import { IUserActivityTrackingService } from "../../../interfaces/user/tracking/IUserActivityTrackingService";
import { CreateUserActivityTrackingDTO } from "../../../../dtos/user/tracking/create-user-activity-tracking.dto";
import {
  ActivityCompletedBy,
  UserActivityTrackingStatus,
} from "../../../../models/userActivityTracking.model";

@injectable()
export class UserProgramDayService implements IUserProgramDayService {
  constructor(
    @inject(TYPES.IUserProgramDayRepository)
    private readonly _userProgramDayRepository: IUserProgramDayRepository,

    @inject(TYPES.IUserDayTrackingService)
    private readonly _userDayTrackingService: IUserDayTrackingService,

    @inject(TYPES.IUserActivityTrackingService)
    private readonly _userActivityTrackingService: IUserActivityTrackingService,
  ) {}

  async browseProgramDays(
    userId: string,
    programId: string,
    dto: UserProgramDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserProgramDayListResponseDTO>> {
    const query = await validateDto(UserProgramDayListQueryDTO, dto);
    logger.debug(
      "Browsing program days for userId: %s, programId: %s",
      userId,
      programId,
    );

    const result = await this._userProgramDayRepository.browseProgramDays(
      userId,
      programId,
      query,
    );

    const items = UserProgramDayListMapper.toResponseDTOList(result.items);

    logger.info(
      "Retrieved %d program days for programId: %s",
      items.length,
      programId,
    );

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getDayDetails(
    userId: string,
    programId: string,
    dayNumber: number,
  ): Promise<UserProgramDayDetailsResponseDTO> {
    logger.debug(
      "Fetching program day %d for userId: %s, programId: %s",
      dayNumber,
      userId,
      programId,
    );

    const day = await this._userProgramDayRepository.findProgramDayDetails(
      userId,
      programId,
      dayNumber,
    );

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    const dayTracking =
      await this._userDayTrackingService.initializeDayTracking(
        programId,
        day._id,
        day.dayNumber,
        day.activities.length,
      );

    const activityTrackingData: CreateUserActivityTrackingDTO[] =
      day.activities.map((activity) => ({
        userId,
        userProgramId: programId,
        userProgramDayId: day._id.toString(),
        userDayTrackingId: dayTracking._id,
        activityId: activity._id.toString(),
        title: activity.title,
        category: activity.category,
        valueType: activity.valueType,
        status: UserActivityTrackingStatus.NOT_STARTED,
        ...(activity.unit !== undefined && {
          unit: activity.unit,
        }),
        lastUpdatedBy: ActivityCompletedBy.USER,
      }));

    await this._userActivityTrackingService.initializeForDay(
      activityTrackingData,
    );

    const updatedDay =
      await this._userProgramDayRepository.findProgramDayDetails(
        userId,
        programId,
        dayNumber,
      );

    if (!updatedDay) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    logger.info(
      "Program day %d retrieved successfully for programId: %s",
      dayNumber,
      programId,
    );

    return UserProgramDayDetailsMapper.toResponseDTO(updatedDay);
  }
}
