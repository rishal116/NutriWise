import { StatusCode } from "../../../enums/statusCode.enum";
import type { IAdminChallengeRepository } from "../../../repositories/interfaces/admin/IAdminChallengeRepository";
import { CustomError } from "../../../utils/customError";

import { validateChallengeDayId } from "./challenge-day-validation.helper";

export const getChallengeOrThrow = async (
  challengeId: string,
  challengeRepository: IAdminChallengeRepository,
) => {
  validateChallengeDayId(challengeId, "Challenge ID");

  const challenge = await challengeRepository.findById(challengeId);

  if (!challenge) {
    throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
  }

  return challenge;
};