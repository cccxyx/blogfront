import request from '@/utils/http';
import { LoginResponseData } from '@/types/api';

export function login(username: string, password: string): Promise<LoginResponseData> {
    return request.post('/api/login', { username, password });
}

export function register(username: string, email: string, password: string): Promise<any> {
    return request.post('/api/register', { username, password, email });
}