export interface Author {
  id: number;
  username: string;
  email: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  user_id: number;
  author: Author;
  created_at: string;
  updated_at: string;
  formattedCreatedAt?: string;
  formattedUpdatedAt?: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface LoginResponseData {
  user: {
    id: number;
    username: string;
  };
  token: string;
}