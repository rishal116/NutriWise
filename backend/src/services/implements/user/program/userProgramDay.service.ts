import { inject, injectable } from "inversify";
import { TYPES } from "../../../../types/types";
import { IUserProgramDayService } from "../../../interfaces/user/program/IUserProgramDayService";
import { IUserProgramDayRepository } from "../../../../repositories/interfaces/user/program/IUserProgramDayRepository";
import { UserProgramDayResponseDTO } from "../../../../dtos/user/program/user-program-day-response.dto";
import { UserProgramDayDetailsResponseDTO } from "../../../../dtos/user/program/user-program-day-details-response.dto";
import { UserProgramDayMapper } from "../../../../mapper/user/program/user-program-day.mapper";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import logger from "../../../../utils/logger";

@injectable()
export class UserProgramDayService implements IUserProgramDayService {
  constructor(
    @inject(TYPES.IUserProgramDayRepository)
    private readonly _userProgramDayRepository: IUserProgramDayRepository,
  ) {}

  async browseProgramDays(
    userId: string,
    programId: string,
  ): Promise<UserProgramDayResponseDTO[]> {
    logger.debug(
      "Browsing program days for userId: %s, programId: %s",
      userId,
      programId,
    );

    const days = await this._userProgramDayRepository.browseProgramDays(
      userId,
      programId,
    );

    logger.info(
      "Retrieved %d program days for programId: %s",
      days.length,
      programId,
    );

    return UserProgramDayMapper.toResponseDTOList(days);
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
      logger.warn(
        "Program day %d not found for programId: %s",
        dayNumber,
        programId,
      );

      throw new CustomError(
        "Program day not found",
        StatusCode.NOT_FOUND,
      );
    }

    logger.info(
      "Program day %d retrieved successfully",
      dayNumber,
    );

    return UserProgramDayMapper.toDetailsResponseDTO(day);
  }
}