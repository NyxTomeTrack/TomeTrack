import axios from 'axios';

<<<<<<< HEAD
const API_URL = 'http://192.168.0.174:3000/api';
=======
const API_URL = 'http://192.168.101.22:3000/api';
>>>>>>> d200ccc00fcbe9a4d6256c522c41c780b1d487cc

// Get current user profile
export const getUserProfile = async () => {
  try {
    console.log('getUserProfile - Making request to:', `${API_URL}/users/profile`);
    const response = await axios.get(`${API_URL}/users/profile`);
    console.log('getUserProfile - Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('getUserProfile - ERROR:', error.response?.data || error.message);
    throw error;
  }
};

// Get another user's profile by ID
export const getUserById = async (userId: number) => {
  try {
    console.log('getUserById - Making request for user:', userId);
    const response = await axios.get(`${API_URL}/users/${userId}`);
    console.log('getUserById - Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('getUserById - ERROR:', error.response?.data || error.message);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData: any) => {
  try {
    console.log('updateUserProfile - Updating profile');
    const response = await axios.put(`${API_URL}/users/profile`, profileData);
    console.log('updateUserProfile - Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('updateUserProfile - ERROR:', error.response?.data || error.message);
    throw error;
  }
};

// Follow/unfollow user
export const toggleFollowUser = async (userId: number) => {
  try {
    console.log('toggleFollowUser - Toggling follow for user:', userId);
    const response = await axios.post(`${API_URL}/users/${userId}/follow`);
    console.log('toggleFollowUser - Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('toggleFollowUser - ERROR:', error.response?.data || error.message);
    throw error;
  }
};

// Get user's reading stats
export const getUserStats = async () => {
  try {
    console.log('getUserStats - Making request to:', `${API_URL}/users/stats`);
    const response = await axios.get(`${API_URL}/users/stats`);
    console.log('getUserStats - Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('getUserStats - ERROR:', error.response?.data || error.message);
    throw error;
  }
};