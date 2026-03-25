import { api } from "@/lib/axios/api";

interface SubmitReviewPayload {
  nutritionistId: string;
  rating: number;
  review?: string;
  planId?: string;
}

export const reviewService = {
  submitReview: async (payload: SubmitReviewPayload) => {
    const res = await api.post("/review", payload);
    return res.data;
  },
  getMyReview: async (nutritionistId: string) => {
  const res = await api.get(`/review/${nutritionistId}`);
  return res.data;
},

updateReview: async (reviewId: string, payload: any) => {
  const res = await api.put(`/review/${reviewId}`, payload);
  return res.data;
},

deleteReview: async (reviewId: string) => {
  const res = await api.delete(`/review/${reviewId}`);
  return res.data;
},
};