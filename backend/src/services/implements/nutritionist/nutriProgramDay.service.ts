import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { INutriProgramDayService } from "../../interfaces/nutritionist/INutriProgramDayService";

import { INutriProgramRepository } from "../../../repositories/interfaces/nutritionist/INutriProgramRepository";
import { INutriProgramDayRepository } from "../../../repositories/interfaces/nutritionist/INutriProgramDayRepository";

import {
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/program/program-day-request.dto";

import {
  ProgramDayBrowseResponseDTO,
  ProgramDayDetailsDTO,
} from "../../../dtos/nutritionist/program/program-day-response.dto";

import { NutriProgramDayMapper } from "../../../mapper/nutritionist/program/nutriProgramDay.mapper";

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
  ): Promise<ProgramDayBrowseResponseDTO> {
    logger.debug(
      "Fetching program days. nutritionistId=%s programId=%s",
      nutritionistId,
      programId,
    );

    const exists = await this._programRepository.existsById(
      programId,
      nutritionistId,
    );

    if (!exists) {
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    const result = await this._programDayRepository.findProgramDays(programId);

    return NutriProgramDayMapper.toProgramDayBrowseResponseDTO(result);
  }

  async getProgramDayDetails(
    nutritionistId: string,
    dayId: string,
  ): Promise<ProgramDayDetailsDTO> {
    const day = await this._programDayRepository.findProgramDayById(dayId);

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    return NutriProgramDayMapper.toProgramDayDetailsDTO(day);
  }

  async createProgramDay(
    nutritionistId: string,
    programId: string,
    dto: CreateProgramDayDTO,
  ): Promise<ProgramDayDetailsDTO> {
    await validateDto(CreateProgramDayDTO, dto);

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

    return NutriProgramDayMapper.toProgramDayDetailsDTO(day);
  }

  async updateProgramDay(
    nutritionistId: string,
    dayId: string,
    dto: UpdateProgramDayDTO,
  ): Promise<ProgramDayDetailsDTO> {
    await validateDto(UpdateProgramDayDTO, dto);

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

    return NutriProgramDayMapper.toProgramDayDetailsDTO(updated);
  }

  async deleteProgramDay(nutritionistId: string, dayId: string): Promise<void> {
    const day = await this._programDayRepository.findProgramDayById(dayId);

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    await this._programDayRepository.deleteProgramDay(dayId);

    logger.info(
      "Program day deleted. nutritionistId=%s dayId=%s",
      nutritionistId,
      dayId,
    );
  }
}
