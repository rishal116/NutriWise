import { IChallenge } from "../../models/challenge.model";
import { ChallengeListDTO } from "../../dtos/challenge/challenge-list.dto";

export const mapChallengeToListDTO = (
  challenge: IChallenge,
): ChallengeListDTO => ({
  id: challenge._id.toString(),
  title: challenge.title,
  slug: challenge.slug,
  shortDescription: challenge.shortDescription,
  difficulty: challenge.difficulty,
  type: challenge.type,
  category: challenge.category,
  duration: challenge.duration,
  status: challenge.status,
  isPremium: challenge.isPremium,
  isFeatured: challenge.isFeatured,
  isTrending: challenge.isTrending,
  isRecommended: challenge.isRecommended,
  coverImage: challenge.coverImage,
  totalEnrollments: challenge.totalEnrollments,
  averageRating: challenge.averageRating,
  createdAt: challenge.createdAt,
});
