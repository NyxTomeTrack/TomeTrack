// API Configuration
export const API_BASE_URL = 'http://192.168.101.22:3000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Books
  SEARCH_BOOKS: `${API_BASE_URL}/books/search`,
  GET_BOOK: (id: string) => `${API_BASE_URL}/books/${id}`,
  
  // Library
  GET_LIBRARY: `${API_BASE_URL}/library`,
  ADD_TO_LIBRARY: `${API_BASE_URL}/library`,
  UPDATE_STATUS: (id: string) => `${API_BASE_URL}/library/${id}`,
  
  // Users
  GET_PROFILE: `${API_BASE_URL}/users/profile`,
  GET_USER: (id: string) => `${API_BASE_URL}/users/${id}`,
  FOLLOW_USER: (id: string) => `${API_BASE_URL}/users/${id}/follow`,
  
  // Reading Progress
  GET_PROGRESS: (bookId: string) => `${API_BASE_URL}/progress/${bookId}`,
  UPDATE_PROGRESS: (bookId: string) => `${API_BASE_URL}/progress/${bookId}`,
};