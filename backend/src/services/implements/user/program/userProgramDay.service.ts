import { inject, injectable } from "inversify";
import { TYPES } from "../../../../types/types";
import { IUserProgramDayService } from "../../../interfaces/user/program/IUserProgramDayService";
import { IUserProgramDayRepository } from "../../../../repositories/interfaces/user/program/IUserProgramDayRepository";
import { UserProgramDayListResponseDTO } from "../../../../dtos/user/program/user-program-day-list-response.dto";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import logger from "../../../../utils/logger";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { UserProgramDayListQueryDTO } from "../../../../dtos/user/program/user-program-day-list-query.dto";
import { UserProgramDayListMapper } from "../../../../mappers/user/program/user-program-day-list.mapper";
import { UserProgramDayDetailsResponseDTO } from "../../../../dtos/user/program/user-program-day-details-response.dto";
import { UserProgramDayDetailsMapper } from "../../../../mappers/user/program/user-program-day-details.mapper";

@injectable()
export class UserProgramDayService implements IUserProgramDayService {
  constructor(
    @inject(TYPES.IUserProgramDayRepository)
    private readonly _userProgramDayRepository: IUserProgramDayRepository,
  ) {}

  async browseProgramDays(
    userId: string,
    programId: string,
    query: UserProgramDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserProgramDayListResponseDTO>> {
    logger.debug(
      "Browsing program days for userId: %s, programId: %s",
      userId,
      programId,
    );

    const result = await this._userProgramDayRepository.browseProgramDays(
      userId,
      programId,
      query,
    );

    logger.info(
      "Retrieved %d program days for programId: %s",
      result.items.length,
      programId,
    );

    const items = UserProgramDayListMapper.toResponseDTOList(result.items);

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
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

      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    logger.info("Program day %d retrieved successfully", dayNumber);

    return UserProgramDayDetailsMapper.toResponseDTO(day);
  }
}
