import { clientApi } from "@/lib/axios/clientApi";
import { USER_ACTIVITY_TRACKING_ROUTES } from "@/routes/user";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { UserActivityTrackingResponseDTO } from "@/dtos/user/tracking/user-activity-tracking-response.dto";
import { UpdateActivityTrackingDTO } from "@/dtos/user/tracking/update-activity-tracking.dto";

export const userActivityTrackingService = {
  async startActivity(
    programId: string,
    dayId: string,
    activityId: string,
  ): Promise<ApiResponseDTO<UserActivityTrackingResponseDTO>> {
    const res = await clientApi.post<
      ApiResponseDTO<UserActivityTrackingResponseDTO>
    >(USER_ACTIVITY_TRACKING_ROUTES.START(programId, dayId, activityId));

    return res.data;
  },

  async updateActivity(
    programId: string,
    dayId: string,
    activityId: string,
    data: UpdateActivityTrackingDTO,
  ): Promise<ApiResponseDTO<UserActivityTrackingResponseDTO>> {
    const res = await clientApi.patch<
      ApiResponseDTO<UserActivityTrackingResponseDTO>
    >(USER_ACTIVITY_TRACKING_ROUTES.UPDATE(programId, dayId, activityId), data);

    return res.data;
  },

  async skipActivity(
    programId: string,
    dayId: string,
    activityId: string,
    skippedReason: string,
  ): Promise<ApiResponseDTO<UserActivityTrackingResponseDTO>> {
    const res = await clientApi.patch<
      ApiResponseDTO<UserActivityTrackingResponseDTO>
    >(USER_ACTIVITY_TRACKING_ROUTES.SKIP(programId, dayId, activityId), {
      skippedReason,
    });

    return res.data;
  },

  async getActivityTracking(
    programId: string,
    dayId: string,
    activityId: string,
  ): Promise<ApiResponseDTO<UserActivityTrackingResponseDTO | null>> {
    const res = await clientApi.get<
      ApiResponseDTO<UserActivityTrackingResponseDTO | null>
    >(
      USER_ACTIVITY_TRACKING_ROUTES.GET_ACTIVITY_TRACKING(
        programId,
        dayId,
        activityId,
      ),
    );

    return res.data;
  },

  async getDayActivityTracking(
    programId: string,
    dayId: string,
  ): Promise<ApiResponseDTO<UserActivityTrackingResponseDTO[]>> {
    const res = await clientApi.get<
      ApiResponseDTO<UserActivityTrackingResponseDTO[]>
    >(USER_ACTIVITY_TRACKING_ROUTES.GET_DAY_ACTIVITIES(programId, dayId));

    return res.data;
  },
};
