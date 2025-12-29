import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { getUserProfile, getUserStats } from '../../services/user';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load profile data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      console.log('LOADING PROFILE DATA...');
      
      const [profileData, statsData] = await Promise.all([
        getUserProfile(),
        getUserStats()
      ]);
      
      console.log('PROFILE DATA:', profileData);
      console.log('STATS DATA:', statsData);
      
<<<<<<< HEAD
      // Extract user and stats from response objects
      setUser(profileData.user);
      setStats(statsData.stats);
=======
      setUser(profileData);
      setStats(statsData);
>>>>>>> d200ccc00fcbe9a4d6256c522c41c780b1d487cc
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock activity data (will connect to real data later)
  const finishedBooks = [
    { id: 1, title: 'Title of Book', author: 'Author', reviews: 1234 },
  ];

  const dnfBooks = [
    { id: 2, title: 'Title of Book', author: 'Author', reviews: 567 },
  ];

  const reviews = [
    { id: 3, title: 'Title of Book', author: 'Author', reviews: 890 },
  ];

  const ActivitySection = ({ title, books }: any) => (
    <View style={styles.activitySection}>
      <Text style={styles.activityTitle}>{title}</Text>
      {books.map((book: any) => (
        <TouchableOpacity 
          key={book.id} 
          style={styles.activityCard}
          onPress={() => router.push(`/book/${book.id}`)}
        >
          <View style={styles.bookCover}>
            <Text style={styles.bookCoverText}>Book Cover Image</Text>
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityBookTitle}>{book.title}</Text>
            <Text style={styles.activityBookAuthor}>{book.author}</Text>
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
              <Ionicons name="person-circle" size={28} color="#7BA591" />
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
            <Ionicons name="person-circle" size={28} color="#7BA591" />
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
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profilePicture}>
            <Text style={styles.profilePictureText}>Profile Picture</Text>
          </View>

          <Text style={styles.displayName}>{user?.display_name || user?.username}</Text>
          <Text style={styles.username}>@{user?.username}</Text>
          <Text style={styles.bio}>{user?.bio || 'No bio yet'}</Text>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}># Books</Text>
              <Text style={styles.statLabel}>{stats?.books_count || 0}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}># Reviews</Text>
              <Text style={styles.statLabel}>{stats?.reviews_count || 0}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}># Followers</Text>
              <Text style={styles.statLabel}>{stats?.followers_count || 0}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}># Following</Text>
              <Text style={styles.statLabel}>{stats?.following_count || 0}</Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/edit-profile')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          <ActivitySection title="Finished Reading" books={finishedBooks} />
          <ActivitySection title="DNF" books={dnfBooks} />
          <ActivitySection title="Added a Review" books={reviews} />
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
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePictureText: {
    color: '#F7F4EF',
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#F7F4EF',
    opacity: 0.8,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#F7F4EF',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 12,
    color: '#F7F4EF',
    opacity: 0.7,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7F4EF',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#4A5568',
  },
  editButton: {
    backgroundColor: '#7BA591',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  recentActivity: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 20,
  },
  activitySection: {
    marginBottom: 24,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7F4EF',
    marginBottom: 12,
  },
  activityCard: {
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
  activityInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  activityBookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F7F4EF',
    marginBottom: 4,
  },
  activityBookAuthor: {
    fontSize: 14,
    color: '#F7F4EF',
    opacity: 0.8,
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#F7F4EF',
    opacity: 0.7,
  },
});