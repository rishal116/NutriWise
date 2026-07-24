import { injectable, inject } from "inversify";

import { TYPES } from "../../../types/types";

import { INutriProgramService } from "../../interfaces/nutritionist/INutriProgramService";
import { INutriProgramRepository } from "../../../repositories/interfaces/nutritionist/INutriProgramRepository";

import {
  GetProgramsQueryDTO,
  GetProgramParamsDTO,
} from "../../../dtos/nutritionist/program/program-request.dto";

import {
  ProgramBrowseResponseDTO,
  ProgramDetailsDTO,
} from "../../../dtos/nutritionist/program/program-response.dto";

import { NutriProgramMapper } from "../../../mapper/nutritionist/program/nutriProgram.mapper";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";

@injectable()
export class NutriProgramService implements INutriProgramService {
  constructor(
    @inject(TYPES.INutriProgramRepository)
    private readonly _programRepository: INutriProgramRepository,
  ) {}

  async getPrograms(
    nutritionistId: string,
    query: GetProgramsQueryDTO,
  ): Promise<ProgramBrowseResponseDTO> {
    const querydto =  await validateDto(GetProgramsQueryDTO, query);
    logger.debug(
      "Fetching nutritionist programs. nutritionistId=%s",
      nutritionistId,
    );

    const result = await this._programRepository.findPrograms(
      nutritionistId,
      querydto,
    );

    logger.info(
      "Fetched %d programs for nutritionistId=%s",
      result.items.length,
      nutritionistId,
    );

    return NutriProgramMapper.toProgramBrowseResponseDTO(result);
  }

  async getProgramDetails(
    nutritionistId: string,
    params: GetProgramParamsDTO,
  ): Promise<ProgramDetailsDTO> {
    logger.debug(
      "Fetching nutritionist program details. nutritionistId=%s programId=%s",
      nutritionistId,
      params.programId,
    );

    const program = await this._programRepository.findProgramById(
      params.programId,
      nutritionistId,
    );

    if (!program) {
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    logger.info(
      "Fetched program details. nutritionistId=%s programId=%s",
      nutritionistId,
      params.programId,
    );

    return NutriProgramMapper.toProgramDetailsDTO(program);
  }
}
