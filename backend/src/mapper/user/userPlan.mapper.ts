import { IUserPlanPopulated } from "../../types/userPlan.populated";
import { IUserProgram } from "../../models/userProgram.model";
import { UserPlanListDTO } from "../../dtos/user/userPlanList.dto";
import { UserPlanDetailDTO } from "../../dtos/user/userPlanDetail.dto";
import { IUserProgramPopulated } from "../../types/userProgram.populated";

export class UserPlanMapper {
  /* 🔹 LIST */
 static toListDTO(
  plan: IUserPlanPopulated,
  program?: IUserProgram | IUserProgramPopulated | null,
): UserPlanListDTO {
  let currentDay = 0;
  let completion = 0;

  if (program && program.startDate) {
    currentDay = Math.max(
      Math.ceil(
        (Date.now() - new Date(program.startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
      1
    );

    completion = Math.min(
      (currentDay / program.durationDays) * 100,
      100
    );
  }

  return {
    id: plan._id.toString(),

    title: plan.planId?.title || plan.planSnapshot.title,
    price: plan.planId?.price || plan.planSnapshot.price,
    durationInDays:
      plan.planId?.durationInDays || plan.planSnapshot.durationInDays,

    status: plan.status,
    paymentStatus: plan.paymentStatus,

    startDate: plan.startDate,
    endDate: plan.endDate,

    program: program
      ? {
          goal: program.goal,
          status: program.status,
          currentDay,
          completion,
          daysRemaining: Math.max(program.durationDays - currentDay, 0),
        }
      : undefined,
  };
}

  /* 🔥 DETAIL */
  static toDetailDTO(
    plan: IUserPlanPopulated,
    program?: IUserProgram | IUserProgramPopulated | null,
  ): UserPlanDetailDTO {
    let progress;

    if (program) {
      const currentDay = Math.ceil(
        (Date.now() - new Date(program.startDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      const completion = Math.min(
        (currentDay / program.durationDays) * 100,
        100,
      );

      progress = {
        currentDay,
        completion,
        daysRemaining: Math.max(program.durationDays - currentDay, 0),
      };
    }

    return {
      id: plan._id.toString(),

      plan: {
        id: plan.planId._id.toString(),
        title: plan.planId?.title || plan.planSnapshot.title,
        price: plan.planId?.price || plan.planSnapshot.price,
        durationInDays:
          plan.planId?.durationInDays || plan.planSnapshot.durationInDays,
      },

      nutritionist: {
        id: plan.nutritionistId._id.toString(),
        name: plan.nutritionistId.fullName,
      },

      status: plan.status,
      paymentStatus: plan.paymentStatus,

      startDate: plan.startDate,
      endDate: plan.endDate,

      program: program
        ? {
            id: program._id.toString(),
            goal: program.goal,
            status: program.status,
            startDate: program.startDate,
            endDate: program.endDate,
            progress: progress!,
          }
        : undefined,
    };
  }
}
