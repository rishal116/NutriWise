import { IWallet } from "../../../models/wallet.model";
import { NutriEarningsSummaryDTO } from "../../../dtos/nutritionist/earnings/nutri-earnings-summary.dto";

export function toNutriEarningsSummaryDTO(
  wallet: IWallet | null,
): NutriEarningsSummaryDTO {
  return {
    availableBalance: wallet?.availableBalance ?? 0,
    escrowBalance: wallet?.escrowBalance ?? 0,
    currency: wallet?.currency ?? "inr",
  };
}
