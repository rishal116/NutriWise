import PlanDayCard from "./PlanDayCard";

import type { NutritionistPlanDayListItemDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-list-item.dto";

interface PlanDayListProps {
  days: NutritionistPlanDayListItemDTO[];
  onDayClick: (dayNumber: number) => void;
}

export default function PlanDayList({ days, onDayClick }: PlanDayListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {days.map((day) => (
        <PlanDayCard key={day.id} day={day} onClick={onDayClick} />
      ))}
    </div>
  );
}
