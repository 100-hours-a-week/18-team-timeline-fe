import axios from 'axios'
import { API_BASE_URL } from '@/constants/url'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 0,
});