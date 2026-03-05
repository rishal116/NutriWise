import { ProgramResponseDTO } from "../../dtos/nutritionist/programResponse.dto";
import { IUserProgramPopulated } from "../../types/userProgram.populated";

export class ProgramMapper {

static toResponseDTO(program: IUserProgramPopulated): ProgramResponseDTO {
  return {
    id: program._id.toString(),
    user: {
      id: program.userId._id.toString(),
      fullName: program.userId.fullName,
      email: program.userId.email,
    },
    planId: program.planId.toString(),
    userPlanId: program.userPlanId.toString(),
    nutritionistId: program.nutritionistId.toString(),
    goal: program.goal,
    focusAreas: program.focusAreas,
    dietType: program.dietType,
    activityLevel: program.activityLevel,
    startDate: program.startDate,
    endDate: program.endDate,
    durationDays: program.durationDays,
    currentDay: program.currentDay,
    completionPercentage: program.completionPercentage,
    status: program.status,
    planSnapshot: program.planSnapshot ? {
      title: program.planSnapshot.title,
      price: program.planSnapshot.price,
      currency: program.planSnapshot.currency,
      durationInDays: program.planSnapshot.durationInDays,
    }: undefined,
    notes: program.notes,
    createdAt: program.createdAt,
    updatedAt: program.updatedAt
  };
}

static toResponseDTOList(
  programs: IUserProgramPopulated[]
): ProgramResponseDTO[] {
  return programs.map((p) => this.toResponseDTO(p));
}
}