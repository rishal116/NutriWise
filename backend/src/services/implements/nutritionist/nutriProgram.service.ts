import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutriProgramService } from "../../interfaces/nutritionist/INutriProgramService";
import { INutriProgramRepository } from "../../../repositories/interfaces/nutritionist/INutriProgramRepository";
import {
  GetProgramsQueryDTO,
  GetProgramParamsDTO,
} from "../../../dtos/nutritionist/program/program-request.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { UserProgramCardResponseDTO } from "../../../dtos/nutritionist/program/program-card-response.dto";
import { ProgramCardMapper } from "../../../mapper/nutritionist/program/program-card.mapper";
import { ProgramDetailsMapper } from "../../../mapper/nutritionist/program/program-details.mapper";
import { UserProgramDetailsResponseDTO } from "../../../dtos/nutritionist/program/program-details-response.dto";

@injectable()
export class NutriProgramService implements INutriProgramService {
  constructor(
    @inject(TYPES.INutriProgramRepository)
    private readonly _programRepository: INutriProgramRepository,
  ) {}

  async getPrograms(
    nutritionistId: string,
    query: GetProgramsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserProgramCardResponseDTO>> {
    const queryDto = await validateDto(GetProgramsQueryDTO, query);

    logger.info("Fetching nutritionist programs", {
      nutritionistId,
    });

    const result = await this._programRepository.findPrograms(
      nutritionistId,
      queryDto,
    );

    logger.info("Nutritionist programs fetched successfully", {
      nutritionistId,
      count: result.items.length,
    });

    return ProgramCardMapper.toInfiniteScrollResponse(result);
  }

  async getProgramDetails(
    nutritionistId: string,
    params: GetProgramParamsDTO,
  ): Promise<UserProgramDetailsResponseDTO> {
    logger.info("Fetching program details", {
      nutritionistId,
      programId: params.programId,
    });

    const program = await this._programRepository.findProgramById(
      params.programId,
      nutritionistId,
    );

    if (!program) {
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    logger.info("Program details fetched successfully", {
      nutritionistId,
      programId: params.programId,
    });

    return ProgramDetailsMapper.toDTO(program);
  }
}
