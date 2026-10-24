import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutriProgramService } from "../../interfaces/nutritionist/INutriProgramService";
import { INutriProgramRepository } from "../../../repositories/interfaces/nutritionist/INutriProgramRepository";
import {
  GetProgramsQueryDTO,
  GetProgramParamsDTO,
} from "../../../dtos/nutritionist/program/nutri-program-request.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { NutriProgramCardResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-card-response.dto";
import { NutriProgramCardMapper } from "../../../mappers/nutritionist/program/nutri-program-card.mapper";
import { NutriProgramDetailsMapper } from "../../../mappers/nutritionist/program/program-details.mapper";
import { NutriProgramDetailsResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-details-response.dto";
import { Types } from "mongoose";

@injectable()
export class NutriProgramService implements INutriProgramService {
  constructor(
    @inject(TYPES.INutriProgramRepository)
    private readonly _programRepository: INutriProgramRepository,
  ) {}

  async getPrograms(
    nutritionistId: string,
    query: GetProgramsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriProgramCardResponseDTO>> {
    if (!Types.ObjectId.isValid(nutritionistId)) {
      throw new CustomError("Invalid nutritionist ID", StatusCode.BAD_REQUEST);
    }

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

    return new InfiniteScrollResponseDTO(
      result.items.map((item) => NutriProgramCardMapper.toDTO(item)),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getProgramDetails(
    nutritionistId: string,
    params: GetProgramParamsDTO,
  ): Promise<NutriProgramDetailsResponseDTO> {
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

    return NutriProgramDetailsMapper.toDTO(program);
  }
}
