import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function NotificationsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [bookRecommendations, setBookRecommendations] = useState(true);
  const [groupActivity, setGroupActivity] = useState(false);
  const [reviews, setReviews] = useState(true);
  const [readingReminders, setReadingReminders] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Choose what notifications you want to receive
        </Text>

        {/* Master Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Methods</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive alerts on your device</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#4A5568', true: '#7BA591' }}
              thumbColor="#F7F4EF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Email Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive updates via email</Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: '#4A5568', true: '#7BA591' }}
              thumbColor="#F7F4EF"
            />
          </View>
        </View>

        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Notify</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>New Followers</Text>
              <Text style={styles.settingSubtitle}>When someone follows you</Text>
            </View>
            <Switch
              value={newFollowers}
              onValueChange={setNewFollowers}
              trackColor={{ false: '#4A5568', true: '#7BA591' }}
              thumbColor="#F7F4EF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Book Recommendations</Text>
              <Text style={styles.settingSubtitle}>Personalized suggestions</Text>
            </View>
            <Switch
              value={bookRecommendations}
              onValueChange={setBookRecommendations}
              trackColor={{ false: '#4A5568', true: '#7BA591' }}
              thumbColor="#F7F4EF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Group Activity</Text>
              <Text style={styles.settingSubtitle}>Updates from your groups</Text>
            </View>
            <Switch
              value={groupActivity}
              onValueChange={setGroupActivity}
              trackColor={{ false: '#4A5568', true: '#7BA591' }}
              thumbColor="#F7F4EF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Review Activity</Text>
              <Text style={styles.settingSubtitle}>Comments on your reviews</Text>
            </View>
            <Switch
              value={reviews}
              onValueChange={setReviews}
              trackColor={{ false: '#4A5568', true: '#7BA591' }}
              thumbColor="#F7F4EF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Reading Reminders</Text>
              <Text style={styles.settingSubtitle}>Daily reading goal reminders</Text>
            </View>
            <Switch
              value={readingReminders}
              onValueChange={setReadingReminders}
              trackColor={{ false: '#4A5568', true: '#7BA591' }}
              thumbColor="#F7F4EF"
            />
          </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 16,
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
});