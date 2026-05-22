import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserSessionService } from "../../interfaces/user/IUserSessionService";
import { ISessionRepository } from "../../../repositories/interfaces/session/ISessionRepository";
import { ISessionParticipantRepository } from "../../../repositories/interfaces/session/ISessionParticipantRepository";
import {
  SessionAccessStatus,
  PaymentStatus,
} from "../../../models/sessionParticipant.model";
import {
  SessionAccessDTO,
  SessionPaymentDTO,
  UserSessionListDTO,
  UserSessionDetailsDTO,
} from "../../../dtos/user/session.dto";
import logger from "../../../utils/logger";
import { Types } from "mongoose";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IStripeService } from "../../interfaces/common/IStripeService";
import { SessionStripeMapper } from "../../../mapper/user/sessionStripe.mapper";
import { UserSessionMapper } from "../../../mapper/user/session.mapper";
import { IUserPopulated } from "../../../types/user.populated";
import { SessionStatus } from "../../../models/session.model";

@injectable()
export class UserSessionService implements IUserSessionService {
  constructor(
    @inject(TYPES.ISessionRepository)
    private _sessionRepository: ISessionRepository,

    @inject(TYPES.ISessionParticipantRepository)
    private _sessionParticipantRepository: ISessionParticipantRepository,

    @inject(TYPES.IStripeService)
    private _stripeService: IStripeService,
  ) {}

  private async getParticipantCountMap(sessionIds: string[]) {
    const participants =
      await this._sessionParticipantRepository.getParticipantsBySessionIds(
        sessionIds,
      );

    const participantCountMap = new Map<string, number>();
    for (const participant of participants) {
      if (participant.joinStatus === SessionAccessStatus.APPROVED) {
        const sessionId = participant.sessionId.toString();
        participantCountMap.set(
          sessionId,
          (participantCountMap.get(sessionId) || 0) + 1,
        );
      }
    }
    return participantCountMap;
  }

  async getPublicSessions(
    page: number,
    limit: number,
    filters: {
      status?: string;
      type?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    },
  ): Promise<{
    data: UserSessionListDTO[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      hasMore: boolean;
    };
  }> {
    logger.info("Fetching public sessions", {
      page,
      limit,
      filters,
    });
    const result = await this._sessionRepository.getAllPublicSessions(
      page,
      limit,
      filters,
    );
    const sessionIds = result.data.map((s) => s._id.toString());
    const participantCountMap = await this.getParticipantCountMap(sessionIds);
    return {
      data: UserSessionMapper.toListResponseArray(
        result.data,
        participantCountMap,
      ),
      pagination: {
        total: result.total,
        page,
        limit,
        hasMore: page * limit < result.total,
      },
    };
  }

  async getMySessions(userId: string): Promise<UserSessionListDTO[]> {
    logger.info("Fetching user joined sessions", { userId });
    const participations =
      await this._sessionParticipantRepository.findByUserId(userId);
    const sessionIds = participations.map((p) => p.sessionId.toString());
    const sessions = await this._sessionRepository.findByIds(sessionIds);
    const participantCountMap = await this.getParticipantCountMap(sessionIds);
    return UserSessionMapper.toListResponseArray(sessions, participantCountMap);
  }

