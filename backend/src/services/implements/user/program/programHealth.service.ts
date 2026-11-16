import { inject, injectable } from "inversify";
import { TYPES } from "../../../../types/types";
import { CreateProgramHealthDTO } from "../../../../dtos/user/program-health/create-program-health.dto";
import { UpdateProgramHealthDTO } from "../../../../dtos/user/program-health/update-program-health.dto";
import type { IProgramHealthResponseDTO } from "../../../../dtos/user/program-health/program-health-response.dto";
import type { IProgramHealthRepository } from "../../../../repositories/interfaces/user/program/IProgramHealthRepository";
import type { IProgramHealthService } from "../../../interfaces/user/program/IProgramHealthService";
import type { IUserProgramRepository } from "../../../../repositories/interfaces/user/program/IUserProgramRepository";
import { ProgramHealthMapper } from "../../../../mappers/user/program-health/program-health.mapper";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { CustomError } from "../../../../utils/customError";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { toObjectId } from "../../../../utils/object-id.util";
import logger from "../../../../utils/logger";

@injectable()
export class ProgramHealthService implements IProgramHealthService {
  constructor(
    @inject(TYPES.IProgramHealthRepository)
    private readonly _programHealthRepository: IProgramHealthRepository,

    @inject(TYPES.IUserProgramRepository)
    private readonly _userProgramRepository: IUserProgramRepository,
  ) {}

  async createProgramHealth(
    userId: string,
    userProgramId: string,
    dto: CreateProgramHealthDTO,
  ): Promise<void> {
    const userObjectId = toObjectId(userId, "user ID");
    const userProgramObjectId = toObjectId(userProgramId, "program ID");

    const validatedDto = await validateDto(CreateProgramHealthDTO, dto);

    logger.info("Creating program health information", {
      userId,
      userProgramId,
    });

    const userProgram = await this._userProgramRepository.findOne({
      _id: userProgramObjectId,
      userId: userObjectId,
    });

    if (!userProgram) {
      throw new CustomError("Program not found.", StatusCode.NOT_FOUND);
    }

    const existingSubmission =
      await this._programHealthRepository.findByUserProgramId(
        userProgramObjectId.toString(),
      );

    if (existingSubmission) {
      throw new CustomError(
        "Health information has already been submitted for this program.",
        StatusCode.CONFLICT,
      );
    }

    const createdProgramHealth = await this._programHealthRepository.create({
      ...validatedDto,
      userId: userObjectId,
      userProgramId: userProgramObjectId,
    });

    if (!createdProgramHealth) {
      throw new CustomError(
        "Failed to create program health information.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Program health information created successfully", {
      userId,
      userProgramId,
    });
  }

  async getProgramHealth(
    userId: string,
    userProgramId: string,
  ): Promise<IProgramHealthResponseDTO | null> {
    const userObjectId = toObjectId(userId, "user ID");
    const userProgramObjectId = toObjectId(userProgramId, "program ID");

    logger.info("Fetching program health information", {
      userId,
      userProgramId,
    });

    const userProgram = await this._userProgramRepository.findOne({
      _id: userProgramObjectId,
      userId: userObjectId,
    });

    if (!userProgram) {
      throw new CustomError("Program not found.", StatusCode.NOT_FOUND);
    }

    const programHealth =
      await this._programHealthRepository.findByUserAndProgram(
        userObjectId.toString(),
        userProgramObjectId.toString(),
      );

    if (!programHealth) {
      return null;
    }

    return ProgramHealthMapper.toResponse(programHealth);
  }

  async updateProgramHealth(
    userId: string,
    userProgramId: string,
    dto: UpdateProgramHealthDTO,
  ): Promise<void> {
    const userObjectId = toObjectId(userId, "user ID");
    const userProgramObjectId = toObjectId(userProgramId, "program ID");

    const validatedDto = await validateDto(UpdateProgramHealthDTO, dto);

    if (Object.keys(validatedDto).length === 0) {
      throw new CustomError(
        "Please provide at least one field to update.",
        StatusCode.BAD_REQUEST,
      );
    }

    logger.info("Updating program health information", {
      userId,
      userProgramId,
    });

    const userProgram = await this._userProgramRepository.findOne({
      _id: userProgramObjectId,
      userId: userObjectId,
    });

    if (!userProgram) {
      throw new CustomError("Program not found.", StatusCode.NOT_FOUND);
    }

    const existingSubmission =
      await this._programHealthRepository.findByUserAndProgram(
        userObjectId.toString(),
        userProgramObjectId.toString(),
      );

    if (!existingSubmission) {
      throw new CustomError(
        "Program health information not found.",
        StatusCode.NOT_FOUND,
      );
    }

    const updatedProgramHealth = await this._programHealthRepository.updateById(
      existingSubmission._id,
      {
        $set: validatedDto,
      },
    );

    if (!updatedProgramHealth) {
      throw new CustomError(
        "Failed to update program health information.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Program health information updated successfully", {
      userId,
      userProgramId,
    });
  }
}
