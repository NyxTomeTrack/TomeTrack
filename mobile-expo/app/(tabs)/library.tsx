import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { getUserLibrary } from '../../services/library';

export default function LibraryScreen() {
  const router = useRouter();
  const [library, setLibrary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load library when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadLibrary();
    }, [])
  );

  const loadLibrary = async () => {
    try {
      setLoading(true);
      console.log('Loading library...');
      const data = await getUserLibrary();
      console.log('Library data:', data);
      setLibrary(data);
    } catch (error) {
      console.error('Error loading library:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group books by status
  const currentlyReading = library.filter(book => book.status === 'currently_reading');
  const toRead = library.filter(book => book.status === 'to_read');
  const read = library.filter(book => book.status === 'read');
  const dnf = library.filter(book => book.status === 'dnf');

  const BookCard = ({ book }: any) => (
    <TouchableOpacity 
      style={styles.bookCard}
      onPress={() => router.push(`/book/${book.book_id}`)}
    >
      <View style={styles.bookCover}>
        <Text style={styles.bookCoverText}>Book Cover</Text>
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>Book ID: {book.book_id}</Text>
        <Text style={styles.bookAuthor}>Status: {book.status}</Text>
        {book.rating && (
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= book.rating ? "star" : "star-outline"}
                size={14}
                color="#7BA591"
              />
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const BookSection = ({ title, books, emptyMessage }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {books.length === 0 ? (
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      ) : (
        books.map((book: any) => <BookCard key={book.id} book={book} />)
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
            <Text style={styles.logo}>TomeTrack</Text>
          </TouchableOpacity>
          <View style={styles.topIcons}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Ionicons name="person-circle-outline" size={28} color="#F7F4EF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/library')}>
              <Ionicons name="library" size={28} color="#7BA591" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Ionicons name="search-outline" size={28} color="#F7F4EF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
              <Ionicons name="settings-outline" size={28} color="#F7F4EF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7BA591" />
        </View>
      </View>
    );
  }

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
            <Ionicons name="library" size={28} color="#7BA591" />
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
        <Text style={styles.pageTitle}>My Library</Text>

        {library.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#7BA591" opacity={0.5} />
            <Text style={styles.emptyStateTitle}>Your library is empty</Text>
            <Text style={styles.emptyStateText}>Start adding books to track your reading!</Text>
            <TouchableOpacity 
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Text style={styles.exploreButtonText}>Explore Books</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <BookSection 
              title="Currently Reading" 
              books={currentlyReading}
              emptyMessage="No books currently reading"
            />
            <BookSection 
              title="To Read" 
              books={toRead}
              emptyMessage="No books in your to-read list"
            />
            <BookSection 
              title="Read" 
              books={read}
              emptyMessage="No books marked as read"
            />
            <BookSection 
              title="Did Not Finish" 
              books={dnf}
              emptyMessage="No DNF books"
            />
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#F7F4EF',
    opacity: 0.7,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#7BA591',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 12,
  },
  emptyText: {
    color: '#F7F4EF',
    opacity: 0.5,
    fontSize: 14,
    fontStyle: 'italic',
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#4A5568',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  bookCover: {
    width: 60,
    height: 90,
    backgroundColor: '#2C3E50',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCoverText: {
    color: '#F7F4EF',
    fontSize: 10,
    opacity: 0.5,
    textAlign: 'center',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookAuthor: {
    color: '#F7F4EF',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
});