import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { INutriClientService } from "../../interfaces/nutritionist/INutriClientService";
import { INutriClientRepository } from "../../../repositories/interfaces/nutritionist/INutriClientRepository";
import {
  GetClientsQueryDTO,
  GetClientParamsDTO,
} from "../../../dtos/nutritionist/client/client-request.dto";
import {
  ClientListItemDTO,
  ClientDetailsResponseDTO,
  MeetingClientOptionDTO,
} from "../../../dtos/nutritionist/client/client-response.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { NutriClientListMapper } from "../../../mappers/nutritionist/client/nutri-client-list.mapper";
import { NutriClientDetailsMapper } from "../../../mappers/nutritionist/client/nutri-client-details.mapper";
import { MeetingClientOptionMapper } from "../../../mappers/nutritionist/client/meeting-client-option.mapper";

@injectable()
export class NutriClientService implements INutriClientService {
  constructor(
    @inject(TYPES.INutriClientRepository)
    private readonly _nutriClientRepository: INutriClientRepository,
  ) {}

  async getClients(
    nutritionistId: string,
    query: GetClientsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<ClientListItemDTO>> {
    logger.debug(
      "Fetching nutritionist clients. nutritionistId=%s",
      nutritionistId,
    );

    const validatedQuery = await validateDto(GetClientsQueryDTO, query);

    const result = await this._nutriClientRepository.findClients(
      nutritionistId,
      validatedQuery,
    );

    logger.info(
      "Fetched %d clients for nutritionistId=%s",
      result.items.length,
      nutritionistId,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map((item) =>
        NutriClientListMapper.toClientListItemDTO(item),
      ),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getClientDetails(
    nutritionistId: string,
    params: GetClientParamsDTO,
  ): Promise<ClientDetailsResponseDTO> {
    logger.debug(
      "Fetching client details. nutritionistId=%s clientId=%s",
      nutritionistId,
      params.clientId,
    );

    const result = await this._nutriClientRepository.findClientDetails(
      params.clientId,
      nutritionistId,
    );

    if (!result) {
      logger.warn(
        "Client not found. nutritionistId=%s clientId=%s",
        nutritionistId,
        params.clientId,
      );

      throw new CustomError("Client not found", StatusCode.NOT_FOUND);
    }

    logger.info("Client details retrieved. clientId=%s", params.clientId);

    return NutriClientDetailsMapper.toClientDetailsResponseDTO(result);
  }

  async getMeetingEligibleClients(
    nutritionistId: string,
  ): Promise<MeetingClientOptionDTO[]> {
    logger.debug(
      "Fetching meeting eligible clients. nutritionistId=%s",
      nutritionistId,
    );

    const clients =
      await this._nutriClientRepository.findMeetingEligibleClients(
        nutritionistId,
      );

    logger.info(
      "Fetched %d meeting eligible clients for nutritionistId=%s",
      clients.length,
      nutritionistId,
    );

    return MeetingClientOptionMapper.toDTOList(clients);
  }
}
