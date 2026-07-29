import { clientApi } from "@/lib/axios/clientApi";
import { USER_PROGRAM_ROUTES } from "@/routes/user";

import {
  UserProgramDaysResponse,
  UserProgramDayDetailsResponse,
} from "@/dtos/user/program/user-program-response.dto";

export const userProgramDayService = {
  async browseProgramDays(programId: string): Promise<UserProgramDaysResponse> {
    const res = await clientApi.get(USER_PROGRAM_ROUTES.DAYS(programId));

    return res.data;
  },

  async getDayDetails(
    programId: string,
    dayNumber: number,
  ): Promise<UserProgramDayDetailsResponse> {
    const res = await clientApi.get(
      USER_PROGRAM_ROUTES.DAY_DETAILS(programId, dayNumber),
    );

    return res.data;
  },
};
