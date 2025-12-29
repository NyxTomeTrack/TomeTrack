import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

<<<<<<< HEAD
const API_URL = 'http://192.168.0.174:3000/api';
=======
const API_URL = 'http://192.168.101.22:3000/api';
>>>>>>> d200ccc00fcbe9a4d6256c522c41c780b1d487cc

// Storage keys
const TOKEN_KEY = '@tometrack_token';
const USER_KEY = '@tometrack_user';

// Save token and user data
export const saveAuthData = async (token: string, user: any) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

// Get token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Get user data
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Clear auth data (logout)
export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

// Check if user is logged in
export const isLoggedIn = async () => {
  const token = await getToken();
  return !!token;
};

// Login
export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });
  
  const { token, user } = response.data;
  await saveAuthData(token, user);
  
  return { token, user };
};

// Setup axios interceptor to add token to requests
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    async (config) => {
      const token = await getToken();
      console.log('AXIOS INTERCEPTOR - Token:', token ? 'EXISTS' : 'MISSING');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('AXIOS INTERCEPTOR - Added Authorization header');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};