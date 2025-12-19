import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MoreBooksScreen() {
  const router = useRouter();

  // Mock recommended books - will be replaced with algorithm data
  const recommendedBooks = [
    { id: 201, title: 'Book Title 1', author: 'Author Name', rating: 4 },
    { id: 202, title: 'Book Title 2', author: 'Author Name', rating: 5 },
    { id: 203, title: 'Book Title 3', author: 'Author Name', rating: 3 },
    { id: 204, title: 'Book Title 4', author: 'Author Name', rating: 4 },
    { id: 205, title: 'Book Title 5', author: 'Author Name', rating: 5 },
    { id: 206, title: 'Book Title 6', author: 'Author Name', rating: 4 },
    { id: 207, title: 'Book Title 7', author: 'Author Name', rating: 3 },
    { id: 208, title: 'Book Title 8', author: 'Author Name', rating: 5 },
    { id: 209, title: 'Book Title 9', author: 'Author Name', rating: 4 },
    { id: 210, title: 'Book Title 10', author: 'Author Name', rating: 5 },
  ];

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

      {/* Page Title */}
      <View style={styles.titleBar}>
        <Text style={styles.pageTitle}>Recommended Books</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Based on your reading history and favorite genres
        </Text>

        {recommendedBooks.map((book) => (
          <TouchableOpacity 
            key={book.id} 
            style={styles.bookCard}
            onPress={() => router.push(`/book/${book.id}`)}
          >
            <View style={styles.bookCover}>
              <Text style={styles.bookCoverText}>Book Cover Image</Text>
            </View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= book.rating ? "star" : "star-outline"}
                    size={16}
                    color="#7BA591"
                  />
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  titleBar: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7F4EF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    color: '#F7F4EF',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
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
    padding: 4,
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