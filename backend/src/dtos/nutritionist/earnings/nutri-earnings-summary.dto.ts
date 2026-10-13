import { IWallet } from "../../../models/wallet.model";

export interface NutriEarningsSummaryDTO {
  availableBalance: number;
  escrowBalance: number;
  currency: IWallet["currency"];
}
