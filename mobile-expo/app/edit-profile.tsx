import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function EditProfileScreen() {
  const router = useRouter();
  
  // Mock current user data
  const [displayName, setDisplayName] = useState('Your Name');
  const [username, setUsername] = useState('@Username');
  const [bio, setBio] = useState('Bio Text goes here if you want to add it');

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
        <Text style={styles.pageTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Picture */}
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePicture}>
            <Text style={styles.profilePictureText}>Profile Picture</Text>
          </View>
          <TouchableOpacity style={styles.changePictureButton}>
            <Text style={styles.changePictureText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your display name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="@username"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
            <Text style={styles.hint}>This is how other readers will find you</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.hint}>{bio.length}/150 characters</Text>
          </View>
        </View>

        {/* Additional Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Preferences</Text>
          
          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => router.push('/favorite-genres')}
          >
            <Text style={styles.optionText}>Favorite Genres</Text>
            <Ionicons name="chevron-forward" size={20} color="#F7F4EF" opacity={0.5} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => router.push('/reading-goals')}
          >
            <Text style={styles.optionText}>Reading Goals</Text>
            <Ionicons name="chevron-forward" size={20} color="#F7F4EF" opacity={0.5} />
          </TouchableOpacity>
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
  },
  profilePictureSection: {
    alignItems: 'center',
    padding: 32,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  changePictureButton: {
    paddingVertical: 8,
  },
  changePictureText: {
    color: '#7BA591',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#4A5568',
    color: '#F7F4EF',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  hint: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 14,
    marginTop: 8,
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
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  optionText: {
    color: '#F7F4EF',
    fontSize: 16,
  },
});