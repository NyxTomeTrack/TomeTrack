import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.174:3000/api';

export default function HomeScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [currentlyReading, setCurrentlyReading] = useState<any[]>([]);
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      loadHomeData();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@tometrack_user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.id);
        setUserName(user.display_name || user.username || 'Reader');
      }
    } catch (error) {
      console.error('Load user data error:', error);
    }
  };

  const loadHomeData = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Get token from storage
      const token = await AsyncStorage.getItem('@tometrack_token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Load currently reading books
      const readingResponse = await axios.get(`${API_URL}/library/${userId}?status=reading`, config);
      setCurrentlyReading(readingResponse.data.library || []);

      // Load all books sorted by most recent
      const libraryResponse = await axios.get(`${API_URL}/library/${userId}`, config);
      setRecentBooks((libraryResponse.data.library || []).slice(0, 5));

      // Load stats
      const statsResponse = await axios.get(`${API_URL}/library/stats/${userId}`, config);
      setStats(statsResponse.data.stats);

    } catch (error) {
      console.error('Load home data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.logo}>TomeTrack</Text>
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
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7BA591" />
        }
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getGreeting()}, {userName}!</Text>
          <Text style={styles.subGreeting}>Ready to dive into your next chapter?</Text>
        </View>

        {/* Quick Stats */}
        {stats && (
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="book" size={24} color="#7BA591" />
              <Text style={styles.statNumber}>{stats.reading_count || 0}</Text>
              <Text style={styles.statLabel}>Reading</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#7BA591" />
              <Text style={styles.statNumber}>{stats.finished_count || 0}</Text>
              <Text style={styles.statLabel}>Finished</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="bookmark" size={24} color="#7BA591" />
              <Text style={styles.statNumber}>{stats.want_to_read_count || 0}</Text>
              <Text style={styles.statLabel}>To Read</Text>
            </View>
          </View>
        )}

        {/* Currently Reading */}
        {currentlyReading.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Currently Reading</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/library')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {currentlyReading.map((book) => (
              <TouchableOpacity
                key={book.library_id}
                style={styles.readingCard}
                onPress={() => router.push(`/book/${book.book_id}`)}
              >
                {book.cover_image_url ? (
                  <Image
                    source={{ uri: book.cover_image_url }}
                    style={styles.readingCover}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.readingCover}>
                    <Ionicons name="book-outline" size={32} color="#F7F4EF" opacity={0.3} />
                  </View>
                )}

                <View style={styles.readingInfo}>
                  <Text style={styles.readingTitle} numberOfLines={2}>
                    {book.title}
                  </Text>
                  <Text style={styles.readingAuthor} numberOfLines={1}>
                    {book.author}
                  </Text>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${book.progress_percentage || 0}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {book.progress_percentage || 0}%
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => router.push(`/reader/${book.book_id}`)}
                  >
                    <Ionicons name="play-circle" size={16} color="#F7F4EF" />
                    <Text style={styles.continueButtonText}>Continue Reading</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Activity */}
        {recentBooks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/library')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentBooks.map((book) => (
                <TouchableOpacity
                  key={book.library_id}
                  style={styles.recentBookCard}
                  onPress={() => router.push(`/book/${book.book_id}`)}
                >
                  {book.cover_image_url ? (
                    <Image
                      source={{ uri: book.cover_image_url }}
                      style={styles.recentCover}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.recentCover}>
                      <Ionicons name="book-outline" size={40} color="#F7F4EF" opacity={0.3} />
                    </View>
                  )}
                  <Text style={styles.recentTitle} numberOfLines={2}>
                    {book.title}
                  </Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {book.status === 'want_to_read' && 'To Read'}
                      {book.status === 'reading' && 'Reading'}
                      {book.status === 'finished' && 'Finished'}
                      {book.status === 'dnf' && 'DNF'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Empty State */}
        {!loading && currentlyReading.length === 0 && recentBooks.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="library-outline" size={80} color="#4A5568" />
            <Text style={styles.emptyTitle}>Start Your Reading Journey</Text>
            <Text style={styles.emptySubtext}>
              Search for books and build your personal library
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Ionicons name="search" size={20} color="#F7F4EF" />
              <Text style={styles.exploreButtonText}>Explore Books</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Ionicons name="search" size={24} color="#7BA591" />
            <Text style={styles.quickActionText}>Find Books</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/library')}
          >
            <Ionicons name="library" size={24} color="#7BA591" />
            <Text style={styles.quickActionText}>My Library</Text>
          </TouchableOpacity>
        </View>

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
  content: {
    flex: 1,
  },
  greetingSection: {
    padding: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#F7F4EF',
    opacity: 0.7,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#4A5568',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2C3E50',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#F7F4EF',
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#7BA591',
    fontWeight: '600',
  },
  readingCard: {
    flexDirection: 'row',
    backgroundColor: '#4A5568',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  readingCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readingInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  readingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7F4EF',
    marginBottom: 4,
  },
  readingAuthor: {
    fontSize: 14,
    color: '#F7F4EF',
    opacity: 0.7,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#2C3E50',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7BA591',
  },
  progressText: {
    fontSize: 14,
    color: '#7BA591',
    fontWeight: '600',
    width: 45,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#7BA591',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  continueButtonText: {
    color: '#F7F4EF',
    fontSize: 14,
    fontWeight: '600',
  },
  recentBookCard: {
    width: 120,
    marginLeft: 20,
  },
  recentCover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#4A5568',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F7F4EF',
    marginBottom: 6,
    height: 36,
  },
  statusBadge: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: '#7BA591',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#F7F4EF',
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    backgroundColor: '#7BA591',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#4A5568',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#F7F4EF',
    fontSize: 14,
    fontWeight: '600',
  },
  spacer: {
    height: 40,
  },
});