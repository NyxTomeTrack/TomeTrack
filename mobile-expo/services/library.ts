import axios from 'axios';

const API_URL = 'http://192.168.101.22:3000/api';

// Get user's library
export const getUserLibrary = async () => {
  try {
    console.log('getUserLibrary - Fetching library');
    const response = await axios.get(`${API_URL}/library`);
    console.log('getUserLibrary - Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('getUserLibrary - ERROR:', error.response?.data || error.message);
    throw error;
  }
};

// Add book to library
export const addBookToLibrary = async (bookData: {
  book_id: string;
  status: 'read' | 'currently_reading' | 'to_read' | 'dnf';
  rating?: number;
  review?: string;
}) => {
  try {
    console.log('addBookToLibrary - Adding book:', bookData);
    const response = await axios.post(`${API_URL}/library`, bookData);
    console.log('addBookToLibrary - Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('addBookToLibrary - ERROR:', error.response?.data || error.message);
    throw error;
  }
};

// Update book status in library
export const updateBookStatus = async (libraryId: string, updates: {
  status?: 'read' | 'currently_reading' | 'to_read' | 'dnf';
  rating?: number;
  review?: string;
}) => {
  try {
    console.log('updateBookStatus - Updating:', libraryId, updates);
    const response = await axios.put(`${API_URL}/library/${libraryId}`, updates);
    console.log('updateBookStatus - Success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('updateBookStatus - ERROR:', error.response?.data || error.message);
    throw error;
  }
};

// Remove book from library
export const removeBookFromLibrary = async (libraryId: string) => {
  try {
    console.log('removeBookFromLibrary - Removing:', libraryId);
    const response = await axios.delete(`${API_URL}/library/${libraryId}`);
    console.log('removeBookFromLibrary - Success');
    return response.data;
  } catch (error: any) {
    console.error('removeBookFromLibrary - ERROR:', error.response?.data || error.message);
    throw error;
  }
};