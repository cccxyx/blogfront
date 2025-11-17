export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponseData {
  user: User;
  token: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface ArticleAuthor {
  id: number;
  username: string;
  email: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  user_id: number;
  author: ArticleAuthor;
  created_at: string;
  updated_at: string;
  formattedCreatedAt?: string;
  formattedUpdatedAt?: string;
}

export type ArticleDetail = Article;

export interface CreateArticlePayload {
  title: string;
  content: string;
}

export interface UpdateArticlePayload {
  title: string;
  content: string;
}