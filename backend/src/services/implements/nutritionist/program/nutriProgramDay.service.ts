import { inject, injectable } from "inversify";
import { TYPES } from "../../../../types/types";
import type { INutriProgramDayService } from "../../../interfaces/nutritionist/INutriProgramDayService";
import type { INutriProgramRepository } from "../../../../repositories/interfaces/nutritionist/INutriProgramRepository";
import type { INutriProgramDayRepository } from "../../../../repositories/interfaces/nutritionist/INutriProgramDayRepository";
import { UpdateProgramDayDTO } from "../../../../dtos/nutritionist/program-day/nutri-program-day-request.dto";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import type { NutriProgramDayCardResponseDTO } from "../../../../dtos/nutritionist/program-day/nutri-program-day-card-response.dto";
import type { INutriProgramDayResponseDTO } from "../../../../dtos/nutritionist/program-day/nutri-program-day-response.dto";
import { ProgramDayListQueryDTO } from "../../../../dtos/nutritionist/program-day/nutri-program-day-list-query.dto";
import { NutriProgramDayCardMapper } from "../../../../mappers/nutritionist/program/program-day-card.mapper";
import { NutriProgramDayMapper } from "../../../../mappers/nutritionist/program/program-day.mapper";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { toObjectId } from "../../../../utils/object-id.util";
import logger from "../../../../utils/logger";

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
  ): Promise<InfiniteScrollResponseDTO<NutriProgramDayCardResponseDTO>> {
    const nutritionistObjectId = toObjectId(nutritionistId, "Nutritionist ID");

    const programObjectId = toObjectId(programId, "Program ID");

    const validatedQuery = await validateDto(ProgramDayListQueryDTO, query);

    logger.debug("Fetching program days", {
      nutritionistId,
      programId,
    });

    const programExists = await this._programRepository.exists({
      _id: programObjectId,
      nutritionistId: nutritionistObjectId,
    });

    if (!programExists) {
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    const result = await this._programDayRepository.findProgramDays(
      programId,
      validatedQuery,
    );

    logger.info("Program days fetched successfully", {
      nutritionistId,
      programId,
      count: result.items.length,
    });

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
    const nutritionistObjectId = toObjectId(nutritionistId, "Nutritionist ID");

    const dayObjectId = toObjectId(dayId, "Program day ID");

    logger.debug("Fetching program day details", {
      nutritionistId,
      dayId,
    });

    const day = await this._programDayRepository.findProgramDayById(
      dayObjectId.toString(),
    );

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    const programExists = await this._programRepository.exists({
      _id: day.userProgramId,
      nutritionistId: nutritionistObjectId,
    });

    if (!programExists) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    logger.info("Program day details fetched successfully", {
      nutritionistId,
      dayId,
    });

    return NutriProgramDayMapper.toProgramDayDTO(day);
  }

  async updateProgramDay(
    nutritionistId: string,
    dayId: string,
    dto: UpdateProgramDayDTO,
  ): Promise<void> {
    const nutritionistObjectId = toObjectId(nutritionistId, "Nutritionist ID");

    const dayObjectId = toObjectId(dayId, "Program day ID");

    const validatedDTO = await validateDto(UpdateProgramDayDTO, dto);

    logger.debug("Updating program day", {
      nutritionistId,
      dayId,
    });

    const day = await this._programDayRepository.findProgramDayById(
      dayObjectId.toString(),
    );

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    const programExists = await this._programRepository.exists({
      _id: day.userProgramId,
      nutritionistId: nutritionistObjectId,
    });

    if (!programExists) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    const updatedCount = await this._programDayRepository.updateOne(
      { _id: dayObjectId },
      { $set: validatedDTO },
    );

    if (updatedCount === 0) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    logger.info("Program day updated successfully", {
      nutritionistId,
      dayId,
    });
  }
}
