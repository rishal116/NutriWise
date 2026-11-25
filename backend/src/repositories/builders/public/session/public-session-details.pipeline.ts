import { PipelineStage, Types } from "mongoose";

import {
  buildSessionNutritionistLookupStages,
  buildSessionParticipantCountLookupStage,
  sessionParticipantCountExpression,
} from "../../common/session/session-lookup.pipeline";

export const buildPublicSessionDetailsPipeline = (
  sessionId: Types.ObjectId,
): PipelineStage[] => [
  {
    $match: {
      _id: sessionId,
      deletedAt: null,
      status: { $in: ["scheduled", "live"] },
    },
  },
  ...buildSessionNutritionistLookupStages(),
  buildSessionParticipantCountLookupStage(),
  {
    $project: {
      _id: 0,
      sessionId: { $toString: "$_id" },
      title: 1,
      description: 1,
      type: 1,
      pricingType: 1,
      pricing: 1,
      scheduledAt: 1,
      duration: 1,
      maxParticipants: 1,
      participantCount: sessionParticipantCountExpression,
      thumbnailUrl: 1,
      status: 1,
      nutritionist: {
        nutritionistId: { $toString: "$nutritionist._id" },
        name: "$nutritionist.fullName",
        profileImage: "$nutritionist.profileImage",
      },
    },
  },
];
