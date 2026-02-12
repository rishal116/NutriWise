import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutriMeetingsRepository } from "../../../repositories/interfaces/nutritionist/INutriMeetingsRepository";
import { IUserMeetingsService } from "../../interfaces/user/IUserMeetingsService";
import { UserMeetingResponseDTO } from "../../../dtos/user/userMeetingResponse.dto";
import { UserMeetingMapper } from "../../../mapper/user/UserMeeting.mapper";

@injectable()
export class UserMeetingsService implements IUserMeetingsService {
  constructor(
    @inject(TYPES.INutriMeetingsRepository)
    private _nutriMeetingsRepository: INutriMeetingsRepository
  ) {}

  async getMeetings(userId: string): Promise<UserMeetingResponseDTO[]> {
    const meetings = await this._nutriMeetingsRepository.findByUserId(userId);
    console.log("meetings",meetings);
    
    return UserMeetingMapper.toResponseDTOList(meetings);
  }

}
