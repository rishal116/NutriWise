import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_PROGRAM_ROUTES } from "@/routes/nutritionist";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { GetProgramsQueryDTO } from "@/dtos/nutritionist/program/nutri-program-request.dto";
import type { NutriProgramCardResponseDTO } from "@/dtos/nutritionist/program/nutri-program-card-response.dto";
import type { NutriProgramDetailsResponseDTO } from "@/dtos/nutritionist/program/nutri-program-details-response.dto";

export const nutriProgramService = {
  async getPrograms(
    query?: GetProgramsQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriProgramCardResponseDTO>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<NutriProgramCardResponseDTO>>
    >(NUTRITIONIST_PROGRAM_ROUTES.LIST, {
      params: query,
    });

    return response.data.data!;
  },

  async getProgramDetails(
    programId: string,
  ): Promise<NutriProgramDetailsResponseDTO> {
    const response = await clientApi.get<
      ApiResponseDTO<NutriProgramDetailsResponseDTO>
    >(NUTRITIONIST_PROGRAM_ROUTES.DETAILS(programId));

    return response.data.data!;
  },
};
