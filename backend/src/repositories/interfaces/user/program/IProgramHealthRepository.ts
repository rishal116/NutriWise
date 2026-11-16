import type { IBaseRepository } from "../../common/IBaseRepository";
import type { IProgramHealth } from "../../../../models/programHealth.model"; 

export interface IProgramHealthRepository extends IBaseRepository<IProgramHealth> {
  findByUserProgramId(userProgramId: string): Promise<IProgramHealth | null>;

  findByUserAndProgram(
    userId: string,
    userProgramId: string,
  ): Promise<IProgramHealth | null>;
}
