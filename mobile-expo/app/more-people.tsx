import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function MorePeopleScreen() {
  const router = useRouter();
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);
  const [ignoredUsers, setIgnoredUsers] = useState<number[]>([]);

  // Mock recommended people - will be replaced with algorithm data
  const recommendedPeople = [
    { id: 11, username: 'BookLover23', displayName: 'Sarah Johnson', books: 47 },
    { id: 12, username: 'ReadingNerd', displayName: 'Michael Chen', books: 32 },
    { id: 13, username: 'PageTurner', displayName: 'Emma Davis', books: 28 },
    { id: 14, username: 'NovelAddict', displayName: 'James Wilson', books: 56 },
    { id: 15, username: 'BookWorm99', displayName: 'Lisa Martinez', books: 41 },
    { id: 16, username: 'StorySeeker', displayName: 'David Brown', books: 33 },
    { id: 17, username: 'LitFan', displayName: 'Anna Taylor', books: 29 },
    { id: 18, username: 'ReadMore', displayName: 'Chris Anderson', books: 52 },
    { id: 19, username: 'BookBuddy', displayName: 'Sophie Lee', books: 38 },
    { id: 20, username: 'ChapterOne', displayName: 'Ryan Miller', books: 44 },
  ];

  const handleFollow = (userId: number) => {
    setFollowedUsers([...followedUsers, userId]);
  };

  const handleIgnore = (userId: number) => {
    setIgnoredUsers([...ignoredUsers, userId]);
  };

  const visiblePeople = recommendedPeople.filter(p => !ignoredUsers.includes(p.id));

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
        <Text style={styles.pageTitle}>Recommended People</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Readers with similar taste and favorite genres
        </Text>

        {visiblePeople.map((person) => (
          <TouchableOpacity 
            key={person.id} 
            style={styles.personCard}
            onPress={() => router.push(`/user/${person.id}`)}
          >
            <View style={styles.personLeft}>
              <View style={styles.personAvatar}>
                <Text style={styles.personAvatarText}>Profile Pic</Text>
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personDisplayName}>{person.displayName}</Text>
                <Text style={styles.personUsername}>@{person.username}</Text>
                <Text style={styles.personSubtext}>Reader • {person.books} books</Text>
              </View>
            </View>
            <View style={styles.personActions}>
              {followedUsers.includes(person.id) ? (
                <View style={styles.followingBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#7BA591" />
                  <Text style={styles.followingText}>Following</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleFollow(person.id);
                    }}
                  >
                    <Text style={styles.actionButtonText}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.ignoreButton]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleIgnore(person.id);
                    }}
                  >
                    <Text style={styles.actionButtonText}>Ignore</Text>
                  </TouchableOpacity>
                </>
              )}
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
  personCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  personLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  personAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personAvatarText: {
    color: '#F7F4EF',
    fontSize: 9,
    opacity: 0.5,
    textAlign: 'center',
  },
  personInfo: {
    flex: 1,
  },
  personDisplayName: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  personUsername: {
    color: '#F7F4EF',
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 2,
  },
  personSubtext: {
    color: '#F7F4EF',
    fontSize: 12,
    opacity: 0.6,
  },
  personActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#7BA591',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ignoreButton: {
    backgroundColor: '#5C6B7A',
  },
  actionButtonText: {
    color: '#F7F4EF',
    fontSize: 13,
    fontWeight: '600',
  },
  followingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  followingText: {
    color: '#7BA591',
    fontSize: 13,
    fontWeight: '600',
  },
});