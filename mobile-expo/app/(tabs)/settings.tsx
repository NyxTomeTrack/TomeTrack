import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Clear user session
    alert('Logging out...');
    router.replace('/welcome');
  };

  const SettingsSection = ({ title, items }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item: any, index: number) => (
        <TouchableOpacity 
          key={index} 
          style={styles.settingItem}
          onPress={item.onPress}
        >
          <Text style={styles.settingText}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={20} color="#F7F4EF" opacity={0.5} />
        </TouchableOpacity>
      ))}
    </View>
  );

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
            <Ionicons name="settings" size={28} color="#7BA591" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        <SettingsSection
          title="Account"
          items={[
            { 
              label: '> Email & Password', 
              onPress: () => router.push('/settings/email-password')
            },
            { 
              label: '> Privacy', 
              onPress: () => router.push('/settings/privacy')
            },
            { 
              label: '> Notifications', 
              onPress: () => router.push('/settings/notifications')
            },
          ]}
        />

        {/* Reading Section */}
        <SettingsSection
          title="Reading"
          items={[
            { 
              label: '> Default Reading Settings', 
              onPress: () => router.push('/settings/reading-settings')
            },
            { 
              label: '> File Management', 
              onPress: () => router.push('/settings/file-management')
            },
          ]}
        />

        {/* About Section */}
        <SettingsSection
          title="About"
          items={[
            { 
              label: '> Terms of Service', 
              onPress: () => router.push('/settings/terms')
            },
            { 
              label: '> Privacy Policy', 
              onPress: () => router.push('/settings/privacy-policy')
            },
            { 
              label: '> Community Guidelines', 
              onPress: () => router.push('/settings/community-guidelines')
            },
            { 
              label: '> Help & Support', 
              onPress: () => router.push('/settings/help')
            },
          ]}
        />

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
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
  scrollView: {
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
  settingText: {
    fontSize: 16,
    color: '#F7F4EF',
  },
  logoutButton: {
    backgroundColor: '#7BA591',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  logoutButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    color: '#F7F4EF',
    opacity: 0.5,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
});