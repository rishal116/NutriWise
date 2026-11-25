import type {
  ProvisionUserProgramDTO,
  ProvisionedUserProgramDTO,
} from "../../../../dtos/common/stripe/stripe-program-provisioning.dto";

export interface IStripeProgramProvisioningService {
  provision(
    params: ProvisionUserProgramDTO,
  ): Promise<ProvisionedUserProgramDTO>;
}
