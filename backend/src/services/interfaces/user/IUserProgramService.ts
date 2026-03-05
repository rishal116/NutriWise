import { ProgramResponseDTO,ProgramDayResponseDTO} from "../../../dtos/user/userProgram.dto";


export interface IUserProgramService {
  getPrograms(userId: string): Promise<ProgramResponseDTO[]>;

  getProgramDetails(
    programId: string,
    userId: string
  ): Promise<ProgramResponseDTO>;


  getProgramDays(
    programId: string,
    userId: string
  ): Promise<ProgramDayResponseDTO[]>;

  getProgramDayDetails(
    dayId: string,
    userId: string
  ): Promise<ProgramDayResponseDTO>;
}