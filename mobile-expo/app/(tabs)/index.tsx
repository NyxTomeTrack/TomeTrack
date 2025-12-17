import { StyleSheet, TextInput, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.101.22:3000/api/books/search?q=${searchQuery}`);
      setBooks(response.data.books || []);
    } catch (error) {
      alert('Search failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Books</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for books..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchBooks}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchBooks}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && <Text style={styles.loadingText}>Searching...</Text>}

      <FlatList
        data={books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookCard}>
            {item.cover_url && (
              <Image source={{ uri: item.cover_url }} style={styles.bookCover} />
            )}
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
              {item.publication_year && (
                <Text style={styles.bookYear}>{item.publication_year}</Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          !loading && books.length === 0 ? (
            <Text style={styles.emptyText}>
              {searchQuery ? 'No books found' : 'Search for books to get started'}
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#4A5568',
    color: '#F7F4EF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#7BA591',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  searchButtonText: {
    color: '#F7F4EF',
    fontWeight: '600',
  },
  loadingText: {
    color: '#F7F4EF',
    textAlign: 'center',
    padding: 20,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#4A5568',
    margin: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 12,
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 4,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
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
    opacity: 0.8,
    fontSize: 14,
  },
  bookYear: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#F7F4EF',
    opacity: 0.6,
    textAlign: 'center',
    padding: 40,
    fontSize: 16,
  },
});