import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../../types/types";
import type { INutriProgramService } from "../../../interfaces/nutritionist/INutriProgramService";
import type { INutriProgramRepository } from "../../../../repositories/interfaces/nutritionist/INutriProgramRepository";
import {
  GetProgramsQueryDTO,
  GetProgramParamsDTO,
} from "../../../../dtos/nutritionist/program/nutri-program-request.dto";
import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import logger from "../../../../utils/logger";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { NutriProgramCardResponseDTO } from "../../../../dtos/nutritionist/program/nutri-program-card-response.dto";
import { NutriProgramDetailsResponseDTO } from "../../../../dtos/nutritionist/program/nutri-program-details-response.dto";
import { NutriProgramCardMapper } from "../../../../mappers/nutritionist/program/nutri-program-card.mapper";
import { NutriProgramDetailsMapper } from "../../../../mappers/nutritionist/program/program-details.mapper";
import { toObjectId } from "../../../../utils/object-id.util";
import { INotificationService } from "../../../interfaces/common/INotificationService";
import { CreateNotificationDTO } from "../../../../dtos/notification/create-notification.dto";
import { CancelNutriProgramDTO } from "../../../../dtos/nutritionist/program/cancel-nutri-program.dto";

@injectable()
export class NutriProgramService implements INutriProgramService {
  constructor(
    @inject(TYPES.INutriProgramRepository)
    private readonly _programRepository: INutriProgramRepository,

    @inject(TYPES.INotificationService)
    private readonly _notificationService: INotificationService,
  ) {}

