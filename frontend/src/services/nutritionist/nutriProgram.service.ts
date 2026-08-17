import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_PROGRAM_ROUTES } from "@/routes/nutritionist";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { GetProgramsQueryDTO } from "@/dtos/nutritionist/program/program-request.dto";
import type { UserProgramCardResponseDTO } from "@/dtos/nutritionist/program/program-card-response.dto";
import type { UserProgramDetailsResponseDTO } from "@/dtos/nutritionist/program/program-details-response.dto";

export const nutriProgramService = {
  async getPrograms(
    query?: GetProgramsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserProgramCardResponseDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<UserProgramCardResponseDTO>>
    >(NUTRITIONIST_PROGRAM_ROUTES.LIST, {
      params: query,
    });
    return response.data.data;
  },

  async getProgramDetails(
    programId: string,
  ): Promise<UserProgramDetailsResponseDTO> {
    const response = await clientApi.get<
      ApiResponseDTO<UserProgramDetailsResponseDTO>
    >(NUTRITIONIST_PROGRAM_ROUTES.DETAILS(programId));
    return response.data.data;
  },
};
