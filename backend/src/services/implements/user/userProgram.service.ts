import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserProgramService } from "../../interfaces/user/IUserProgramService";
import { IUserProgramRepository } from "../../../repositories/interfaces/user/IUserProgramRepository";
import { IProgramDayRepository } from "../../../repositories/interfaces/user/IProgramDayRepository";
import { Types } from "mongoose";
import { ProgramMapper } from "../../../mapper/user/program.mapper";
import { ProgramDayMapper } from "../../../mapper/user/programDay.mapper";
import {
  ProgramResponseDTO,
  ProgramDayResponseDTO,
} from "../../../dtos/user/userProgram.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";

@injectable()
export class UserProgramService implements IUserProgramService {
  constructor(
    @inject(TYPES.IUserProgramRepository)
    private _userProgramRepository: IUserProgramRepository,

    @inject(TYPES.IProgramDayRepository)
    private _programDayRepository: IProgramDayRepository,
  ) {}


  async getProgramDetails(
    programId: string,
    userId: string,
  ): Promise<ProgramResponseDTO> {
    logger.debug("Fetching program details for programId: %s", programId);

    const program =
      await this._userProgramRepository.findByIdPopulated(programId);

    if (!program) {
      logger.error("Program not found for programId: %s", programId);
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    console.log("userId: ", userId);
    console.log("userId program: ", program.userId.toString());
    const programUserId = program.userId._id.toString();
    console.log("userId program:", programUserId);
    if (programUserId !== userId) {
      logger.warn(
        "Unauthorized access attempt on programId: %s by userId: %s",
        programId,
        userId,
      );
      throw new CustomError("Unauthorized access", StatusCode.FORBIDDEN);
    }
    logger.info("Program details retrieved for programId: %s", programId);
    return ProgramMapper.toResponseDTO(program);
  }

  async getProgramDays(
    programId: string,
    userId: string,
  ): Promise<ProgramDayResponseDTO[]> {
    logger.debug("Fetching all days for programId: %s", programId);

    await this.getProgramDetails(programId, userId);
    console.log(programId);
    

    const days = await this._programDayRepository.findByUserProgram(
      new Types.ObjectId(programId),
    );
    console.log(days);
    

    logger.info("Found %d days for programId: %s", days.length, programId);
    return ProgramDayMapper.toResponseDTOList(days);
  }

  async getProgramDayByNumber(
    dayNumber: number,
    programId: string,
  ): Promise<ProgramDayResponseDTO> {
    const programIdO = new Types.ObjectId(programId);

    const day = await this._programDayRepository.findByDay(
      programIdO,
      dayNumber,
    );

    if (!day) {
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    logger.info("Program day details retrieved for dayId: %s", day._id);
    return ProgramDayMapper.toResponseDTO(day);
  }
}
