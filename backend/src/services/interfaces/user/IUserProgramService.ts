import { ProgramResponseDTO,ProgramDayResponseDTO} from "../../../dtos/user/userProgram.dto";


export interface IUserProgramService {


  getProgramDetails(
    programId: string,
    userId: string
  ): Promise<ProgramResponseDTO>;


  getProgramDays(
    programId: string,
    userId: string
  ): Promise<ProgramDayResponseDTO[]>;

  getProgramDayByNumber(dayNumber:number,programId:string):Promise<ProgramDayResponseDTO>;
}