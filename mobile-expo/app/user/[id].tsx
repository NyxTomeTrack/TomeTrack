import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function OtherUserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data
  const user = {
    username: '@Username',
    displayName: 'User Name',
    bio: 'Bio Text goes here if you want to add it',
    booksCount: 32,
    reviewsCount: 15,
    followersCount: 234,
    followingCount: 156,
  };

  const finishedBooks = [
    { id: 1, title: 'Title of Book', author: 'Author', reviews: 1234 },
  ];

  const dnfBooks = [
    { id: 2, title: 'Title of Book', author: 'Author', reviews: 567 },
  ];

  const reviews = [
    { id: 3, title: 'Title of Book', author: 'Author', reviews: 890 },
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    alert(isFollowing ? 'Unfollowed!' : 'Following!');
  };

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

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.username}>{user.username}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profilePicture}>
            <Text style={styles.profilePictureText}>Profile Picture</Text>
          </View>

          <Text style={styles.displayName}>{user.displayName}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.bio}>{user.bio}</Text>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}># Books</Text>
              <Text style={styles.statLabel}>{user.booksCount}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}># Reviews</Text>
              <Text style={styles.statLabel}>{user.reviewsCount}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}># Followers</Text>
              <Text style={styles.statLabel}>{user.followersCount}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}># Following</Text>
              <Text style={styles.statLabel}>{user.followingCount}</Text>
            </View>
          </View>

          {/* Follow Button */}
          <TouchableOpacity 
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={handleFollow}
          >
            <Text style={styles.followButtonText}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/home')}>
          <Ionicons name="home-outline" size={24} color="#F7F4EF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/explore')}>
          <Ionicons name="search-outline" size={24} color="#F7F4EF" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/library')}>
          <Ionicons name="library-outline" size={24} color="#F7F4EF" />
          <Text style={styles.navText}>Library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="person-outline" size={24} color="#F7F4EF" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7F4EF',
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
  followButton: {
    backgroundColor: '#7BA591',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
  followingButton: {
    backgroundColor: '#4A5568',
  },
  followButtonText: {
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
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#2C3E50',
    borderTopWidth: 1,
    borderTopColor: '#4A5568',
    paddingVertical: 12,
    paddingBottom: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    color: '#F7F4EF',
    fontSize: 12,
    opacity: 0.7,
  },
});