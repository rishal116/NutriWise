import { injectable, inject } from "inversify";
import { TYPES } from "../../../../types/types";
import { IUserProgramService } from "../../../interfaces/user/program/IUserProgramService";
import { Types } from "mongoose";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import logger from "../../../../utils/logger";
import { UserProgramCardMapper } from "../../../../mappers/user/program/user-program-card.mapper";
import { UserProgramDetailsMapper } from "../../../../mappers/user/program/user-program-details.mapper";
import { UserProgramListQueryDTO } from "../../../../dtos/user/program/user-Program-list-query.dto";
import { UserProgramCardResponseDTO } from "../../../../dtos/user/program/user-program-card-response.dto";
import { UserProgramDetailsResponseDTO } from "../../../../dtos/user/program/user-program-details-response.dto";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { IUserProgramBrowseRepository } from "../../../../repositories/interfaces/user/program/IUserProgramBrowseRepository";

@injectable()
export class UserProgramService implements IUserProgramService {
  constructor(
    @inject(TYPES.IUserProgramBrowseRepository)
    private readonly _browseRepository: IUserProgramBrowseRepository,
  ) {}

  async browsePrograms(
    userId: string,
    query: UserProgramListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserProgramCardResponseDTO>> {
    logger.info("Browsing user programs", { userId });
    const result = await this._browseRepository.browsePrograms(
      new Types.ObjectId(userId),
      query,
    );
    const response = UserProgramCardMapper.toBrowseResponseDTO(result);
    return response;
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
    const program = await this._browseRepository.findProgramDetails(
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
    return UserProgramDetailsMapper.toResponseDTO(program);
  }
}
