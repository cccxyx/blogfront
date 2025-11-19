import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8080';

const service = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
});

service.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        const { code, message, data } = response.data;
        if (code === 200) {
            return data;
        } else {
            ElMessage.error(message || 'Error');
            if (code === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                router.push('/');
            }
            return Promise.reject(new Error(message || 'Error'));
        }
    },
    error => {
        console.error('Response error:', error);
        if (error.response) {
            const { status, data } = error.response;
            let errorMessage = data.message || `请求失败，状态码: ${status}`;
            if (status === 401) {
                ElMessage.error('请重新登录');
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                router.push('/');
            } else if (status === 403) {
                ElMessage.error('没有权限访问');
            } else {
                ElMessage.error(errorMessage);
            }
        } else {
            ElMessage.error('请检查网络连接');
        }
        return Promise.reject(error);
    }
);

export default service;