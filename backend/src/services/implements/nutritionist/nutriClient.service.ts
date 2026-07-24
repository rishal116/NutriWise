import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";

import { INutriClientService } from "../../interfaces/nutritionist/INutriClientService";
import { INutriClientRepository } from "../../../repositories/interfaces/nutritionist/INutriClientRepository";

import {
  GetClientsQueryDTO,
  GetClientParamsDTO,
} from "../../../dtos/nutritionist/client/client-request.dto";

import {
  ClientListResponseDTO,
  ClientDetailsResponseDTO,
} from "../../../dtos/nutritionist/client/client-response.dto";

import { NutriClientMapper } from "../../../mapper/nutritionist/client/nutriClient.mapper";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";

@injectable()
export class NutriClientService implements INutriClientService {
  constructor(
    @inject(TYPES.INutriClientRepository)
    private readonly _nutriClientRepository: INutriClientRepository,
  ) {}

  async getClients(
    nutritionistId: string,
    query: GetClientsQueryDTO,
  ): Promise<ClientListResponseDTO> {
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

    return NutriClientMapper.toClientListResponseDTO(result);
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

    return NutriClientMapper.toClientDetailsResponseDTO(result);
  }
}
