import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../../types/types";
import type { IUserPaymentRepository } from "../../../../repositories/interfaces/user/account/IUserPaymentRepository";
import type { IUserPaymentService } from "../../../interfaces/user/account/IUserPaymentService";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";
import { UserPaymentResponseDTO } from "../../../../dtos/user/payment/user-payment-response.dto";
import { UserWalletResponseDTO } from "../../../../dtos/user/payment/user-wallet-response.dto";
import { UserWalletTransactionResponseDTO } from "../../../../dtos/user/payment/user-wallet-transaction-response.dto";
import { UserPaymentMapper } from "../../../../mappers/user/payment/user-payment.mapper";

@injectable()
export class UserPaymentService implements IUserPaymentService {
  constructor(
    @inject(TYPES.IUserPaymentRepository)
    private readonly userPaymentRepository: IUserPaymentRepository,
  ) {}

  async getPayments(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<UserPaymentResponseDTO>> {
    const userObjectId = this.toObjectId(userId);
    this.validateLimit(limit);

    const result = await this.userPaymentRepository.getPayments(
      userObjectId,
      limit,
      cursor,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map((payment) =>
        UserPaymentMapper.toPaymentResponseDTO(payment),
      ),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getPaymentById(
    userId: string,
    paymentId: string,
  ): Promise<UserPaymentResponseDTO | null> {
    const userObjectId = this.toObjectId(userId);
    const paymentObjectId = this.toObjectId(paymentId);

    const payment = await this.userPaymentRepository.getPaymentById(
      userObjectId,
      paymentObjectId,
    );

    return payment ? UserPaymentMapper.toPaymentResponseDTO(payment) : null;
  }

  async getWallet(userId: string): Promise<UserWalletResponseDTO | null> {
    const userObjectId = this.toObjectId(userId);

    const wallet = await this.userPaymentRepository.getWallet(userObjectId);

    return wallet ? UserPaymentMapper.toWalletResponseDTO(wallet) : null;
  }

  async getWalletTransactions(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<UserWalletTransactionResponseDTO>> {
    const userObjectId = this.toObjectId(userId);
    this.validateLimit(limit);

    const result = await this.userPaymentRepository.getWalletTransactions(
      userObjectId,
      limit,
      cursor,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map((transaction) =>
        UserPaymentMapper.toWalletTransactionResponseDTO(transaction),
      ),
      result.nextCursor,
      result.hasMore,
    );
  }

  private toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid identifier.");
    }

    return new Types.ObjectId(id);
  }

  private validateLimit(limit: number): void {
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new Error("Limit must be an integer between 1 and 50.");
    }
  }
}
