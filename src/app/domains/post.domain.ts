import { User } from "./user.domain";

export class Post {
  id?: string;
  createdBy?: string;
  userAvatar?: string;
  createdAt?: string;
  petName?: string;
  location?: string;
  photos?: string;
  description?: string;
  interactionsCount?: number;
  solved?: boolean;
  comments?: Comment[];
  animalType?: string;
  breed?: string;
}

export interface NewPostRequest {
  petName: string;
  location: string;
  photos: string;
  description: string;
  animalType: string;
  breed: string; 
}

export interface AddCommentRequest {
  postId: string;
  comment: string;
}

export interface Comment {
  id: string;
  comment: string;
  user: User;
}