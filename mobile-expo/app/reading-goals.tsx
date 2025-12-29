import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ReadingGoalsScreen() {
  const router = useRouter();
  const [yearlyGoal, setYearlyGoal] = useState('24');
  const [currentProgress, setCurrentProgress] = useState(12);
  const [dailyMinutes, setDailyMinutes] = useState('30');

  const progress = (currentProgress / parseInt(yearlyGoal)) * 100;

  const handleSave = () => {
  // TODO: Save to API
  router.back();
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
            <Ionicons name="search-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
            <Ionicons name="settings-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Page Title with Save Button */}
      <View style={styles.titleBar}>
        <Text style={styles.pageTitle}>Reading Goals</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Yearly Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yearly Reading Goal</Text>
          <Text style={styles.description}>
            How many books do you want to read this year?
          </Text>

          <View style={styles.goalInput}>
            <TextInput
              style={styles.input}
              value={yearlyGoal}
              onChangeText={setYearlyGoal}
              keyboardType="numeric"
              placeholder="24"
              placeholderTextColor="#999"
            />
            <Text style={styles.inputLabel}>books per year</Text>
          </View>

          {/* Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Current Progress</Text>
              <Text style={styles.progressNumber}>{currentProgress}/{yearlyGoal}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progress)}% complete • {parseInt(yearlyGoal) - currentProgress} books to go
            </Text>
          </View>
        </View>

        {/* Daily Reading Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Reading Goal</Text>
          <Text style={styles.description}>
            How many minutes do you want to read each day?
          </Text>

          <View style={styles.goalInput}>
            <TextInput
              style={styles.input}
              value={dailyMinutes}
              onChangeText={setDailyMinutes}
              keyboardType="numeric"
              placeholder="30"
              placeholderTextColor="#999"
            />
            <Text style={styles.inputLabel}>minutes per day</Text>
          </View>
        </View>

        {/* Goal Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Success</Text>
          
          <View style={styles.tipCard}>
            <Ionicons name="book-outline" size={24} color="#7BA591" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Start Small</Text>
              <Text style={styles.tipText}>
                Set achievable goals and increase them gradually
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="notifications-outline" size={24} color="#7BA591" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Set Reminders</Text>
              <Text style={styles.tipText}>
                Daily notifications can help build a reading habit
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="people-outline" size={24} color="#7BA591" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Join Challenges</Text>
              <Text style={styles.tipText}>
                Reading with others keeps you motivated
              </Text>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  saveText: {
    color: '#7BA591',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 8,
  },
  description: {
    color: '#F7F4EF',
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  goalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    backgroundColor: '#4A5568',
    color: '#F7F4EF',
    padding: 16,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: 'bold',
    width: 80,
    textAlign: 'center',
  },
  inputLabel: {
    color: '#F7F4EF',
    fontSize: 16,
  },
  progressCard: {
    backgroundColor: '#4A5568',
    padding: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressNumber: {
    color: '#7BA591',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#2C3E50',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#7BA591',
  },
  progressText: {
    color: '#F7F4EF',
    opacity: 0.8,
    fontSize: 14,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipText: {
    color: '#F7F4EF',
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 20,
  },
});