  async getPrograms(
    nutritionistId: string,
    query: GetProgramsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriProgramCardResponseDTO>> {
    const nutritionistObjectId = toObjectId(nutritionistId, "Nutritionist ID");

    const queryDto = await validateDto(GetProgramsQueryDTO, query);

    logger.info("Fetching nutritionist programs", {
      nutritionistId,
    });

    const result = await this._programRepository.findPrograms(
      nutritionistObjectId,
      queryDto,
    );

    logger.info("Nutritionist programs fetched successfully", {
      nutritionistId,
      count: result.items.length,
    });

    return new InfiniteScrollResponseDTO(
      result.items.map((item) => NutriProgramCardMapper.toDTO(item)),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getProgramDetails(
    nutritionistId: string,
    params: GetProgramParamsDTO,
  ): Promise<NutriProgramDetailsResponseDTO> {
    if (!Types.ObjectId.isValid(nutritionistId)) {
      throw new CustomError("Invalid nutritionist ID", StatusCode.BAD_REQUEST);
    }

    const paramsDto = await validateDto(GetProgramParamsDTO, params);

    logger.info("Fetching program details", {
      nutritionistId,
      programId: paramsDto.programId,
    });

    const program = await this._programRepository.findProgramById(
      paramsDto.programId,
      nutritionistId,
    );

    if (!program) {
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    logger.info("Program details fetched successfully", {
      nutritionistId,
      programId: paramsDto.programId,
    });

    return NutriProgramDetailsMapper.toDTO(program);
  }

  async markProgramAsReady(
    nutritionistId: string,
    params: GetProgramParamsDTO,
  ): Promise<void> {
    const nutritionistObjectId = toObjectId(nutritionistId, "Nutritionist ID");

    const paramsDto = await validateDto(GetProgramParamsDTO, params);

    const programObjectId = toObjectId(paramsDto.programId, "Program ID");

    logger.info("Marking nutritionist program as ready", {
      nutritionistId,
      programId: paramsDto.programId,
    });

    const program = await this._programRepository.findOne({
      _id: programObjectId,
      nutritionistId: nutritionistObjectId,
    });

    if (!program) {
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    if (program.status !== "preparing") {
      throw new CustomError(
        `Cannot mark program as ready from ${program.status} status.`,
        StatusCode.BAD_REQUEST,
      );
    }

    const now = new Date();

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + 1);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + program.durationDays);

    const updatedCount = await this._programRepository.updateOne(
      {
        _id: programObjectId,
        nutritionistId: nutritionistObjectId,
        status: "preparing",
      },
      {
        $set: {
          status: "ready",
          startDate,
          endDate,
        },
      },
    );

    if (updatedCount === 0) {
      throw new CustomError(
        "Program status has changed. Please refresh and try again.",
        StatusCode.CONFLICT,
      );
    }

    logger.info("Nutritionist program marked as ready successfully", {
      nutritionistId,
      programId: paramsDto.programId,
      startDate,
      endDate,
      durationDays: program.durationDays,
    });

    const formattedStartDate = startDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const notification: CreateNotificationDTO = {
      recipientId: program.userId,
      senderId: nutritionistObjectId,
      type: "success",
      title: "Your program is ready!",
      message: `Your nutritionist has finished preparing your program. Your program will start tomorrow, on ${formattedStartDate}.`,
      data: {
        programId: paramsDto.programId,
        startDate,
        endDate,
      },
    };

    try {
      await this._notificationService.createNotification(notification);

      logger.info("Program ready notification created successfully", {
        recipientId: program.userId.toString(),
        nutritionistId,
        programId: paramsDto.programId,
      });
    } catch (error) {
      logger.warn("Failed to create program ready notification", {
        recipientId: program.userId.toString(),
        nutritionistId,
        programId: paramsDto.programId,
        error,
      });
    }
  }

  async cancelProgram(
    nutritionistId: string,
    params: GetProgramParamsDTO,
    body: CancelNutriProgramDTO,
  ): Promise<void> {
    const nutritionistObjectId = toObjectId(nutritionistId, "Nutritionist ID");

    const paramsDto = await validateDto(GetProgramParamsDTO, params);
    const bodyDto = await validateDto(CancelNutriProgramDTO, body);

    const programObjectId = toObjectId(paramsDto.programId, "Program ID");
    const cancellationReason = bodyDto.cancellationReason.trim();

    if (!cancellationReason) {
      throw new CustomError(
        "Cancellation reason is required.",
        StatusCode.BAD_REQUEST,
      );
    }

    logger.info("Cancelling nutritionist program", {
      nutritionistId,
      programId: paramsDto.programId,
    });

    const program = await this._programRepository.findOne({
      _id: programObjectId,
      nutritionistId: nutritionistObjectId,
    });

    if (!program) {
      throw new CustomError("Program not found", StatusCode.NOT_FOUND);
    }

    const cancellableStatuses = [
      "preparing",
      "ready",
      "active",
      "paused",
    ] as const;

    if (
      !cancellableStatuses.includes(
        program.status as (typeof cancellableStatuses)[number],
      )
    ) {
      throw new CustomError(
        `Cannot cancel program from ${program.status} status.`,
        StatusCode.BAD_REQUEST,
      );
    }

    const now = new Date();

    const updatedCount = await this._programRepository.updateOne(
      {
        _id: programObjectId,
        nutritionistId: nutritionistObjectId,
        status: program.status,
      },
      {
        $set: {
          status: "cancelled",
          "lifecycle.cancelledAt": now,
          cancellationReason,
          cancelledBy: nutritionistObjectId,
        },
      },
    );

    if (updatedCount === 0) {
      throw new CustomError(
        "Program status has changed. Please refresh and try again.",
        StatusCode.CONFLICT,
      );
    }

    logger.info("Nutritionist program cancelled successfully", {
      nutritionistId,
      programId: paramsDto.programId,
      previousStatus: program.status,
    });

    const userNotification: CreateNotificationDTO = {
      recipientId: program.userId,
      senderId: nutritionistObjectId,
      type: "warning",
      title: "Your program has been cancelled",
      message: `Your nutritionist has cancelled your program. Reason: ${cancellationReason}`,
      data: {
        programId: paramsDto.programId,
        cancellationReason,
      },
    };

    const notificationTasks: Promise<void>[] = [
      this.sendCancellationNotification(
        userNotification,
        "user",
        program.userId.toString(),
        paramsDto.programId,
      ),
    ];

    const adminId = process.env.ADMIN_ID;

    if (adminId) {
      const adminObjectId = toObjectId(adminId, "Admin ID");

      const adminNotification: CreateNotificationDTO = {
        recipientId: adminObjectId,
        senderId: nutritionistObjectId,
        type: "warning",
        title: "Program cancellation reported",
        message: `A nutritionist has cancelled a program. Reason: ${cancellationReason}`,
        data: {
          programId: paramsDto.programId,
          userId: program.userId,
          nutritionistId: nutritionistObjectId,
          cancellationReason,
        },
      };

      notificationTasks.push(
        this.sendCancellationNotification(
          adminNotification,
          "admin",
          adminObjectId.toString(),
          paramsDto.programId,
        ),
      );
    } else {
      logger.warn("Admin notification skipped: ADMIN_ID is not configured", {
        programId: paramsDto.programId,
      });
    }

    await Promise.all(notificationTasks);
  }

  private async sendCancellationNotification(
    notification: CreateNotificationDTO,
    recipientType: "user" | "admin",
    recipientId: string,
    programId: string,
  ): Promise<void> {
    try {
      await this._notificationService.createNotification(notification);

      logger.info("Program cancellation notification created successfully", {
        recipientType,
        recipientId,
        programId,
      });
    } catch (error) {
      logger.warn("Failed to create program cancellation notification", {
        recipientType,
        recipientId,
        programId,
        error,
      });
    }
  }
}
