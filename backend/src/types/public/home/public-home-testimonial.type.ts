export interface PublicHomeTestimonial {
  id: string;
  rating: number;
  review: string;
  createdAt: Date;
  user: {
    fullName: string;
    username: string;
    profileImage?: string;
  };
  nutritionist: {
    fullName: string;
    username: string;
    profileImage?: string;
  };
}
