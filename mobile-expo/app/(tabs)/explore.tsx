import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'books' | 'people'>('books');
  const [books, setBooks] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock recent searches
  const recentSearches = ['Margaret Atwood', 'Fourth Wing'];

  // Mock popular genres
  const genres = ['Fiction', 'Romance', 'Mystery', 'Sci-Fi', 'Fantasy'];

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

  const searchPeople = async () => {
    if (!searchQuery.trim()) return;

    // TODO: Connect to real API for user search
    // Mock data for now
    setPeople([
      { id: 1, username: '@reader123', displayName: 'Book Lover', followers: 245 },
      { id: 2, username: '@bookworm', displayName: 'Jane Doe', followers: 789 },
    ]);
  };

  const handleSearch = () => {
    if (searchType === 'books') {
      searchBooks();
    } else {
      searchPeople();
    }
  };

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
            <Ionicons name="search" size={28} color="#7BA591" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
            <Ionicons name="settings-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Type Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, searchType === 'books' && styles.toggleButtonActive]}
          onPress={() => setSearchType('books')}
        >
          <Ionicons 
            name="book-outline" 
            size={20} 
            color={searchType === 'books' ? '#F7F4EF' : '#7BA591'} 
          />
          <Text style={[styles.toggleText, searchType === 'books' && styles.toggleTextActive]}>
            Books
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, searchType === 'people' && styles.toggleButtonActive]}
          onPress={() => setSearchType('people')}
        >
          <Ionicons 
            name="people-outline" 
            size={20} 
            color={searchType === 'people' ? '#F7F4EF' : '#7BA591'} 
          />
          <Text style={[styles.toggleText, searchType === 'people' && styles.toggleTextActive]}>
            People
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={searchType === 'books' ? 'Search for books...' : 'Search for readers...'}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Show recent searches and genres when not searching */}
        {!loading && books.length === 0 && people.length === 0 && (
          <>
            {/* Recent Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.recentItem}
                  onPress={() => setSearchQuery(search)}
                >
                  <Ionicons name="time-outline" size={20} color="#F7F4EF" opacity={0.6} />
                  <Text style={styles.recentText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Genres - Only show for books */}
            {searchType === 'books' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Genres</Text>
                <View style={styles.genresGrid}>
                  {genres.map((genre, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.genreChip}
                      onPress={() => setSearchQuery(genre)}
                    >
                      <Text style={styles.genreText}>{genre}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Loading State */}
        {loading && <Text style={styles.loadingText}>Searching...</Text>}

        {/* Book Results */}
        {searchType === 'books' && books.length > 0 && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Results</Text>
            {books.map((book, index) => (
              <TouchableOpacity
                key={index}
                style={styles.bookCard}
                onPress={() => router.push(`/book/${index + 1}`)}
              >
                {book.cover_url ? (
                  <Image source={{ uri: book.cover_url }} style={styles.bookCover} />
                ) : (
                  <View style={styles.bookCover}>
                    <Text style={styles.bookCoverText}>No Cover</Text>
                  </View>
                )}
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                  {book.publication_year && (
                    <Text style={styles.bookYear}>{book.publication_year}</Text>
                  )}
                  <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons key={star} name="star-outline" size={14} color="#7BA591" />
                    ))}
                  </View>
                  <Text style={styles.reviewCount}>Reviews (...)</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* People Results */}
        {searchType === 'people' && people.length > 0 && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Results</Text>
            {people.map((person) => (
              <TouchableOpacity
  key={person.id}
  style={styles.personCard}
  onPress={() => router.push(`/user/${person.id}`)}
>
                <View style={styles.personAvatar}>
                  <Ionicons name="person" size={32} color="#F7F4EF" />
                </View>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{person.displayName}</Text>
                  <Text style={styles.personUsername}>{person.username}</Text>
                  <Text style={styles.personFollowers}>{person.followers} followers</Text>
                </View>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!loading && searchQuery && books.length === 0 && people.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#4A5568" />
            <Text style={styles.emptyText}>No results found</Text>
            <Text style={styles.emptySubtext}>Try different keywords</Text>
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
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#4A5568',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#7BA591',
  },
  toggleText: {
    color: '#7BA591',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#F7F4EF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F7F4EF',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  recentText: {
    color: '#F7F4EF',
    fontSize: 16,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreChip: {
    backgroundColor: '#4A5568',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  genreText: {
    color: '#F7F4EF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    color: '#F7F4EF',
    textAlign: 'center',
    padding: 40,
    fontSize: 16,
  },
  results: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
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
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCoverText: {
    color: '#F7F4EF',
    fontSize: 10,
    opacity: 0.5,
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
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 4,
  },
  bookYear: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 12,
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  reviewCount: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 12,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  personAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  personUsername: {
    color: '#7BA591',
    fontSize: 14,
    marginBottom: 4,
  },
  personFollowers: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 12,
  },
  followButton: {
    backgroundColor: '#7BA591',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  followButtonText: {
    color: '#F7F4EF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#F7F4EF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 14,
    marginTop: 8,
  },
  spacer: {
    height: 40,
  },
});