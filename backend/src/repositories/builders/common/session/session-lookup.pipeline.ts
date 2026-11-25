import { PipelineStage } from "mongoose";
import { SessionRegistrationModel } from "../../../../models/sessionRegistration.model";

export const buildSessionNutritionistLookupStages = (): PipelineStage[] => [
  {
    $lookup: {
      from: "users",
      localField: "nutritionistId",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            _id: 1,
            fullName: 1,
            profileImage: 1,
          },
        },
      ],
      as: "nutritionist",
    },
  },
  {
    $unwind: "$nutritionist",
  },
];

export const buildSessionParticipantCountLookupStage = (): PipelineStage => ({
  $lookup: {
    from: SessionRegistrationModel.collection.name,
    let: {
      sessionId: "$_id",
      pricingType: "$pricingType",
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$sessionId", "$$sessionId"] },
              {
                $in: ["$status", ["registered", "attended", "absent"]],
              },
              {
                $eq: [
                  "$paymentStatus",
                  {
                    $cond: [
                      { $eq: ["$$pricingType", "paid"] },
                      "paid",
                      "not_required",
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $count: "participantCount",
      },
    ],
    as: "registrationCount",
  },
});

export const sessionParticipantCountExpression = {
  $ifNull: [
    {
      $arrayElemAt: ["$registrationCount.participantCount", 0],
    },
    0,
  ],
};
