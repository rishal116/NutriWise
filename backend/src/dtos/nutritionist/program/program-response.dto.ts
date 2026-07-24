export class ProgramSummaryDTO {
  userProgramId!: string;

  userId!: string;

  userPlanId!: string;

  planId!: string;

  fullName!: string;

  username!: string;

  profileImage?: string;

  planTitle!: string;

  status!: string;

  currentDay!: number;

  durationDays!: number;

  completionPercentage!: number;

  startDate!: Date;

  endDate!: Date;
}

export class ProgramBrowseResponseDTO {
  items!: ProgramSummaryDTO[];

  nextCursor!: string | null;

  hasMore!: boolean;
}

export class ProgramDetailsDTO extends ProgramSummaryDTO {}