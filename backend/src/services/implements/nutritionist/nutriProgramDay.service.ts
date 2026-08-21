import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { INutriProgramDayService } from "../../interfaces/nutritionist/INutriProgramDayService";
import { INutriProgramRepository } from "../../../repositories/interfaces/nutritionist/INutriProgramRepository";
import { INutriProgramDayRepository } from "../../../repositories/interfaces/nutritionist/INutriProgramDayRepository";
import {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/program/program-day-request.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { ProgramDayCardResponseDTO } from "../../../dtos/nutritionist/program/program-day-card-response.dto";
import { ProgramDayResponseDTO } from "../../../dtos/nutritionist/program/program-day-response.dto";
import { ProgramDayCardMapper } from "../../../mapper/nutritionist/program/program-day-card.mapper";
import { ProgramDayMapper } from "../../../mapper/nutritionist/program/program-day.mapper";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { ProgramDayListQueryDTO } from "../../../dtos/nutritionist/program/program-day-list-query.dto";
import { IUserDayTrackingService } from "../../interfaces/user/tracking/IUserDayTrackingService";
import { IUserActivityTrackingService } from "../../interfaces/user/tracking/IUserActivityTrackingService";
import {
  ActivityCompletedBy,
  ActivityTrackingValueType,
  UserActivityTrackingStatus,
} from "../../../models/userActivityTracking.model";
import { CreateUserActivityTrackingDTO } from "../../../dtos/user/tracking/create-user-activity-tracking.dto";

@injectable()
export class NutriProgramDayService implements INutriProgramDayService {
  constructor(
    @inject(TYPES.INutriProgramRepository)
    private readonly _programRepository: INutriProgramRepository,

    @inject(TYPES.INutriProgramDayRepository)
    private readonly _programDayRepository: INutriProgramDayRepository,

    @inject(TYPES.IUserDayTrackingService)
    private readonly _userDayTrackingService: IUserDayTrackingService,

    @inject(TYPES.IUserActivityTrackingService)
    private readonly _userActivityTrackingService: IUserActivityTrackingService,
  ) {}

  async getProgramDays(
    nutritionistId: string,
    programId: string,
    query: ProgramDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<ProgramDayCardResponseDTO>> {
    logger.debug(
      `Fetching program days. nutritionistId=${nutritionistId}, programId=${programId}`,
    );

    const validatedQuery = await validateDto(ProgramDayListQueryDTO, query);

    const exists = await this._programRepository.existsById(
      programId,
      nutritionistId,
    );

    if (!exists) {
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    const result = await this._programDayRepository.findProgramDays(
      programId,
      validatedQuery,
    );

    logger.info(
      `Fetched ${result.items.length} program days. nutritionistId=${nutritionistId}, programId=${programId}`,
    );

    return ProgramDayCardMapper.toInfiniteScrollDTO(result);
  }

  async getProgramDayDetails(
    nutritionistId: string,
    dayId: string,
  ): Promise<ProgramDayResponseDTO> {
    logger.debug(
      `Fetching program day details. nutritionistId=${nutritionistId}, dayId=${dayId}`,
    );

    const day = await this._programDayRepository.findProgramDayById(dayId);

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    logger.info(`Successfully fetched program day details. dayId=${dayId}`);

    return ProgramDayMapper.toProgramDayDTO(day);
  }

  async createProgramDay(
    nutritionistId: string,
    programId: string,
    dto: CreateProgramDayDTO,
  ): Promise<ProgramDayResponseDTO> {
    await validateDto(CreateProgramDayDTO, dto);

    logger.debug(
      `Creating program day. nutritionistId=${nutritionistId}, programId=${programId}`,
    );

    const exists = await this._programRepository.existsById(
      programId,
      nutritionistId,
    );

    if (!exists) {
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    const dayExists = await this._programDayRepository.existsByDayNumber(
      programId,
      dto.dayNumber,
    );

    if (dayExists) {
      throw new CustomError(
        `Day ${dto.dayNumber} already exists for this program`,
        StatusCode.CONFLICT,
      );
    }

    const day = await this._programDayRepository.createProgramDay(
      programId,
      dto,
    );

    const dayTracking =
      await this._userDayTrackingService.initializeDayTracking(
        programId,
        day._id,
        day.dayNumber,
        day.activities.length,
      );

    const activityTrackingData: CreateUserActivityTrackingDTO[] =
      day.activities.map((activity) => ({
        userId: dayTracking.userId,
        userProgramId: dayTracking.userProgramId,
        userProgramDayId: dayTracking.userProgramDayId,
        userDayTrackingId: dayTracking._id,

        activityId: activity._id.toString(),
        title: activity.title,
        category: activity.category,

        status: UserActivityTrackingStatus.NOT_STARTED,

        valueType: activity.valueType as ActivityTrackingValueType,

        ...(activity.targetValue !== undefined && {
          targetValue: activity.targetValue,
        }),

        ...(activity.unit !== undefined && {
          unit: activity.unit,
        }),

        completedBy: ActivityCompletedBy.USER,
        lastUpdatedBy: ActivityCompletedBy.USER,
      }));

    await this._userActivityTrackingService.initializeForDay(
      activityTrackingData,
    );

    logger.info(
      `Successfully created program day and initialized tracking. programId=${programId}, dayId=${day._id}`,
    );

    return ProgramDayMapper.toProgramDayDTO(day);
  }
  
  async updateProgramDay(
    nutritionistId: string,
    dayId: string,
    dto: UpdateProgramDayDTO,
  ): Promise<ProgramDayResponseDTO> {
    await validateDto(UpdateProgramDayDTO, dto);

    logger.debug(
      `Updating program day. nutritionistId=${nutritionistId}, dayId=${dayId}`,
    );

    const day = await this._programDayRepository.findProgramDayById(dayId);

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    const updated = await this._programDayRepository.updateProgramDay(
      dayId,
      dto,
    );

    if (!updated) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    logger.info(`Successfully updated program day. dayId=${dayId}`);

    return ProgramDayMapper.toProgramDayDTO(updated);
  }

  async deleteProgramDay(nutritionistId: string, dayId: string): Promise<void> {
    logger.debug(
      `Deleting program day. nutritionistId=${nutritionistId}, dayId=${dayId}`,
    );

    const day = await this._programDayRepository.findProgramDayById(dayId);

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    await this._programDayRepository.deleteProgramDay(dayId);

    logger.info(
      `Successfully deleted program day. nutritionistId=${nutritionistId}, dayId=${dayId}`,
    );
  }
}
