import { inject, injectable } from "inversify";
import { INutriSessionService } from "../../interfaces/nutritionist/INutriSessionService";
import { INutriSessionRepository } from "../../../repositories/interfaces/nutritionist/INutriSessionRepository";
import { GetNutriSessionsQueryDTO } from "../../../dtos/nutritionist/session/session-list-query.dto";
import { CreateNutriSessionDTO } from "../../../dtos/nutritionist/session/create-session.dto";
import { UpdateNutriSessionDTO } from "../../../dtos/nutritionist/session/update-session.dto";
import { NutriSessionListResponseDTO } from "../../../dtos/nutritionist/session/session-list-response.dto";
import { NutriSessionDetailsResponseDTO } from "../../../dtos/nutritionist/session/session-details-response.dto";
import { v4 as uuidv4 } from "uuid";
import { NutriSessionMapper } from "../../../mappers/nutritionist/session/nutri-session.mapper";
import { NutriSessionPersistenceMapper } from "../../../mappers/nutritionist/session/nutri-session.persistence.mapper";
import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { uploadToCloudinary } from "../../../utils/cloudinaryUploads.util";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

@injectable()
export class NutriSessionService implements INutriSessionService {
  constructor(
    @inject(TYPES.INutriSessionRepository)
    private readonly _nutriSessionRepository: INutriSessionRepository,
  ) {}

  async getSessions(
    nutritionistId: string,
    query: GetNutriSessionsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriSessionListResponseDTO>> {
    const result = await this._nutriSessionRepository.findSessions(
      nutritionistId,
      query,
    );
    const items: NutriSessionListResponseDTO[] = result.items.map((item) =>
      NutriSessionMapper.toListResponse(item),
    );
    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getSessionDetails(
    sessionId: string,
    nutritionistId: string,
  ): Promise<NutriSessionDetailsResponseDTO> {
    const session = await this._nutriSessionRepository.findSessionDetails(
      sessionId,
      nutritionistId,
    );
    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }
    return NutriSessionMapper.toDetailsResponse(session);
  }

  async createSession(
    nutritionistId: string,
    dto: CreateNutriSessionDTO,
    thumbnail?: Express.Multer.File,
  ): Promise<void> {
    const validatedDto = await validateDto(CreateNutriSessionDTO, dto);
    let thumbnailUrl: string | undefined;
    if (thumbnail) {
      const uploadRes = await uploadToCloudinary(
        thumbnail,
        "nutriwise/sessions",
      );
      thumbnailUrl = uploadRes.secureUrl;
    }
    const roomId = `session_${uuidv4()}`;
    await this._nutriSessionRepository.create(
      NutriSessionPersistenceMapper.toCreateModel(
        nutritionistId,
        validatedDto,
        thumbnailUrl,
        roomId,
      ),
    );
  }

  async updateSession(
    sessionId: string,
    nutritionistId: string,
    dto: UpdateNutriSessionDTO,
    thumbnail?: Express.Multer.File,
  ): Promise<void> {
    const validatedDto = await validateDto(UpdateNutriSessionDTO, dto);
    const updateData: UpdateNutriSessionDTO & {
      thumbnailUrl?: string;
    } = {
      ...validatedDto,
    };
    if (thumbnail) {
      const uploadRes = await uploadToCloudinary(
        thumbnail,
        "nutriwise/sessions",
      );
      updateData.thumbnailUrl = uploadRes.secureUrl;
    }
    const session = await this._nutriSessionRepository.updateOne(
      {
        _id: sessionId,
        nutritionistId,
      },
      {
        $set: updateData,
      },
    );
    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }
  }

  async deleteSession(
    sessionId: string,
    nutritionistId: string,
  ): Promise<void> {
    const deleted = await this._nutriSessionRepository.deleteOne({
      _id: sessionId,
      nutritionistId,
    });
    if (!deleted) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }
  }

  async publishSession(
    sessionId: string,
    nutritionistId: string,
  ): Promise<void> {
    const session = await this._nutriSessionRepository.findById(sessionId);
    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }
    if (session.nutritionistId.toString() !== nutritionistId) {
      throw new CustomError(
        "You are not authorized to publish this session",
        StatusCode.FORBIDDEN,
      );
    }
    if (session.status !== "draft") {
      throw new CustomError(
        "Only draft sessions can be published",
        StatusCode.BAD_REQUEST,
      );
    }
    if (session.scheduledAt <= new Date()) {
      throw new CustomError(
        "Session scheduled time must be in the future",
        StatusCode.BAD_REQUEST,
      );
    }
    const updatedSession = await this._nutriSessionRepository.updateById(
      sessionId,
      {
        $set: { status: "scheduled" },
      },
    );

    if (!updatedSession) {
      throw new CustomError(
        "Failed to publish session",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
