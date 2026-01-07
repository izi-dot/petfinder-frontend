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
}

export interface NewPostRequest {
  createdBy: string;
  userAvatar: string;
  petName: string;
  location: string;
  photos: string;
  description?: string;
}