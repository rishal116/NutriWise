
import {
  CreateClientProfileDTO,
  UpdateClientProfileDTO,
  UpdateProfileCompletionDTO,
  ClientProfileResponseDTO,
} from "../../../dtos/user/clientProfile.dto";

export interface IClientProfileService {
  getMyProfile(userId: string): Promise<ClientProfileResponseDTO | null>;

  createProfile(
    userId: string,
    payload: CreateClientProfileDTO,
  ): Promise<ClientProfileResponseDTO>;

  updateProfile(
    userId: string,
    payload: UpdateClientProfileDTO,
  ): Promise<ClientProfileResponseDTO>;

  updateProfileCompletion(
    userId: string,
    payload: UpdateProfileCompletionDTO,
  ): Promise<ClientProfileResponseDTO>;

  deleteProfile(userId: string): Promise<void>;
}