import { injectable, inject } from "inversify";
import { TYPES } from "../../../../types/types";
import type { IUserProgramService } from "../../../interfaces/user/program/IUserProgramService";
import type { IUserProgramBrowseRepository } from "../../../../repositories/interfaces/user/program/IUserProgramBrowseRepository";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import logger from "../../../../utils/logger";
import { UserProgramCardMapper } from "../../../../mappers/user/program/user-program-card.mapper";
import { UserProgramDetailsMapper } from "../../../../mappers/user/program/user-program-details.mapper";
import { UserProgramListQueryDTO } from "../../../../dtos/user/program/user-Program-list-query.dto";
import type { IUserProgramCardResponseDTO } from "../../../../dtos/user/program/user-program-card-response.dto";
import type { IUserProgramDetailsResponseDTO } from "../../../../dtos/user/program/user-program-details-response.dto";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { toObjectId } from "../../../../utils/object-id.util";

@injectable()
export class UserProgramService implements IUserProgramService {
  constructor(
    @inject(TYPES.IUserProgramBrowseRepository)
    private readonly _browseRepository: IUserProgramBrowseRepository,
  ) {}

  async browsePrograms(
    userId: string,
    dto: UserProgramListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<IUserProgramCardResponseDTO>> {
    const userObjectId = toObjectId(userId, "user ID");
    const query = await validateDto(UserProgramListQueryDTO, dto);

    logger.info("Browsing user programs", { userId });

    const result = await this._browseRepository.browsePrograms(
      userObjectId,
      query,
    );

    const items = result.items.map(UserProgramCardMapper.toResponseDTO);

    logger.info("User programs retrieved successfully", {
      userId,
      count: items.length,
      hasMore: result.hasMore,
    });

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getProgramDetails(
    programId: string,
    userId: string,
  ): Promise<IUserProgramDetailsResponseDTO> {
    const userObjectId = toObjectId(userId, "user ID");
    const programObjectId = toObjectId(programId, "program ID");

    logger.info("Fetching user program details", {
      userId,
      programId,
    });

    const program = await this._browseRepository.findProgramDetails(
      userObjectId,
      programObjectId,
    );

    if (!program) {
      logger.warn("User program not found", {
        userId,
        programId,
      });

      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    return UserProgramDetailsMapper.toResponseDTO(program);
  }
}
