import { clientApi} from "@/lib/axios/clientApi";

interface SubmitReviewPayload {
  nutritionistId: string;
  rating: number;
  review?: string;
  planId?: string;
}

export const reviewService = {
  submitReview: async (payload: SubmitReviewPayload) => {
    const res = await clientApi.post("/review", payload);
    return res.data;
  },
  getMyReview: async (nutritionistId: string) => {
    const res = await clientApi.get(`/review/${nutritionistId}`);
    return res.data;
  },

  updateReview: async (reviewId: string, payload: any) => {
    const res = await clientApi.put(`/review/${reviewId}`, payload);
    return res.data;
  },

  deleteReview: async (reviewId: string) => {
    const res = await clientApi.delete(`/review/${reviewId}`);
    return res.data;
  },
};
