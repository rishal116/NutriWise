export enum ClientStatusFilter {
  ALL = "all",
  UPCOMING = "upcoming",
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum ClientSortBy {
  LATEST = "latest",
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
  START_DATE = "start_date",
  END_DATE = "end_date",
  PROGRESS = "progress",
}

export interface GetClientsQueryDTO {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: ClientStatusFilter;
  sortBy?: ClientSortBy;
}