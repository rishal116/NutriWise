import { injectable } from "inversify";

import { BaseRepository } from "../../common/base.repository";
import type { IProgramHealthRepository } from "../../../interfaces/user/program/IProgramHealthRepository";
import type { IProgramHealth } from "../../../../models/programHealth.model";
import { ProgramHealthModel } from "../../../../models/programHealth.model";

@injectable()
export class ProgramHealthRepository
  extends BaseRepository<IProgramHealth>
  implements IProgramHealthRepository
{
  constructor() {
    super(ProgramHealthModel);
  }

  async findByUserProgramId(
    userProgramId: string,
  ): Promise<IProgramHealth | null> {
    return this.findOne({ userProgramId });
  }

  async findByUserAndProgram(
    userId: string,
    userProgramId: string,
  ): Promise<IProgramHealth | null> {
    return this.findOne({
      userId,
      userProgramId,
    });
  }
}
