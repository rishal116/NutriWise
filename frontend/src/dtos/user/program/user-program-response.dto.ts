import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { UserProgramCardDTO } from "./user-program-card.dto";
import { UserProgramDetailsDTO } from "./user-program-details.dto";
import { UserProgramDayDTO } from "./user-program-day.dto";
import { UserProgramDayDetailsDTO } from "./user-program-day-details.dto";

export interface BrowseUserProgramsResponse {
  success: boolean;
  data: InfiniteScrollResponseDTO<UserProgramCardDTO>;
}

export interface UserProgramDetailsResponse {
  success: boolean;
  data: UserProgramDetailsDTO;
}

export interface UserProgramDaysResponse {
  success: boolean;
  data: UserProgramDayDTO[];
}

export interface UserProgramDayDetailsResponse {
  success: boolean;
  data: UserProgramDayDetailsDTO;
}