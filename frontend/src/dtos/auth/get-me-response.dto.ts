import type { User } from "@/types/user/user.types";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export type GetMeResponse = ApiResponseDTO<User>;
