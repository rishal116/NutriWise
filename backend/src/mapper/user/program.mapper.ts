import { ProgramResponseDTO } from "../../dtos/user/userProgram.dto";
import { IUserProgramPopulated } from "../../types/userProgram.populated";

export class ProgramMapper {

static toResponseDTO(program: IUserProgramPopulated): ProgramResponseDTO {
  return {
    id: program._id.toString(),
    nutritionist: {
      id: program.nutritionistId._id.toString(),
      fullName: program.nutritionistId.fullName,
      email: program.nutritionistId.email,
    },
    planId: program.planId.toString(),
    userPlanId: program.userPlanId.toString(),
    userId: program.userId.toString(),
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