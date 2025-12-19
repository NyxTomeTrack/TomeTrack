import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function BookDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // All state declarations together
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [hasFile, setHasFile] = useState(false);

  // Mock data
  const book = {
    title: 'Title of Book',
    author: 'Author',
    rating: 4.2,
    reviewCount: 1200,
    coverUrl: null,
    synopsis: 'Synopsis text goes here spanning multiple lines as needed...',
    published: '2023',
    pages: 342,
    isbn: '123-4567890',
    genres: ['Fiction', 'Mystery'],
  };

  const reviews = [
    { id: 1, username: '@Reviewer', rating: 5, text: '......' },
  ];

  // All handlers together
  const handleAddToLibrary = () => {
    setShowStatusMenu(true);
  };

  const handleStatusSelect = (status: string) => {
  setShowStatusMenu(false);
  
  // Navigate to library screen (silent - no alert)
  router.push('/(tabs)/library');
};

  const handleStartReading = () => {
    if (hasFile) {
      router.push(`/reader/${id}`);
    } else {
      setShowFileUpload(true);
    }
  };

  const handleFileUpload = () => {
  // Simulate file upload
  setHasFile(true);
  setShowFileUpload(false);
  router.push(`/reader/${id}`);
};

  // ONE return statement with ALL JSX
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
          <Text style={styles.logo}>TomeTrack</Text>
        </TouchableOpacity>
        <View style={styles.topIcons}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="person-circle-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/library')}>
            <Ionicons name="library-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
            <Ionicons name="search-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
            <Ionicons name="settings-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Book Header */}
        <View style={styles.header}>
          <View style={styles.bookCover}>
            <Text style={styles.bookCoverText}>Book Cover Image</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionLabel}>Rating</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= Math.floor(book.rating) ? "star" : "star-outline"}
                size={20}
                color="#7BA591"
              />
            ))}
          </View>
          <Text style={styles.reviewCount}>Reviews</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddToLibrary}>
            <Text style={styles.primaryButtonText}>Add to Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleStartReading}>
            <Text style={styles.secondaryButtonText}>Start Reading</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.synopsis}>{book.synopsis}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.detailText}>Published: {book.published}</Text>
          <Text style={styles.detailText}>Pages: {book.pages}</Text>
          <Text style={styles.detailText}>ISBN: {book.isbn}</Text>
        </View>

        {/* Genres Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genres:</Text>
          <View style={styles.genresList}>
            {book.genres.map((genre, index) => (
              <Text key={index} style={styles.genreText}>{genre}</Text>
            ))}
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <Text style={styles.reviewCount}>{book.reviewCount}k</Text>
          
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <Text style={styles.reviewUsername}>{review.username}</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= review.rating ? "star" : "star-outline"}
                    size={16}
                    color="#7BA591"
                  />
                ))}
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
        </View>

        {/* Discussions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discussions (45)</Text>
        </View>
      </ScrollView>

      {/* Status Selection Modal */}
      {showStatusMenu && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Library</Text>
              <TouchableOpacity onPress={() => setShowStatusMenu(false)}>
                <Ionicons name="close" size={24} color="#F7F4EF" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.statusOption} onPress={() => handleStatusSelect('Read')}>
              <Text style={styles.statusText}>Read</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statusOption} onPress={() => handleStatusSelect('Busy Reading')}>
              <Text style={styles.statusText}>Busy Reading</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statusOption} onPress={() => handleStatusSelect('TBR')}>
              <Text style={styles.statusText}>TBR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.statusOption} onPress={() => handleStatusSelect('DNF')}>
              <Text style={styles.statusText}>DNF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowStatusMenu(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* File Upload Modal */}
      {showFileUpload && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Book File</Text>
              <TouchableOpacity onPress={() => setShowFileUpload(false)}>
                <Ionicons name="close" size={24} color="#F7F4EF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.uploadText}>
              To read this book, please upload your personal copy
            </Text>

            <View style={styles.uploadOptions}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
                <Ionicons name="cloud-upload-outline" size={32} color="#F7F4EF" />
                <Text style={styles.uploadButtonText}>Upload from Device</Text>
                <Text style={styles.uploadHint}>EPUB, PDF, MOBI</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
                <Ionicons name="logo-google" size={32} color="#F7F4EF" />
                <Text style={styles.uploadButtonText}>Connect Google Drive</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
                <Ionicons name="cloud-outline" size={32} color="#F7F4EF" />
                <Text style={styles.uploadButtonText}>Connect Dropbox</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.disclaimer}>
              Your files stay on your device. TomeTrack never hosts your books.
            </Text>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowFileUpload(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
  },
  topIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  bookCover: {
    width: 150,
    height: 225,
    backgroundColor: '#4A5568',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCoverText: {
    color: '#F7F4EF',
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
  },
  headerInfo: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7F4EF',
    textAlign: 'center',
    marginBottom: 4,
  },
  author: {
    fontSize: 18,
    color: '#F7F4EF',
    opacity: 0.8,
  },
  ratingSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionLabel: {
    color: '#F7F4EF',
    fontSize: 16,
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  reviewCount: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 14,
  },
  actionButtons: {
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#7BA591',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#7BA591',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 12,
  },
  synopsis: {
    color: '#F7F4EF',
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 20,
  },
  detailText: {
    color: '#F7F4EF',
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 6,
  },
  genresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreText: {
    color: '#F7F4EF',
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewUsername: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewText: {
    color: '#F7F4EF',
    opacity: 0.8,
    fontSize: 14,
    marginTop: 8,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2C3E50',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
  },
  statusOption: {
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  statusText: {
    color: '#F7F4EF',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 12,
  },
  cancelText: {
    color: '#5C9EAD',
    fontSize: 16,
  },
  uploadText: {
    color: '#F7F4EF',
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 24,
  },
  uploadOptions: {
    gap: 12,
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#4A5568',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadHint: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 12,
  },
  disclaimer: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
});