  async getPublicSessionDetails(
    sessionId: string,
  ): Promise<UserSessionDetailsDTO> {
    logger.info("Fetching public session details", {
      sessionId,
    });
    const session = await this._sessionRepository.getUserSessionById(sessionId);
    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }
    const approvedParticipants =
      await this._sessionParticipantRepository.countApprovedParticipants(
        sessionId,
      );
    const participants =
      await this._sessionParticipantRepository.getParticipantsBySessionIds([
        sessionId,
      ]);
    const users = participants.map((participant) => {
      const user = participant.userId as IUserPopulated;
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      };
    });

    return UserSessionMapper.toDetailsResponse(
      session,
      approvedParticipants,
      users,
    );
  }

  async getMySessionDetails(
    userId: string,
    sessionId: string,
  ): Promise<UserSessionDetailsDTO> {
    logger.info("Fetching joined session details", {
      userId,
      sessionId,
    });
    const participant =
      await this._sessionParticipantRepository.findByUserAndSession(
        userId,
        sessionId,
      );
    if (!participant) {
      throw new CustomError(
        "You are not part of this session",
        StatusCode.FORBIDDEN,
      );
    }
    const session = await this._sessionRepository.getUserSessionById(sessionId);
    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }
    const approvedParticipants =
      await this._sessionParticipantRepository.countApprovedParticipants(
        sessionId,
      );
    const participants =
      await this._sessionParticipantRepository.getParticipantsBySessionIds([
        sessionId,
      ]);
    const users = participants
      .filter((p) => p.joinStatus === SessionAccessStatus.APPROVED && p.userId)
      .map((p) => {
        const user = p.userId as IUserPopulated;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      });

    return UserSessionMapper.toDetailsResponse(
      session,
      approvedParticipants,
      users,
    );
  }

  async joinFreeSession(userId: string, sessionId: string): Promise<void> {
    logger.info("User attempting free session join", {
      userId,
      sessionId,
    });

    const existing =
      await this._sessionParticipantRepository.findByUserAndSession(
        userId,
        sessionId,
      );

    if (existing) {
      throw new CustomError(
        "You have already joined this session",
        StatusCode.BAD_REQUEST,
      );
    }

    const session = await this._sessionRepository.getSessionById(sessionId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    if (session.type !== "free") {
      throw new CustomError(
        "This session requires payment",
        StatusCode.BAD_REQUEST,
      );
    }

    if (
      session.status !== SessionStatus.SCHEDULED &&
      session.status !== SessionStatus.LIVE
    ) {
      throw new CustomError("Session is not available", StatusCode.BAD_REQUEST);
    }

    const approvedParticipants =
      await this._sessionParticipantRepository.countApprovedParticipants(sessionId);

    if (approvedParticipants >= session.maxParticipants) {
      throw new CustomError("Session is full", StatusCode.BAD_REQUEST);
    }

    await this._sessionParticipantRepository.createParticipant({
      userId: new Types.ObjectId(userId),
      sessionId: new Types.ObjectId(sessionId),
      joinStatus: SessionAccessStatus.APPROVED,
      paymentStatus: PaymentStatus.NONE,
    });

    logger.info("Free session joined successfully", {
      userId,
      sessionId,
    });
  }

  async createPaidSessionPayment(
    userId: string,
    sessionId: string,
  ): Promise<SessionPaymentDTO> {
    logger.info("Creating paid session checkout", {
      userId,
      sessionId,
    });

    const session = await this._sessionRepository.getSessionById(sessionId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    if (session.type !== "paid") {
      throw new CustomError(
        "This is not a paid session",
        StatusCode.BAD_REQUEST,
      );
    }

    const existing =
      await this._sessionParticipantRepository.findByUserAndSession(
        userId,
        sessionId,
      );

    if (existing) {
      throw new CustomError(
        "Already joined or payment initiated",
        StatusCode.BAD_REQUEST,
      );
    }

    const stripeInput = SessionStripeMapper.toStripeInput(session, userId);

    const checkoutUrl =
      await this._stripeService.createCheckoutSession(stripeInput);

    logger.info("Stripe checkout created", {
      userId,
      sessionId,
    });

    return {
      checkoutUrl,
    };
  }

  async verifySessionPayment(sessionId: string): Promise<void> {
    logger.info("Verifying session payment", {
      sessionId,
    });

    // 1. Retrieve Stripe Checkout Session (NOT PaymentIntent)
    const session =
      await this._stripeService.retrieveCheckoutSession(sessionId);

    if (!session) {
      throw new CustomError("Invalid Stripe session", StatusCode.BAD_REQUEST);
    }

    // 2. Check payment status
    if (session.payment_status !== "paid") {
      throw new CustomError("Payment not successful", StatusCode.BAD_REQUEST);
    }

    // 3. Extract metadata
    const userId = session.metadata?.userId;
    const sessionDbId = session.metadata?.sessionId;

    if (!userId || !sessionDbId) {
      throw new CustomError("Invalid payment metadata", StatusCode.BAD_REQUEST);
    }

    // 4. Check existing participant
    const existing =
      await this._sessionParticipantRepository.findByUserAndSession(
        userId,
        sessionDbId,
      );

    if (!existing) {
      await this._sessionParticipantRepository.createParticipant({
        userId: new Types.ObjectId(userId),
        sessionId: new Types.ObjectId(sessionDbId),
        joinStatus: SessionAccessStatus.APPROVED,
        paymentStatus: PaymentStatus.PAID,
      });
    } else {
      await this._sessionParticipantRepository.updatePaymentStatus(
        userId,
        sessionDbId,
        PaymentStatus.PAID,
        SessionAccessStatus.APPROVED,
      );
    }

    logger.info("Session payment verified successfully", {
      userId,
      sessionId: sessionDbId,
    });
  }

  async leaveSession(userId: string, sessionId: string): Promise<void> {
    logger.info("Leaving session", {
      userId,
      sessionId,
    });

    const existing =
      await this._sessionParticipantRepository.findByUserAndSession(
        userId,
        sessionId,
      );

    if (!existing) {
      throw new CustomError(
        "You are not part of this session",
        StatusCode.BAD_REQUEST,
      );
    }

    await this._sessionParticipantRepository.deleteByUserAndSession(
      userId,
      sessionId,
    );

    logger.info("User left session successfully", {
      userId,
      sessionId,
    });
  }

  async getSessionAccess(
    userId: string,
    sessionId: string,
  ): Promise<SessionAccessDTO> {
    logger.info("Checking session access", {
      userId,
      sessionId,
    });

    const participant =
      await this._sessionParticipantRepository.findByUserAndSession(
        userId,
        sessionId,
      );

    if (
      !participant ||
      participant.joinStatus !== SessionAccessStatus.APPROVED
    ) {
      throw new CustomError("Access denied", StatusCode.FORBIDDEN);
    }

    const session = await this._sessionRepository.getSessionById(sessionId);

    if (!session) {
      throw new CustomError("Session not found", StatusCode.NOT_FOUND);
    }

    await this._sessionParticipantRepository.markPresent(userId, sessionId);

    return {
      roomId: session.roomId,
      sessionId: session._id.toString(),
    };
  }
}
