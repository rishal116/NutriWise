export interface ApiResponseDTO<T = never> {
  success: boolean;
  message: string;
  data?: T;
}