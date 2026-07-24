import {
  ClientDetailsResponseDTO,
  ClientHealthDetailsDTO,
  ClientListItemDTO,
  ClientListResponseDTO,
  ClientProgramSummaryDTO,
} from "../../../dtos/nutritionist/client/client-response.dto";

import {
  ClientBrowseResult,
  IClientListProjection,
} from "../../../types/nutriClientList.projection";

import { IClientDetailsProjection } from "../../../types/nutriClientDetails.projection";

export class NutriClientMapper {
  static toClientListItemDTO(
    projection: IClientListProjection,
  ): ClientListItemDTO {
    return {
      clientId: projection.clientId.toString(),
      userProgramId: projection.userProgramId.toString(),
      userPlanId: projection.userPlanId.toString(),
      planId: projection.planId.toString(),

      fullName: projection.fullName,
      username: projection.username,
      profileImage: projection.profileImage,

      planTitle: projection.planTitle,

      subscriptionStatus: projection.subscriptionStatus,
      programStatus: projection.programStatus,

      currentDay: projection.currentDay,
      durationDays: projection.durationDays,
      completionPercentage: projection.completionPercentage,

      startDate: projection.startDate,
      endDate: projection.endDate,
    };
  }

  static toClientListResponseDTO(
    result: ClientBrowseResult,
  ): ClientListResponseDTO {
    return {
      items: result.items.map((item) => this.toClientListItemDTO(item)),
      nextCursor: result.nextCursor,
      hasNextPage: result.hasMore,
    };
  }

  static toClientHealthDetailsDTO(
    projection: IClientDetailsProjection,
  ): ClientHealthDetailsDTO {
    return {
      heightCm: projection.health?.heightCm ?? 0,
      weightKg: projection.health?.weightKg ?? 0,
      activityLevel: projection.health?.activityLevel ?? "",
      dietType: projection.health?.dietType ?? "",
      goal: projection.health?.goal ?? "",
      targetWeightKg: projection.health?.targetWeightKg,
      preferredTimeline: projection.health?.preferredTimeline ?? "",
    };
  }

  static toClientProgramSummaryDTO(
    projection: IClientDetailsProjection,
  ): ClientProgramSummaryDTO {
    return {
      userProgramId: projection.userProgramId.toString(),
      userPlanId: projection.userPlanId.toString(),
      nutritionistPlanId: projection.planId.toString(),

      title: projection.planTitle,

      durationDays: projection.durationDays,
      currentDay: projection.currentDay,
      completionPercentage: projection.completionPercentage,

      status: projection.programStatus,

      startDate: projection.startDate,
      endDate: projection.endDate,
    };
  }

  static toClientDetailsResponseDTO(
    projection: IClientDetailsProjection,
  ): ClientDetailsResponseDTO {
    return {
      clientId: projection.clientId.toString(),

      fullName: projection.fullName,
      username: projection.username,
      email: projection.email,
      phone: projection.phone,

      birthDate: projection.birthDate,
      gender: projection.gender,

      profileImage: projection.profileImage,

      health: this.toClientHealthDetailsDTO(projection),

      program: this.toClientProgramSummaryDTO(projection),
    };
  }
}
