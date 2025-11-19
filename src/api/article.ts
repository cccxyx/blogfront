import request from '@/utils/http';
import { Article } from '@/types/api';

export function fetchArticleDetail(id: string | number): Promise<Article> {
  return request.get(`/api/articles/${id}`);
}

export function createArticle(title: string, content: string): Promise<Article> {
  return request.post(`/api/articles`, { title, content });
}

export function updateArticle(id: string | number, title: string, content: string): Promise<Article> {
  return request.put(`/api/articles/${id}`, { title, content });
}

export function deleteArticle(id: string | number): Promise<any> {
  return request.delete(`/api/articles/${id}`);
}

export function fetchAllArticles(): Promise<Article[]> {
  return request.get(`/api/articles`);
}

export function fetchMyArticles(userId: number): Promise<Article[]> {
  return request.get(`/api/articles/user/${userId}`);
}