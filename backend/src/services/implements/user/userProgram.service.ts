import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserProgramService } from "../../interfaces/user/IUserProgramService";
import { IUserProgramRepository } from "../../../repositories/interfaces/user/IUserProgramRepository";
import { Types } from "mongoose";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { ProgramMapper } from "../../../mapper/user/program/user-program.mapper";
import { UserProgramListQueryDTO } from "../../../dtos/user/program/user-Program-list-query.dto";
import { UserProgramCardResponseDTO } from "../../../dtos/user/program/user-program-card-response.dto";
import { UserProgramDetailsResponseDTO } from "../../../dtos/user/program/user-program-details-response.dto";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

@injectable()
export class UserProgramService implements IUserProgramService {
  constructor(
    @inject(TYPES.IUserProgramRepository)
    private _userProgramRepository: IUserProgramRepository,
  ) {}

  async browsePrograms(
    userId: string,
    query: UserProgramListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserProgramCardResponseDTO>> {
    logger.debug("Browsing programs for user: %s", userId);

    const result = await this._userProgramRepository.browsePrograms(
      new Types.ObjectId(userId),
      query,
    );

    return ProgramMapper.toBrowseResponseDTO(result);
  }

  async getProgramDetails(
    programId: string,
    userId: string,
  ): Promise<UserProgramDetailsResponseDTO> {
    logger.debug(
      "Fetching program details. userId=%s, programId=%s",
      userId,
      programId,
    );

    const program = await this._userProgramRepository.findProgramDetails(
      new Types.ObjectId(userId),
      new Types.ObjectId(programId),
    );

    if (!program) {
      logger.warn(
        "Program not found. userId=%s, programId=%s",
        userId,
        programId,
      );

      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    return ProgramMapper.toDetailsResponseDTO(program);
  }
}
