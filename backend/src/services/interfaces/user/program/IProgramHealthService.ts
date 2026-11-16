import type { CreateProgramHealthDTO } from "../../../../dtos/user/program-health/create-program-health.dto";
import type { UpdateProgramHealthDTO } from "../../../../dtos/user/program-health/update-program-health.dto";
import type { IProgramHealthResponseDTO } from "../../../../dtos/user/program-health/program-health-response.dto";

export interface IProgramHealthService {
  createProgramHealth(
    userId: string,
    userProgramId: string,
    dto: CreateProgramHealthDTO,
  ): Promise<void>;

  getProgramHealth(
    userId: string,
    userProgramId: string,
  ): Promise<IProgramHealthResponseDTO | null>;

  updateProgramHealth(
    userId: string,
    userProgramId: string,
    dto: UpdateProgramHealthDTO,
  ): Promise<void>;
}
