import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
    const res = response.data;

    if (res.code !== 200) {
      ElMessage.error(res.message || 'Error');

      if (res.code === 401 || res.code === 403) {
        ElMessage.error('请重新登录！');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        router.push('/');
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    console.error('Response error:', error);
    if (error.response) {
      const { status, data } = error.response;
      ElMessage.error(data.message || `请求失败，状态码: ${status}`);

      if (status === 401 || status === 403) {
        ElMessage.error('请重新登录！');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        router.push('/');
      }
    } else {
      ElMessage.error('网络错误或服务器未响应');
    }
    return Promise.reject(error);
  }
);

export default service;