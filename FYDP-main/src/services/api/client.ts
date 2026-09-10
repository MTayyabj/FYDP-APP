import axios from 'axios';
import { config } from '../constants/config';

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (reqConfig) => {
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      success: false,
      message: error.response?.data?.message || 'Something went wrong. Please try again.',
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 0,
    };
    return Promise.reject(normalizedError);
  }
);
