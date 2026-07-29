import { clientApi } from "@/lib/axios/clientApi";
import { USER_PROGRAM_ROUTES } from "@/routes/user";

import {
  BrowseUserProgramsResponse,
  UserProgramDetailsResponse,
} from "@/dtos/user/program/user-program-response.dto";

export const userProgramService = {
  async browsePrograms(
    params?: Record<string, string | number | undefined>,
  ): Promise<BrowseUserProgramsResponse> {
    const res = await clientApi.get(USER_PROGRAM_ROUTES.BROWSE, {
      params,
    });

    return res.data;
  },

  async getProgramDetails(
    programId: string,
  ): Promise<UserProgramDetailsResponse> {
    const res = await clientApi.get(
      USER_PROGRAM_ROUTES.DETAILS(programId),
    );

    return res.data;
  },
};