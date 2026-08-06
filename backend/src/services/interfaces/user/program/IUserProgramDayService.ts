import { UserProgramDayDetailsResponseDTO } from "../../../../dtos/user/program/user-program-day-details-response.dto";
import { UserProgramDayResponseDTO } from "../../../../dtos/user/program/user-program-day-response.dto";

export interface IUserProgramDayService {
  browseProgramDays(
    userId: string,
    programId: string,
  ): Promise<UserProgramDayResponseDTO[]>;

  getDayDetails(
    userId: string,
    programId: string,
    dayNumber: number,
  ): Promise<UserProgramDayDetailsResponseDTO>;
}
