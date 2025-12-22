import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

const API_URL = 'http://192.168.101.22:3000/api';

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState<any>(null);
  const [libraryEntry, setLibraryEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [userReview, setUserReview] = useState<any>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId && id) {
      loadBookDetails();
    }
  }, [userId, id]);

  const getUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('@tometrack_user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.id);
      }
    } catch (error) {
      console.error('Get user ID error:', error);
    }
  };

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      
      const bookResponse = await axios.get(`${API_URL}/books/${id}`);
      console.log('Book details:', bookResponse.data);
      setBook(bookResponse.data);

      if (userId) {
        try {
          const libraryResponse = await axios.get(`${API_URL}/library/${userId}`);
          const userBook = libraryResponse.data.library.find((item: any) => item.book_id === id);
          setLibraryEntry(userBook || null);
        } catch (error) {
          console.log('Book not in library yet');
        }

        await loadUserReview();
      }
    } catch (error: any) {
      console.error('Load book error:', error.response?.data || error);
      Alert.alert('Error', 'Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const loadUserReview = async () => {
    if (!userId || !id) return;

    try {
      const response = await axios.get(`${API_URL}/reviews/user/${userId}/book/${id}`);
      setUserReview(response.data.review);
      setRating(response.data.review.rating || 0);
      setReviewText(response.data.review.review_text || '');
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Load review error:', error);
      }
    }
  };

  const handleAddToLibrary = async (status: string) => {
    if (!userId) {
      Alert.alert('Error', 'Please log in to add books');
      return;
    }

    try {
      await axios.post(`${API_URL}/library/add`, {
        user_id: userId,
        book_id: id,
        status: status
      });

      await loadBookDetails();
      setShowStatusMenu(false);
    } catch (error: any) {
      console.error('Add to library error:', error.response?.data || error);
      if (error.response?.data?.error === 'Book already in library') {
        Alert.alert('Already Added', 'This book is already in your library');
      } else {
        Alert.alert('Error', 'Failed to add book to library');
      }
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!libraryEntry) return;

    try {
      await axios.put(`${API_URL}/library/update/${libraryEntry.library_id}`, {
        status: newStatus
      });

      await loadBookDetails();
      setShowStatusMenu(false);
    } catch (error: any) {
      console.error('Update status error:', error.response?.data || error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleRemoveFromLibrary = async () => {
    if (!libraryEntry) return;

    Alert.alert(
      'Remove Book',
      'Are you sure you want to remove this book from your library?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/library/remove/${libraryEntry.library_id}`);
              setLibraryEntry(null);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove book');
            }
          }
        }
      ]
    );
  };

  const handleUpdateProgress = async () => {
    if (!libraryEntry || !currentPage) return;

    const pageNum = parseInt(currentPage);
    const totalPages = book.pages || 0;

    if (isNaN(pageNum) || pageNum < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid page number');
      return;
    }

    if (pageNum > totalPages) {
      Alert.alert('Invalid Input', `Page number cannot exceed ${totalPages}`);
      return;
    }

    try {
      const progressPercentage = totalPages > 0 ? Math.round((pageNum / totalPages) * 100) : 0;
      
      await axios.put(`${API_URL}/library/update/${libraryEntry.library_id}`, {
        progress_percentage: progressPercentage
      });

      if (progressPercentage >= 100) {
        await handleUpdateStatus('finished');
      }

      await loadBookDetails();
      setCurrentPage('');
      
    } catch (error: any) {
      console.error('Update progress error:', error.response?.data || error);
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  const handleQuickProgress = async (percentage: number) => {
    if (!libraryEntry) return;

    try {
      await axios.put(`${API_URL}/library/update/${libraryEntry.library_id}`, {
        progress_percentage: percentage
      });

      if (percentage >= 100) {
        await handleUpdateStatus('finished');
      } else {
        await loadBookDetails();
      }
      
    } catch (error: any) {
      console.error('Quick progress error:', error.response?.data || error);
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  const handleSaveReview = async () => {
    if (!userId || !id) return;

    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before saving');
      return;
    }

    try {
      await axios.post(`${API_URL}/reviews/add`, {
        user_id: userId,
        book_id: id,
        rating: rating,
        review_text: reviewText.trim()
      });

      await loadUserReview();
      setShowReviewForm(false);
    } catch (error: any) {
      console.error('Save review error:', error.response?.data || error);
      Alert.alert('Error', 'Failed to save review');
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete your review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/reviews/${userReview.id}`);
              setUserReview(null);
              setRating(0);
              setReviewText('');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete review');
            }
          }
        }
      ]
    );
  };

  const handleUploadFile = async () => {
    if (!libraryEntry) return;

    try {
      setUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/epub+zip', 'application/pdf', 'application/x-mobipocket-ebook', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setUploading(false);
        return;
      }

      const file = result.assets[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      
      const validExtensions = ['epub', 'pdf', 'mobi', 'txt', 'azw', 'azw3'];
      if (!validExtensions.includes(fileExtension)) {
        Alert.alert('Invalid File', 'Please upload an EPUB, PDF, MOBI, or TXT file');
        setUploading(false);
        return;
      }

      await axios.post(`${API_URL}/library/upload-file/${libraryEntry.library_id}`, {
        file_path: file.uri,
        file_format: fileExtension,
        file_size: file.size
      });

      await loadBookDetails();
      
    } catch (error: any) {
      console.error('Upload file error:', error.response?.data || error);
      Alert.alert('Error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = async () => {
    if (!libraryEntry) return;

    Alert.alert(
      'Remove File',
      'Are you sure you want to remove this file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/library/remove-file/${libraryEntry.library_id}`);
              await loadBookDetails();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove file');
            }
          }
        }
      ]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderStarRating = (interactive: boolean = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => interactive && setRating(i)}
          disabled={!interactive}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={interactive ? 32 : 20}
            color="#FFD700"
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starRating}>{stars}</View>;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'want_to_read': return 'Want to Read';
      case 'reading': return 'Currently Reading';
      case 'finished': return 'Finished';
      case 'dnf': return 'DNF';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'want_to_read': return 'bookmark-outline';
      case 'reading': return 'book-outline';
      case 'finished': return 'checkmark-circle-outline';
      case 'dnf': return 'close-circle-outline';
      default: return 'bookmark-outline';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={18} color="#FFD700" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={18} color="#FFD700" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={18} color="#FFD700" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
          </TouchableOpacity>
          <Text style={styles.logo}>TomeTrack</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7BA591" />
          <Text style={styles.loadingText}>Loading book...</Text>
        </View>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
          </TouchableOpacity>
          <Text style={styles.logo}>TomeTrack</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#F7F4EF" opacity={0.3} />
          <Text style={styles.errorText}>Book not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.logo}>TomeTrack</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color="#F7F4EF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {book.cover_image_url ? (
            <Image
              source={{ uri: book.cover_image_url }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="book-outline" size={64} color="#F7F4EF" opacity={0.3} />
              <Text style={styles.noCoverText}>No Cover</Text>
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
            
            {book.rating && parseFloat(book.rating) > 0 && (
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>{renderStars(parseFloat(book.rating))}</View>
                <Text style={styles.ratingText}>
                  {parseFloat(book.rating).toFixed(1)} ({book.ratings_count || 0} ratings)
                </Text>
              </View>
            )}

            {book.publication_year && (
              <Text style={styles.year}>Published {book.publication_year}</Text>
            )}
            {book.pages && (
              <Text style={styles.pages}>{book.pages} pages</Text>
            )}
          </View>
        </View>

        <View style={styles.actionButtons}>
          {libraryEntry ? (
            <>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => setShowStatusMenu(!showStatusMenu)}
              >
                <Ionicons 
                  name={getStatusIcon(libraryEntry.status)} 
                  size={20} 
                  color="#F7F4EF" 
                />
                <Text style={styles.statusButtonText}>
                  {getStatusLabel(libraryEntry.status)}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#F7F4EF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveFromLibrary}
              >
                <Ionicons name="trash-outline" size={20} color="#F7F4EF" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowStatusMenu(!showStatusMenu)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#F7F4EF" />
              <Text style={styles.addButtonText}>Add to Library</Text>
            </TouchableOpacity>
          )}
        </View>

        {showStatusMenu && (
          <View style={styles.statusMenu}>
            <TouchableOpacity
              style={styles.statusMenuItem}
              onPress={() => libraryEntry ? handleUpdateStatus('want_to_read') : handleAddToLibrary('want_to_read')}
            >
              <Ionicons name="bookmark-outline" size={20} color="#F7F4EF" />
              <Text style={styles.statusMenuText}>Want to Read</Text>
              {libraryEntry?.status === 'want_to_read' && (
                <Ionicons name="checkmark" size={20} color="#7BA591" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statusMenuItem}
              onPress={() => libraryEntry ? handleUpdateStatus('reading') : handleAddToLibrary('reading')}
            >
              <Ionicons name="book-outline" size={20} color="#F7F4EF" />
              <Text style={styles.statusMenuText}>Currently Reading</Text>
              {libraryEntry?.status === 'reading' && (
                <Ionicons name="checkmark" size={20} color="#7BA591" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statusMenuItem}
              onPress={() => libraryEntry ? handleUpdateStatus('finished') : handleAddToLibrary('finished')}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#F7F4EF" />
              <Text style={styles.statusMenuText}>Finished</Text>
              {libraryEntry?.status === 'finished' && (
                <Ionicons name="checkmark" size={20} color="#7BA591" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statusMenuItem}
              onPress={() => libraryEntry ? handleUpdateStatus('dnf') : handleAddToLibrary('dnf')}
            >
              <Ionicons name="close-circle-outline" size={20} color="#F7F4EF" />
              <Text style={styles.statusMenuText}>Did Not Finish (DNF)</Text>
              {libraryEntry?.status === 'dnf' && (
                <Ionicons name="checkmark" size={20} color="#7BA591" />
              )}
            </TouchableOpacity>
          </View>
        )}

        {book.synopsis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synopsis</Text>
            <Text style={styles.synopsis}>{book.synopsis}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsGrid}>
            {book.publisher && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Publisher</Text>
                <Text style={styles.detailValue}>{book.publisher}</Text>
              </View>
            )}
            {book.publication_year && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Published</Text>
                <Text style={styles.detailValue}>{book.publication_year}</Text>
              </View>
            )}
            {book.pages && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Pages</Text>
                <Text style={styles.detailValue}>{book.pages}</Text>
              </View>
            )}
          </View>
        </View>

        {libraryEntry && libraryEntry.status === 'reading' && (
          <View style={styles.progressSection}>
            <Text style={styles.progressSectionTitle}>Reading Progress</Text>
            
            <View style={styles.currentProgress}>
              <View style={styles.progressBarLarge}>
                <View style={[styles.progressFillLarge, { width: `${libraryEntry.progress_percentage || 0}%` }]} />
              </View>
              <Text style={styles.progressPercentageText}>
                {libraryEntry.progress_percentage || 0}% Complete
              </Text>
            </View>

            <View style={styles.updateProgressForm}>
              <Text style={styles.formLabel}>Update your progress:</Text>
              
              <View style={styles.progressInputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Current Page</Text>
                  <TextInput
                    style={styles.progressInput}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor="#999"
                    value={currentPage}
                    onChangeText={setCurrentPage}
                  />
                </View>
                
                <Text style={styles.inputSeparator}>of</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Total Pages</Text>
                  <Text style={styles.totalPagesText}>{book.pages || '?'}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.updateProgressButton}
                onPress={handleUpdateProgress}
              >
                <Ionicons name="checkmark-circle" size={20} color="#F7F4EF" />
                <Text style={styles.updateProgressText}>Update Progress</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickProgressButtons}>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => handleQuickProgress(25)}
              >
                <Text style={styles.quickButtonText}>25%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => handleQuickProgress(50)}
              >
                <Text style={styles.quickButtonText}>50%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => handleQuickProgress(75)}
              >
                <Text style={styles.quickButtonText}>75%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => handleQuickProgress(100)}
              >
                <Text style={styles.quickButtonText}>Finished</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {libraryEntry && (
          <TouchableOpacity
            style={styles.startReadingButton}
            onPress={() => router.push(`/reader/${id}`)}
          >
            <Ionicons name="book" size={20} color="#F7F4EF" />
            <Text style={styles.startReadingText}>
              {libraryEntry.status === 'reading' ? 'Continue Reading' : 'Start Reading'}
            </Text>
          </TouchableOpacity>
        )}

        {libraryEntry && (
          <View style={styles.fileSection}>
            <Text style={styles.fileSectionTitle}>Ebook File</Text>
            
            {libraryEntry.file_path ? (
              <View style={styles.fileDisplay}>
                <View style={styles.fileInfo}>
                  <View style={styles.fileIconContainer}>
                    <Ionicons name="document-text" size={32} color="#7BA591" />
                  </View>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName}>
                      {book.title}.{libraryEntry.file_format}
                    </Text>
                    <Text style={styles.fileFormat}>
                      {libraryEntry.file_format?.toUpperCase()} 
                      {libraryEntry.file_size && ` • ${formatFileSize(libraryEntry.file_size)}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.fileActions}>
                  <TouchableOpacity
                    style={styles.replaceFileButton}
                    onPress={handleUploadFile}
                    disabled={uploading}
                  >
                    <Ionicons name="swap-horizontal" size={18} color="#F7F4EF" />
                    <Text style={styles.replaceFileText}>Replace</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeFileButton}
                    onPress={handleRemoveFile}
                  >
                    <Ionicons name="trash-outline" size={18} color="#F7F4EF" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUploadFile}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#F7F4EF" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={24} color="#F7F4EF" />
                    <Text style={styles.uploadButtonText}>Upload Ebook File</Text>
                    <Text style={styles.uploadButtonSubtext}>EPUB, PDF, MOBI, TXT</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {libraryEntry && (
          <View style={styles.reviewSection}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewSectionTitle}>My Review</Text>
              {userReview && !showReviewForm && (
                <View style={styles.reviewActions}>
                  <TouchableOpacity onPress={() => setShowReviewForm(true)}>
                    <Ionicons name="pencil" size={20} color="#7BA591" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDeleteReview}>
                    <Ionicons name="trash-outline" size={20} color="#F7F4EF" opacity={0.6} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {showReviewForm ? (
              <View style={styles.reviewForm}>
                <Text style={styles.formLabel}>Your Rating</Text>
                {renderStarRating(true)}

                <Text style={styles.formLabel}>Your Review (Optional)</Text>
                <TextInput
                  style={styles.reviewInput}
                  multiline
                  numberOfLines={6}
                  placeholder="Share your thoughts about this book..."
                  placeholderTextColor="#999"
                  value={reviewText}
                  onChangeText={setReviewText}
                  textAlignVertical="top"
                />

                <View style={styles.reviewFormButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowReviewForm(false);
                      if (userReview) {
                        setRating(userReview.rating || 0);
                        setReviewText(userReview.review_text || '');
                      } else {
                        setRating(0);
                        setReviewText('');
                      }
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveReviewButton}
                    onPress={handleSaveReview}
                  >
                    <Ionicons name="checkmark-circle" size={20} color="#F7F4EF" />
                    <Text style={styles.saveReviewText}>Save Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : userReview ? (
              <View style={styles.reviewDisplay}>
                {renderStarRating(false)}
                {userReview.review_text && (
                  <Text style={styles.reviewDisplayText}>{userReview.review_text}</Text>
                )}
                <Text style={styles.reviewDate}>
                  Reviewed on {new Date(userReview.created_at).toLocaleDateString()}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addReviewButton}
                onPress={() => setShowReviewForm(true)}
              >
                <Ionicons name="add-circle-outline" size={20} color="#F7F4EF" />
                <Text style={styles.addReviewText}>Add a Review</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#2C3E50',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#F7F4EF',
    fontSize: 16,
    marginTop: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#F7F4EF',
    fontSize: 18,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  coverPlaceholder: {
    width: 120,
    height: 180,
    backgroundColor: '#4A5568',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCoverText: {
    color: '#F7F4EF',
    fontSize: 12,
    opacity: 0.5,
    marginTop: 8,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#7BA591',
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 4,
  },
  ratingText: {
    color: '#F7F4EF',
    fontSize: 13,
    opacity: 0.7,
  },
  year: {
    fontSize: 14,
    color: '#F7F4EF',
    opacity: 0.6,
    marginBottom: 4,
  },
  pages: {
    fontSize: 14,
    color: '#F7F4EF',
    opacity: 0.6,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#7BA591',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  removeButton: {
    width: 50,
    backgroundColor: '#4A5568',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#7BA591',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusMenu: {
    backgroundColor: '#4A5568',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  statusMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3E50',
  },
  statusMenuText: {
    flex: 1,
    color: '#F7F4EF',
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7F4EF',
    marginBottom: 12,
  },
  synopsis: {
    fontSize: 15,
    lineHeight: 24,
    color: '#F7F4EF',
    opacity: 0.8,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#F7F4EF',
    opacity: 0.6,
  },
  detailValue: {
    fontSize: 14,
    color: '#F7F4EF',
    fontWeight: '500',
  },
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#4A5568',
    borderRadius: 12,
  },
  progressSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7F4EF',
    marginBottom: 16,
  },
  currentProgress: {
    marginBottom: 20,
  },
  progressBarLarge: {
    height: 12,
    backgroundColor: '#2C3E50',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFillLarge: {
    height: '100%',
    backgroundColor: '#7BA591',
  },
  progressPercentageText: {
    color: '#7BA591',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  updateProgressForm: {
    backgroundColor: '#2C3E50',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  formLabel: {
    color: '#F7F4EF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  inputGroup: {
    alignItems: 'center',
  },
  inputLabel: {
    color: '#F7F4EF',
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  progressInput: {
    backgroundColor: '#4A5568',
    color: '#F7F4EF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  inputSeparator: {
    color: '#F7F4EF',
    fontSize: 18,
    opacity: 0.5,
    marginBottom: 12,
  },
  totalPagesText: {
    color: '#7BA591',
    fontSize: 24,
    fontWeight: 'bold',
  },
  updateProgressButton: {
    flexDirection: 'row',
    backgroundColor: '#7BA591',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  updateProgressText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  quickProgressButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickButton: {
    flex: 1,
    backgroundColor: '#2C3E50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickButtonText: {
    color: '#F7F4EF',
    fontSize: 13,
    fontWeight: '600',
  },
  startReadingButton: {
    flexDirection: 'row',
    backgroundColor: '#7BA591',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startReadingText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  fileSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#4A5568',
    borderRadius: 12,
  },
  fileSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7F4EF',
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButtonSubtext: {
    color: '#F7F4EF',
    fontSize: 12,
    opacity: 0.6,
  },
  fileDisplay: {
    gap: 16,
  },
  fileInfo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  fileIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileFormat: {
    color: '#7BA591',
    fontSize: 13,
    fontWeight: '600',
  },
  fileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  replaceFileButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#7BA591',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  replaceFileText: {
    color: '#F7F4EF',
    fontSize: 14,
    fontWeight: '600',
  },
  removeFileButton: {
    width: 50,
    backgroundColor: '#2C3E50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#4A5568',
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7F4EF',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  reviewForm: {
    gap: 16,
  },
  starRating: {
    flexDirection: 'row',
    gap: 8,
  },
  reviewInput: {
    backgroundColor: '#2C3E50',
    color: '#F7F4EF',
    fontSize: 15,
    padding: 16,
    borderRadius: 8,
    minHeight: 120,
  },
  reviewFormButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2C3E50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveReviewButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#7BA591',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveReviewText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewDisplay: {
    gap: 12,
  },
  reviewDisplayText: {
    color: '#F7F4EF',
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  reviewDate: {
    color: '#F7F4EF',
    fontSize: 12,
    opacity: 0.5,
  },
  addReviewButton: {
    flexDirection: 'row',
    backgroundColor: '#2C3E50',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addReviewText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 40,
  },
});