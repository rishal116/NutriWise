import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import type { INutriProgramProgressRepository } from "../../../repositories/interfaces/nutritionist/INutriProgramProgressRepository";
import type { INutriProgramProgressService } from "../../interfaces/nutritionist/INutriProgramProgressService";

import type { ProgramProgressScope } from "../../../types/nutritionist/program-progress/program-progress.types";

import type { GetProgramOverviewDTO } from "../../../dtos/nutritionist/program-progress/get-program-overview.dto";
import type { GetProgramDaysDTO } from "../../../dtos/nutritionist/program-progress/get-program-days.dto";
import type { GetDayActivityResultsDTO } from "../../../dtos/nutritionist/program-progress/get-day-activity-results.dto";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { ProgramProgressMapper } from "../../../mappers/nutritionist/program-progress/program-progress.mapper";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class NutriProgramProgressService implements INutriProgramProgressService {
  constructor(
    @inject(TYPES.INutriProgramProgressRepository)
    private readonly programProgressRepository: INutriProgramProgressRepository,
  ) {}

  async getProgramOverview(nutritionistId: string, dto: GetProgramOverviewDTO) {
    const scope: ProgramProgressScope = {
      clientId: dto.clientId,
      nutritionistId,
      userProgramId: dto.userProgramId,
    };

    const overview =
      await this.programProgressRepository.findProgramOverview(scope);

    if (!overview) {
      throw new CustomError("Program progress not found", StatusCode.NOT_FOUND);
    }

    return ProgramProgressMapper.toOverviewResponse(overview);
  }

  async getProgramDays(nutritionistId: string, dto: GetProgramDaysDTO) {
    const scope: ProgramProgressScope = {
      clientId: dto.clientId,
      nutritionistId,
      userProgramId: dto.userProgramId,
    };

    const result = await this.programProgressRepository.findProgramDays({
      scope,
      cursor: dto.cursor,
      limit: dto.limit,
    });

    if (!result) {
      throw new CustomError("Program progress not found", StatusCode.NOT_FOUND);
    }

    return new InfiniteScrollResponseDTO(
      result.items.map(ProgramProgressMapper.toDaySummaryResponse),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getDayActivityResults(
    nutritionistId: string,
    dto: GetDayActivityResultsDTO,
  ) {
    const scope: ProgramProgressScope = {
      clientId: dto.clientId,
      nutritionistId,
      userProgramId: dto.userProgramId,
    };

    const activities =
      await this.programProgressRepository.findDayActivityResults({
        ...scope,
        dayNumber: dto.dayNumber,
      });

    if (!activities) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    return activities.map(ProgramProgressMapper.toDayActivityResultResponse);
  }
}
