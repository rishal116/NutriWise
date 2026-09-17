import { UserChallengeDetailsDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

import { UserChallengeDayDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

import UserChallengeActivityCard from "./UserChallengeActivityCard";

interface UserChallengeActivityListProps {
  userChallengeId: string;
  challenge: UserChallengeDetailsDTO;
  day: UserChallengeDayDTO;
  onChallengeUpdate: (challenge: UserChallengeDetailsDTO) => void;
}

export default function UserChallengeActivityList({
  userChallengeId,
  challenge,
  day,
  onChallengeUpdate,
}: UserChallengeActivityListProps) {
  const activities = [...day.activities].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <UserChallengeActivityCard
          key={activity.id}
          userChallengeId={userChallengeId}
          challenge={challenge}
          day={day}
          activity={activity}
          onChallengeUpdate={onChallengeUpdate}
        />
      ))}
    </div>
  );
}
