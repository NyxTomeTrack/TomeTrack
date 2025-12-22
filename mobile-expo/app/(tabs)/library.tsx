import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.101.22:3000/api';

export default function LibraryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'finished' | 'want_to_read' | 'dnf'>('all');
  const [library, setLibrary] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      loadLibrary();
      loadStats();
    }
  }, [userId]);

  const getUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('@tometrack_user');
      if (userData) {
        const user = JSON.parse(userData);
        console.log('Library - Got user ID:', user.id);
        setUserId(user.id);
      } else {
        console.log('Library - No user data found');
        Alert.alert('Error', 'Please log in again');
        router.replace('/login');
      }
    } catch (error) {
      console.error('Get user ID error:', error);
    }
  };

  const loadLibrary = async (status?: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      let url = `${API_URL}/library/${userId}`;
      if (status && status !== 'all') {
        url += `?status=${status}`;
      }

      console.log('Loading library from:', url);
      const response = await axios.get(url);
      console.log('Library response:', response.data);
      setLibrary(response.data.library || []);
    } catch (error: any) {
      console.error('Load library error:', error.response?.data || error);
      if (error.response?.status === 404) {
        setLibrary([]);
      } else {
        Alert.alert('Error', 'Failed to load library');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!userId) return;
    
    try {
      console.log('Loading stats for user:', userId);
      const response = await axios.get(`${API_URL}/library/stats/${userId}`);
      console.log('Stats response:', response.data);
      setStats(response.data.stats);
    } catch (error: any) {
      console.error('Load stats error:', error.response?.data || error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLibrary(activeTab === 'all' ? undefined : activeTab);
    await loadStats();
    setRefreshing(false);
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    loadLibrary(tab === 'all' ? undefined : tab);
  };

  const getFilteredBooks = () => {
    if (activeTab === 'all') return library;
    return library.filter(item => item.status === activeTab);
  };

  const renderBookCard = (item: any) => {
    const progressPercentage = item.progress_percentage || 0;
    
    return (
      <View key={item.library_id} style={styles.bookCard}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row', gap: 12 }}
          onPress={() => router.push(`/book/${item.book_id}`)}
        >
          {item.cover_image_url ? (
            <Image
              source={{ uri: item.cover_image_url }}
              style={styles.bookCover}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.bookCover}>
              <Ionicons name="book-outline" size={32} color="#F7F4EF" opacity={0.3} />
              <Text style={styles.noCoverText}>No Cover</Text>
            </View>
          )}

          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
            
            {item.status === 'reading' && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
                <Text style={styles.progressText}>{progressPercentage}%</Text>
              </View>
            )}

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {item.status === 'want_to_read' && 'Want to Read'}
                {item.status === 'reading' && 'Currently Reading'}
                {item.status === 'finished' && 'Finished'}
                {item.status === 'dnf' && 'DNF'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#F7F4EF" />
        </TouchableOpacity>
      </View>
    );
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
            <Ionicons name="library" size={28} color="#7BA591" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
            <Ionicons name="search-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Bar */}
      {stats && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.reading_count || 0}</Text>
            <Text style={styles.statLabel}>Reading</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.finished_count || 0}</Text>
            <Text style={styles.statLabel}>Finished</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.want_to_read_count || 0}</Text>
            <Text style={styles.statLabel}>To Read</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total_books || 0}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      )}

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScrollView}
        contentContainerStyle={styles.tabsContainer}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => handleTabChange('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reading' && styles.tabActive]}
          onPress={() => handleTabChange('reading')}
        >
          <Text style={[styles.tabText, activeTab === 'reading' && styles.tabTextActive]}>
            Reading
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'finished' && styles.tabActive]}
          onPress={() => handleTabChange('finished')}
        >
          <Text style={[styles.tabText, activeTab === 'finished' && styles.tabTextActive]}>
            Finished
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'want_to_read' && styles.tabActive]}
          onPress={() => handleTabChange('want_to_read')}
        >
          <Text style={[styles.tabText, activeTab === 'want_to_read' && styles.tabTextActive]}>
            To Read
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dnf' && styles.tabActive]}
          onPress={() => handleTabChange('dnf')}
        >
          <Text style={[styles.tabText, activeTab === 'dnf' && styles.tabTextActive]}>
            DNF
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Books List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7BA591" />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7BA591" />
            <Text style={styles.loadingText}>Loading your library...</Text>
          </View>
        ) : library.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="library-outline" size={80} color="#4A5568" />
            <Text style={styles.emptyTitle}>Your library is empty</Text>
            <Text style={styles.emptySubtext}>
              Search for books and start building your collection
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)/explore')}
            >
              <Ionicons name="search" size={20} color="#F7F4EF" />
              <Text style={styles.exploreButtonText}>Explore Books</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.booksContainer}>
            {getFilteredBooks().map(renderBookCard)}
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
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#4A5568',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#7BA591',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#F7F4EF',
    fontSize: 12,
    opacity: 0.7,
  },
  tabsScrollView: {
    maxHeight: 50,
    marginBottom: 20,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#4A5568',
    minWidth: 80,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#7BA591',
  },
  tabText: {
    color: '#F7F4EF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  tabTextActive: {
    opacity: 1,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#F7F4EF',
    fontSize: 16,
    marginTop: 16,
    opacity: 0.7,
  },
  booksContainer: {
    padding: 20,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#4A5568',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 12,
  },
  bookCover: {
    width: 70,
    height: 105,
    borderRadius: 8,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCoverText: {
    color: '#F7F4EF',
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
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
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#2C3E50',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7BA591',
  },
  progressText: {
    color: '#F7F4EF',
    fontSize: 12,
    opacity: 0.7,
    width: 40,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2C3E50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#7BA591',
    fontSize: 11,
    fontWeight: '600',
  },
  moreButton: {
    padding: 8,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#F7F4EF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#F7F4EF',
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7BA591',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  exploreButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 40,
  },
});