import type { GetNutriSessionsQueryDTO } from "../../../dtos/nutritionist/session/session-list-query.dto";
import type { CreateNutriSessionDTO } from "../../../dtos/nutritionist/session/create-session.dto";
import type { UpdateNutriSessionDTO } from "../../../dtos/nutritionist/session/update-session.dto";
import type { NutriSessionListResponseDTO } from "../../../dtos/nutritionist/session/session-list-response.dto";
import type { NutriSessionDetailsResponseDTO } from "../../../dtos/nutritionist/session/session-details-response.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface INutriSessionService {
  getSessions(
    nutritionistId: string,
    query: GetNutriSessionsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriSessionListResponseDTO>>;

  getSessionDetails(
    sessionId: string,
    nutritionistId: string,
  ): Promise<NutriSessionDetailsResponseDTO>;

  createSession(
    nutritionistId: string,
    dto: CreateNutriSessionDTO,
    thumbnail?: Express.Multer.File,
  ): Promise<void>;

  updateSession(
    sessionId: string,
    nutritionistId: string,
    dto: UpdateNutriSessionDTO,
    thumbnail?: Express.Multer.File,
  ): Promise<void>;

  deleteSession(sessionId: string, nutritionistId: string): Promise<void>;

  publishSession(sessionId: string, nutritionistId: string): Promise<void>;
}
