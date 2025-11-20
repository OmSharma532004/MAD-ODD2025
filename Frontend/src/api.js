import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

// Choose host depending on platform:
// - Android emulator (default) -> 10.0.2.2
// - iOS simulator -> localhost
// - If you deploy to a real device, replace with your machine IP (e.g. 192.168.x.y)
const HOST =
  Platform.OS === 'android'
    ? '10.0.2.2' // Android emulator
    : 'localhost'; // iOS simulator / Expo on same machine

export const API_BASE = `http://${HOST}:5000/api`;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    // Optional: log helpful debug info to device console
    console.error(
      'API error:',
      err?.config?.url,
      err?.message,
      err?.response?.status,
    );
    return Promise.reject(err);
  },
);

export default api;
