import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutriProgramService } from "../../interfaces/nutritionist/INutriProgramService";
import { IUserProgramRepository } from "../../../repositories/interfaces/user/IUserProgramRepository";
import { IProgramDayRepository } from "../../../repositories/interfaces/user/IProgramDayRepository";
import { Types } from "mongoose";
import { ProgramMapper } from "../../../mapper/nutritionist/program.mapper";
import { ProgramDayMapper } from "../../../mapper/nutritionist/programDay.mapper";
import {
  CreateProgramDTO,
  ProgramResponseDTO,
  ProgramDayResponseDTO,
  CreateProgramDayDTO,
  UpdateProgramDayDTO,
} from "../../../dtos/nutritionist/programResponse.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";

@injectable()
export class NutriProgramService implements INutriProgramService {
  constructor(
    @inject(TYPES.IUserProgramRepository)
    private _nutriProgramRepository: IUserProgramRepository,

    @inject(TYPES.IProgramDayRepository)
    private _programDayRepository: IProgramDayRepository,
  ) {}

  async getPrograms(nutritionistId: string): Promise<ProgramResponseDTO[]> {
    logger.debug("Fetching programs for nutritionistId: %s", nutritionistId);

    const programs = await this._nutriProgramRepository.findByNutritionist(
      new Types.ObjectId(nutritionistId),
    );

    logger.info(
      "Found %d programs for nutritionistId: %s",
      programs.length,
      nutritionistId,
    );
    return ProgramMapper.toResponseDTOList(programs);
  }

  async getProgramDetails(
    programId: string,
    nutritionistId: string,
  ): Promise<ProgramResponseDTO> {
    logger.debug("Fetching program details for programId: %s", programId);

    const program =
      await this._nutriProgramRepository.findByIdPopulated(programId);

    if (!program) {
      logger.error("Program not found for programId: %s", programId);
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    const programUserId = program.nutritionistId._id.toString();
    console.log("userId program:", programUserId);
    if (programUserId !== nutritionistId) {
      logger.warn(
        "Unauthorized access attempt on programId: %s by nutritionistId: %s",
        programId,
        nutritionistId,
      );
      throw new CustomError("Unauthorized access", StatusCode.FORBIDDEN);
    }

    logger.info("Program details retrieved for programId: %s", programId);
    return ProgramMapper.toResponseDTO(program);
  }

  async createProgram(data: CreateProgramDTO): Promise<ProgramResponseDTO> {
    logger.debug("Creating new program with data: %o", data);

    const created = await this._nutriProgramRepository.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
      planId: new Types.ObjectId(data.planId),
      userPlanId: new Types.ObjectId(data.userPlanId),
      nutritionistId: new Types.ObjectId(data.nutritionistId),
    });

    const programId = created._id.toString();
    const populated =
      await this._nutriProgramRepository.findByIdPopulated(programId);

    if (!populated) {
      logger.error(
        "Program created but population failed for programId: %s",
        programId,
      );
      throw new CustomError(
        "Program created but population failed",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Program successfully created with programId: %s", programId);
    return ProgramMapper.toResponseDTO(populated);
  }

  async getProgramDays(
    programId: string,
    nutritionistId: string,
  ): Promise<ProgramDayResponseDTO[]> {
    logger.debug("Fetching all days for programId: %s", programId);
    await this.getProgramDetails(programId, nutritionistId);

    const days = await this._programDayRepository.findByUserProgram(
      new Types.ObjectId(programId),
    );

    logger.info("Found %d days for programId: %s", days.length, programId);
    return ProgramDayMapper.toResponseDTOList(days);
  }

  async getProgramDayDetails(
    dayId: string,
    nutritionistId: string,
  ): Promise<ProgramDayResponseDTO> {
    logger.debug("Fetching details for dayId: %s", { dayId });

    const day = await this._programDayRepository.findById(dayId);
    if (!day) {
      logger.error("Program day not found for dayId: %s", dayId);
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    await this.getProgramDetails(day.userProgramId.toString(), nutritionistId);
    logger.info("Program day details retrieved for dayId: %s", dayId);
    return ProgramDayMapper.toResponseDTO(day);
  }

 async createProgramDay(
  data: CreateProgramDayDTO,
  nutritionistId: string,
): Promise<ProgramDayResponseDTO> {
  logger.debug("Creating program day with data: %o", { data });

  /* =========================
     1. Validate Program Ownership
  ========================= */
  const program = await this.getProgramDetails(
    data.userProgramId,
    nutritionistId
  );

  /* =========================
     2. Validate Day Number
  ========================= */
  if (data.dayNumber < 1 || data.dayNumber > program.durationDays) {
    throw new CustomError(
      `Day must be between 1 and ${program.durationDays}`,
      StatusCode.BAD_REQUEST
    );
  }

  /* =========================
     3. Validate Meals (no duplicates)
  ========================= */
  if (data.meals?.length) {
    const mealTypes = data.meals.map((m) => m.mealType);
    if (new Set(mealTypes).size !== mealTypes.length) {
      throw new CustomError(
        "Duplicate meal types are not allowed",
        StatusCode.BAD_REQUEST
      );
    }
  }

  /* =========================
     4. Prepare Data
  ========================= */
  const payload = {
    ...data,
    userProgramId: new Types.ObjectId(data.userProgramId),
  };

  try {
    /* =========================
       5. Create (rely on DB unique index)
    ========================= */
    const created = await this._programDayRepository.create(payload);

    logger.info(
      "Program day created: day %d for program %s",
      created.dayNumber,
      data.userProgramId
    );

    return ProgramDayMapper.toResponseDTO(created);

  } catch (error: any) {
    /* =========================
       6. Handle Duplicate (race condition safe)
    ========================= */
    if (error.code === 11000) {
      throw new CustomError(
        `Day ${data.dayNumber} already exists`,
        StatusCode.BAD_REQUEST
      );
    }

    logger.error("Error creating program day: %o", error);
    throw new CustomError(
      "Failed to create program day",
      StatusCode.INTERNAL_SERVER_ERROR
    );
  }
}

  async updateProgramDay(
    dayId: string,
    data: UpdateProgramDayDTO,
    nutritionistId: string,
  ): Promise<ProgramDayResponseDTO> {
    logger.debug("Updating program dayId: %s with data: %o", dayId, data);
    await this.getProgramDayDetails(dayId, nutritionistId);

    const updated = await this._programDayRepository.updateById(dayId, data);

    if (!updated) {
      logger.error(
        "Failed to update, program day not found for dayId: %s",
        dayId,
      );
      throw new CustomError("Program day not found", StatusCode.NOT_FOUND);
    }

    logger.info("Program day updated successfully for dayId: %s", dayId);
    return ProgramDayMapper.toResponseDTO(updated);
  }

  async deleteProgramDay(dayId: string, nutritionistId: string): Promise<void> {
    logger.debug("Deleting program dayId: %s", dayId);
    await this.getProgramDayDetails(dayId, nutritionistId);

    await this._programDayRepository.deleteOne(new Types.ObjectId(dayId));
    logger.info("Program day deleted successfully for dayId: %s", dayId);
  }
}
