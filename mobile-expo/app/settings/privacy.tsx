import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function PrivacyScreen() {
  const router = useRouter();
  const [profilePublic, setProfilePublic] = useState(true);
  const [showReadingActivity, setShowReadingActivity] = useState(true);
  const [showReviews, setShowReviews] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Control who can see your reading activity and profile information
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Public Profile</Text>
            <Text style={styles.settingSubtitle}>Allow others to view your profile</Text>
          </View>
          <Switch
            value={profilePublic}
            onValueChange={setProfilePublic}
            trackColor={{ false: '#4A5568', true: '#7BA591' }}
            thumbColor="#F7F4EF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Show Reading Activity</Text>
            <Text style={styles.settingSubtitle}>Display books you're reading</Text>
          </View>
          <Switch
            value={showReadingActivity}
            onValueChange={setShowReadingActivity}
            trackColor={{ false: '#4A5568', true: '#7BA591' }}
            thumbColor="#F7F4EF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Show Reviews</Text>
            <Text style={styles.settingSubtitle}>Make your reviews public</Text>
          </View>
          <Switch
            value={showReviews}
            onValueChange={setShowReviews}
            trackColor={{ false: '#4A5568', true: '#7BA591' }}
            thumbColor="#F7F4EF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Allow Messages</Text>
            <Text style={styles.settingSubtitle}>Let other users message you</Text>
          </View>
          <Switch
            value={allowMessages}
            onValueChange={setAllowMessages}
            trackColor={{ false: '#4A5568', true: '#7BA591' }}
            thumbColor="#F7F4EF"
          />
        </View>

        <TouchableOpacity style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Delete Account</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    color: '#F7F4EF',
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 14,
  },
  dangerButton: {
    backgroundColor: '#8B4545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 40,
  },
  dangerButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
});