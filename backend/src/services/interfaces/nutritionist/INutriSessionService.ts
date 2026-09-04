import { GetNutriSessionsQueryDTO } from "../../../dtos/nutritionist/session/session-list-query.dto";
import { CreateNutriSessionDTO } from "../../../dtos/nutritionist/session/create-session.dto";
import { UpdateNutriSessionDTO } from "../../../dtos/nutritionist/session/update-session.dto";
import { NutriSessionListResponseDTO } from "../../../dtos/nutritionist/session/session-list-response.dto";
import { NutriSessionDetailsResponseDTO } from "../../../dtos/nutritionist/session/session-details-response.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface INutriSessionService {
  createSession(
    nutritionistId: string,
    dto: CreateNutriSessionDTO,
    thumbnail?: Express.Multer.File,
  ): Promise<NutriSessionDetailsResponseDTO>;

  getSessions(
    nutritionistId: string,
    query: GetNutriSessionsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriSessionListResponseDTO>>;

  getSessionDetails(
    sessionId: string,
    nutritionistId: string,
  ): Promise<NutriSessionDetailsResponseDTO>;

  updateSession(
    sessionId: string,
    dto: UpdateNutriSessionDTO,
    thumbnail?: Express.Multer.File,
  ): Promise<NutriSessionDetailsResponseDTO>;

  deleteSession(sessionId: string): Promise<void>;

  publishSession(
    sessionId: string,
    nutritionistId: string,
  ): Promise<NutriSessionDetailsResponseDTO>;
}
