import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LibraryScreen() {
  const router = useRouter();

  // Mock data - we'll connect to API later
  const busyReading = [
    { id: 1, title: 'Title of Book', author: 'Author', progress: 82, currentPage: 820, totalPages: 1000 },
  ];

  const read = [
    { id: 2, title: 'Title of Book', author: 'Author', progress: 100, currentPage: 1000, totalPages: 1000 },
  ];

  const tbr = [
    { id: 3, title: 'Title of Book', author: 'Author', progress: 0, currentPage: 0, totalPages: 1000 },
  ];

  const dnf = [
    { id: 4, title: 'Title of Book', author: 'Author', progress: 40, currentPage: 400, totalPages: 1000 },
  ];

  const BookCard = ({ book }: any) => (
    <TouchableOpacity 
      style={styles.bookCard}
      onPress={() => router.push(`/book/${book.id}`)}
    >
      <View style={styles.bookCover}>
        <Text style={styles.bookCoverText}>Book Cover Image</Text>
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
        <Text style={styles.bookStatus}>
          {book.progress === 100 ? 'Read' : 
           book.progress === 0 ? 'TBR' :
           book.progress > 0 && book.progress < 100 ? 'Busy Reading' : 'DNF'}
        </Text>
        <Text style={styles.bookProgress}>{book.progress}%</Text>
        <Text style={styles.bookPages}>{book.currentPage}/{book.totalPages} Pages</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name="star-outline"
              size={16}
              color="#7BA591"
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

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
        {/* Busy Reading Section */}
        {busyReading.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Busy Reading</Text>
            {busyReading.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </View>
        )}

        {/* Read Section */}
        {read.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Read</Text>
            {read.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </View>
        )}

        {/* TBR Section */}
        {tbr.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TBR</Text>
            {tbr.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </View>
        )}

        {/* DNF Section */}
        {dnf.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DNF</Text>
            {dnf.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </View>
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 16,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#4A5568',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  bookCover: {
    width: 80,
    height: 120,
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
    padding: 4,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F7F4EF',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#F7F4EF',
    opacity: 0.8,
  },
  bookStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7BA591',
    marginTop: 4,
  },
  bookProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F7F4EF',
  },
  bookPages: {
    fontSize: 12,
    color: '#F7F4EF',
    opacity: 0.7,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4,
  },
});