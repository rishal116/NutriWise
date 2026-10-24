import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import type { INutriProgramDayService } from "../../interfaces/nutritionist/INutriProgramDayService";
import type { INutriProgramRepository } from "../../../repositories/interfaces/nutritionist/INutriProgramRepository";
import type { INutriProgramDayRepository } from "../../../repositories/interfaces/nutritionist/INutriProgramDayRepository";
import {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/program/nutri-program-day-request.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import type { INutriProgramDayCardResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-day-card-response.dto";
import type { INutriProgramDayResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-day-response.dto";
import { NutriProgramDayCardMapper } from "../../../mappers/nutritionist/program/program-day-card.mapper";
import { NutriProgramDayMapper } from "../../../mappers/nutritionist/program/program-day.mapper";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { ProgramDayListQueryDTO } from "../../../dtos/nutritionist/program/nutri-program-day-list-query.dto";
import { Types } from "mongoose";

@injectable()
export class NutriProgramDayService implements INutriProgramDayService {
  constructor(
    @inject(TYPES.INutriProgramRepository)
    private readonly _programRepository: INutriProgramRepository,

    @inject(TYPES.INutriProgramDayRepository)
    private readonly _programDayRepository: INutriProgramDayRepository,
  ) {}
  async getProgramDays(
    nutritionistId: string,
    programId: string,
    query: ProgramDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<INutriProgramDayCardResponseDTO>> {
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

    return new InfiniteScrollResponseDTO(
      result.items.map((item) =>
        NutriProgramDayCardMapper.toProgramDayCardDTO(item),
      ),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getProgramDayDetails(
    nutritionistId: string,
    dayId: string,
  ): Promise<INutriProgramDayResponseDTO> {
    logger.debug(
      `Fetching program day details. nutritionistId=${nutritionistId}, dayId=${dayId}`,
    );

    const day = await this._programDayRepository.findProgramDayById(dayId);

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    const programExists = await this._programRepository.existsById(
      day.userProgramId.toString(),
      nutritionistId,
    );

    if (!programExists) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    logger.info(`Successfully fetched program day details. dayId=${dayId}`);

    return NutriProgramDayMapper.toProgramDayDTO(day);
  }

  async createProgramDay(
    nutritionistId: string,
    programId: string,
    dto: CreateProgramDayDTO,
  ): Promise<void> {
    const validatedDTO = await validateDto(CreateProgramDayDTO, dto);

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
      validatedDTO.dayNumber,
    );

    if (dayExists) {
      throw new CustomError(
        `Day ${validatedDTO.dayNumber} already exists for this program`,
        StatusCode.CONFLICT,
      );
    }

    const day = await this._programDayRepository.create({
      ...validatedDTO,
      userProgramId: new Types.ObjectId(programId),
      activities: validatedDTO.activities.map((activity) => ({
        ...activity,
        _id: new Types.ObjectId(),
      })),
    });

    logger.info(
      `Successfully created program day template. programId=${programId}, dayId=${day._id}`,
    );
  }

  async updateProgramDay(
    nutritionistId: string,
    dayId: string,
    dto: UpdateProgramDayDTO,
  ): Promise<void> {
    const validatedDTO = await validateDto(UpdateProgramDayDTO, dto);

    logger.debug(
      `Updating program day. nutritionistId=${nutritionistId}, dayId=${dayId}`,
    );

    const day = await this._programDayRepository.findProgramDayById(dayId);

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    const programExists = await this._programRepository.existsById(
      day.userProgramId.toString(),
      nutritionistId,
    );

    if (!programExists) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    const updatedCount = await this._programDayRepository.updateOne(
      { _id: dayId },
      { $set: validatedDTO },
    );

    if (updatedCount === 0) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    logger.info(`Successfully updated program day. dayId=${dayId}`);
  }
}
