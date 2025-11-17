import request from '@/utils/request';
import { ApiResponse, LoginPayload, LoginResponseData, RegisterPayload } from '@/types/api';

export const login = (payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> => {
  return request.post('/login', payload);
};

export const register = (payload: RegisterPayload): Promise<ApiResponse<{ user_id: number; username: string; email: string }>> => {
  return request.post('/register', payload);
};