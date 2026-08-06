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
  ): Promise<InfiniteScrollResponseDTO<ProgramDayCardResponseDTO>> {
    logger.debug(
      `Fetching program days. nutritionistId=${nutritionistId}, programId=${programId}`,
    );

    const exists = await this._programRepository.existsById(
      programId,
      nutritionistId,
    );

    if (!exists) {
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    const result = await this._programDayRepository.findProgramDays(programId);

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

    const day = await this._programDayRepository.createProgramDay(
      programId,
      dto,
    );

    logger.info(
      `Successfully created program day. programId=${programId}, dayId=${day._id}`,
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
