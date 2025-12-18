
// Notification DTO
export interface NotificationDTO {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
  senderId?: string;
}

// Nutritionist Profile DTO
export interface NutritionistProfileDTO {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  nutritionistStatus: "pending" | "approved" | "rejected" | "none";
  rejectionReason?: string;
  bio?: string;
  qualifications?: string[];
  specializations?: string[];
  languages?: string[];
  salary?: number;
  country?: string;
  experiences?: {
    role: string;
    organization: string;
    years: number;
  }[];
  totalExperienceYears?: number;
  cv?: string;
  certifications?: string[];
  availabilityStatus?: "available" | "unavailable" | "busy";
  createdAt?: string;
  updatedAt?: string;
}

// Pagination Response DTO
export interface NotificationResponseDTO {
  notifications: NotificationDTO[];
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
}

// Query Filters DTO
export interface NotificationQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  filter?: "all" | "unread";
}
