export class PublicHomeTestimonialDTO {
  id!: string;
  rating!: number;
  review!: string;
  createdAt!: string;

  user!: {
    fullName: string;
    username: string;
    profileImage?: string;
  };

  nutritionist!: {
    fullName: string;
    username: string;
    profileImage?: string;
  };
}
