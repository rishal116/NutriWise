import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";

import { IUserMeetingRepository } from "../../../../repositories/interfaces/user/meeting/IUserMeetingRepository";

import { IUserMeetingService } from "../../../interfaces/user/IUserMeetingService";

import { UserMeetingListQueryDTO } from "../../../../dtos/user/meeting/user-meeting-list-query.dto";

import { UserMeetingListResponseDTO } from "../../../../dtos/user/meeting/user-meeting-list-response.dto";

import { UserMeetingDetailsResponseDTO } from "../../../../dtos/user/meeting/user-meeting-details-response.dto";

import { UserMeetingListMapper } from "../../../../mapper/user/meeting/user-meeting-list.mapper";

import { UserMeetingDetailsMapper } from "../../../../mapper/user/meeting/user-meeting-details.mapper";

import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import logger from "../../../../utils/logger";
import { validateDto } from "../../../../middlewares/validateDto.middleware";

@injectable()
export class UserMeetingService implements IUserMeetingService {
  constructor(
    @inject(TYPES.IUserMeetingRepository)
    private readonly _userMeetingRepository: IUserMeetingRepository,
  ) {}

  async getMeetings(
    userId: string,
    query: UserMeetingListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserMeetingListResponseDTO>> {
    logger.debug("Fetching user meetings", {
      userId,
      query,
    });

    const validatedQuery = await validateDto(UserMeetingListQueryDTO, query);

    const result = await this._userMeetingRepository.findUserMeetings(
      userId,
      validatedQuery,
    );

    const items = UserMeetingListMapper.toResponseDTOList(result.items);

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getMeetingDetails(
    userId: string,
    meetingId: string,
  ): Promise<UserMeetingDetailsResponseDTO> {
    const meeting = await this._userMeetingRepository.findMeetingDetails(
      userId,
      meetingId,
    );

    if (!meeting) {
      throw new CustomError("Meeting not found", StatusCode.NOT_FOUND);
    }

    return UserMeetingDetailsMapper.toResponseDTO(meeting);
  }
}
