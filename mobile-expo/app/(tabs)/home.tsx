import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  // Mock data - we'll connect to real API later
  const recommendedBooks = [
    { id: 101, title: 'Book Title', author: 'Author Name', rating: 4 },
    { id: 202, title: 'Book Title', author: 'Author Name', rating: 5 },
    { id: 303, title: 'Book Title', author: 'Author Name', rating: 3 },
  ];

  const recommendedPeople = [
    { id: 1, username: 'User', action: 'Add' },
    { id: 2, username: 'User', action: 'Add' },
    { id: 3, username: 'User', action: 'Add' },
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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Recommended Books Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Books</Text>
            <View style={styles.divider} />
          </View>

          {recommendedBooks.map((book) => (
            <TouchableOpacity 
              key={book.id} 
              style={styles.bookItem}
              onPress={() => router.push(`/book/${book.id}`)}
            >
              <View style={styles.bookCover}>
                <Text style={styles.bookCoverText}>Book Cover Image</Text>
              </View>
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>Rate</Text>
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

          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreText}>More...</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended People Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended People</Text>
            <View style={styles.divider} />
          </View>

          {recommendedPeople.map((person) => (
            <TouchableOpacity 
              key={person.id} 
              style={styles.personItem}
              onPress={() => router.push(`/user/${person.id}`)}
            >
              <Text style={styles.personName}>{person.username}</Text>
              <View style={styles.personActions}>
                <TouchableOpacity onPress={(e) => {
                  e.stopPropagation();
                  alert('Follow user');
                }}>
                  <Text style={styles.actionText}>{person.action}</Text>
                </TouchableOpacity>
                <Text style={styles.actionSeparator}>|</Text>
                <TouchableOpacity onPress={(e) => {
                  e.stopPropagation();
                  alert('Ignore user');
                }}>
                  <Text style={styles.actionText}>Ignore</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreText}>More...</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#2C3E50',
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7F4EF',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F7F4EF',
    opacity: 0.3,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  bookCover: {
    width: 60,
    height: 90,
    backgroundColor: '#4A5568',
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
  personItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  personName: {
    color: '#F7F4EF',
    fontSize: 16,
  },
  personActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionText: {
    color: '#F7F4EF',
    fontSize: 14,
  },
  actionSeparator: {
    color: '#F7F4EF',
    opacity: 0.5,
  },
  moreButton: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  moreText: {
    color: '#F7F4EF',
    fontSize: 14,
    opacity: 0.7,
  },
});