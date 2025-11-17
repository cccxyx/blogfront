import request from '@/utils/request';
import { ApiResponse, Article, ArticleDetail, CreateArticlePayload, UpdateArticlePayload } from '@/types/api';

export const getAllArticles = (): Promise<ApiResponse<Article[]>> => {
  return request.get('/articles');
};

export const getArticlesByUserId = (userId: number): Promise<ApiResponse<Article[]>> => {
  return request.get(`/articles/user/${userId}`);
};

export const getArticleDetail = (id: string): Promise<ApiResponse<ArticleDetail>> => {
  return request.get(`/articles/${id}`);
};

export const createArticle = (payload: CreateArticlePayload): Promise<ApiResponse<Article>> => {
  return request.post('/articles', payload);
};

export const updateArticle = (id: string, payload: UpdateArticlePayload): Promise<ApiResponse<Article>> => {
  return request.put(`/articles/${id}`, payload);
};

export const deleteArticle = (id: string): Promise<ApiResponse<null>> => {
  return request.delete(`/articles/${id}`);
};