import { injectable, inject } from "inversify";

import { IClientProfileService } from "../../interfaces/user/IClientProfileService";
import { IClientProfileRepository } from "../../../repositories/interfaces/user/IClientProfileRepository";
import { IHealthProgressRepository } from "../../../repositories/interfaces/user/IHealthProgressRepository";

import { TYPES } from "../../../types/types";

import {
  CreateClientProfileDTO,
  UpdateClientProfileDTO,
  UpdateProfileCompletionDTO,
  ClientProfileResponseDTO,
} from "../../../dtos/user/clientProfile.dto";

import { ClientProfileMapper } from "../../../mapper/user/clientProfile.mapper";
import { ClientProfileValidator } from "../../../validations/user/clientProfile.validator";

import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";

import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class ClientProfileService implements IClientProfileService {
  constructor(
    @inject(TYPES.IClientProfileRepository)
    private _clientProfileRepository: IClientProfileRepository,

    @inject(TYPES.IHealthProgressRepository)
    private _healthProgressRepository: IHealthProgressRepository,
  ) {}


  async getMyProfile(
    userId: string,
  ): Promise<ClientProfileResponseDTO | null> {
    logger.info("Fetching client profile", { userId });

    if (!userId) {
      throw new CustomError("User ID is required", StatusCode.BAD_REQUEST);
    }

    try {
      const profile = await this._clientProfileRepository.findByUserId(userId);

      if (!profile) {
        logger.warn("Client profile not found", { userId });
        return null;
      }

      return ClientProfileMapper.toResponse(profile);
    } catch (error) {
      logger.error("Error fetching client profile", {
        userId,
        err: error,
      });

      if (error instanceof CustomError) throw error;

      throw new CustomError(
        "Failed to fetch client profile",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createProfile(
    userId: string,
    payload: CreateClientProfileDTO,
  ): Promise<ClientProfileResponseDTO> {
    logger.info("Creating client profile", { userId });

    try {
      ClientProfileValidator.validateCreate(userId, payload);

      const bmi = ClientProfileValidator.calculateBMI(
        payload.heightCm,
        payload.weightKg,
      );

      const profileCompletionPercentage =
        ClientProfileValidator.calculateProfileCompletion(payload);

      const persistenceData = ClientProfileMapper.toEntity(
        userId,
        payload,
        bmi,
        profileCompletionPercentage,
      );

      const createdProfile =
        await this._clientProfileRepository.createProfile(persistenceData);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await this._healthProgressRepository.upsertDailyProgress({
        userId,
        date: today,
        weightKg: payload.weightKg,
        bmi,
        dailyWaterIntakeLiters: payload.dailyWaterIntakeLiters,
        sleepDurationHours: payload.sleepDurationHours,
      });

      logger.info("Client profile created successfully", { userId });

      return ClientProfileMapper.toResponse(createdProfile);
    } catch (error) {
      logger.error("Error creating client profile", {
        userId,
        payload,
        err: error,
      });

      if (error instanceof CustomError) throw error;

      throw new CustomError(
        "Failed to create client profile",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(
    userId: string,
    payload: UpdateClientProfileDTO,
  ): Promise<ClientProfileResponseDTO> {
    logger.info("Updating client profile", { userId });

    try {
      ClientProfileValidator.validateUpdate(userId, payload);

      const existingProfile =
        await this._clientProfileRepository.findByUserId(userId);

      if (!existingProfile) {
        throw new CustomError(
          "Client profile not found",
          StatusCode.NOT_FOUND,
        );
      }

      const updatedData = {
        ...existingProfile.toObject(),
        ...payload,
      };

      const bmi = ClientProfileValidator.calculateBMI(
        updatedData.heightCm,
        updatedData.weightKg,
      );

      const profileCompletionPercentage =
        ClientProfileValidator.calculateProfileCompletion(updatedData);

      const persistenceData = ClientProfileMapper.toUpdateEntity(
        payload,
        bmi,
        profileCompletionPercentage,
      );

      const updatedProfile =
        await this._clientProfileRepository.updateByUserId(
          userId,
          persistenceData,
        );

      logger.info("Client profile updated successfully", { userId });

      return ClientProfileMapper.toResponse(updatedProfile);
    } catch (error) {
      logger.error("Error updating client profile", {
        userId,
        payload,
        err: error,
      });

      if (error instanceof CustomError) throw error;

      throw new CustomError(
        "Failed to update client profile",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfileCompletion(
    userId: string,
    payload: UpdateProfileCompletionDTO,
  ): Promise<ClientProfileResponseDTO> {
    logger.info("Updating client profile completion", { userId });

    try {
      const updatedProfile =
        await this._clientProfileRepository.updateByUserId(userId, payload);

      if (!updatedProfile) {
        throw new CustomError(
          "Client profile not found",
          StatusCode.NOT_FOUND,
        );
      }

      logger.info("Client profile completion updated successfully", {
        userId,
      });

      return ClientProfileMapper.toResponse(updatedProfile);
    } catch (error) {
      logger.error("Error updating client profile completion", {
        userId,
        payload,
        err: error,
      });

      if (error instanceof CustomError) throw error;

      throw new CustomError(
        "Failed to update profile completion",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProfile(userId: string): Promise<void> {
    logger.info("Deleting client profile", { userId });

    try {
      const deleted =
        await this._clientProfileRepository.deleteByUserId(userId);

      if (!deleted) {
        throw new CustomError(
          "Client profile not found",
          StatusCode.NOT_FOUND,
        );
      }

      logger.info("Client profile deleted successfully", { userId });
    } catch (error) {
      logger.error("Error deleting client profile", {
        userId,
        err: error,
      });

      if (error instanceof CustomError) throw error;

      throw new CustomError(
        "Failed to delete client profile",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}