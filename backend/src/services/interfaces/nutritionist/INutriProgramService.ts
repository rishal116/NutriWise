import { ProgramResponseDTO, CreateProgramDTO,ProgramDayResponseDTO,CreateProgramDayDTO, 
  UpdateProgramDayDTO
 } from "../../../dtos/nutritionist/programResponse.dto";


export interface INutriProgramService {
  getPrograms(nutritionistId: string): Promise<ProgramResponseDTO[]>;

  getProgramDetails(
    programId: string,
    nutritionistId: string
  ): Promise<ProgramResponseDTO>;

  createProgram(
    data: CreateProgramDTO
  ): Promise<ProgramResponseDTO>;

  getProgramDays(
    programId: string,
    nutritionistId: string
  ): Promise<ProgramDayResponseDTO[]>;

  getProgramDayDetails(
    dayId: string,
    nutritionistId: string
  ): Promise<ProgramDayResponseDTO>;

  createProgramDay(
    data: CreateProgramDayDTO,
    nutritionistId: string
  ): Promise<ProgramDayResponseDTO>;

  updateProgramDay(
    dayId: string,
    data: UpdateProgramDayDTO,
    nutritionistId: string
  ): Promise<ProgramDayResponseDTO>;

  deleteProgramDay(
    dayId: string,
    nutritionistId: string
  ): Promise<void>;
}