import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { clearAuthData } from '../../services/auth';

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await clearAuthData();
    router.replace('/welcome');
  };

  const settingsOptions = [
    { 
      title: 'Account Settings', 
      icon: 'person-outline', 
      items: [
        { label: 'Email & Password', route: '/settings/email-password' },
        { label: 'Privacy', route: '/settings/privacy' },
        { label: 'Notifications', route: '/settings/notifications' },
      ]
    },
    { 
      title: 'App Settings', 
      icon: 'settings-outline', 
      items: [
        { label: 'Reading Settings', route: '/settings/reading-settings' },
        { label: 'File Management', route: '/settings/file-management' },
      ]
    },
    { 
      title: 'About', 
      icon: 'information-circle-outline', 
      items: [
        { label: 'Terms of Service', route: '/settings/terms' },
        { label: 'Privacy Policy', route: '/settings/privacy-policy' },
        { label: 'Community Guidelines', route: '/settings/community-guidelines' },
        { label: 'Help & Support', route: '/settings/help' },
      ]
    },
  ];

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
        <Text style={styles.pageTitle}>Settings</Text>

        {settingsOptions.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon as any} size={20} color="#7BA591" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.optionItem}
                onPress={() => router.push(item.route as any)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#F7F4EF" opacity={0.5} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#E57373" />
          <Text style={styles.logoutText}>Log Out</Text>
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
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7BA591',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    color: '#F7F4EF',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E57373',
    marginTop: 16,
    marginBottom: 32,
  },
  logoutText: {
    color: '#E57373',
    fontSize: 16,
    fontWeight: '600',
  },
});