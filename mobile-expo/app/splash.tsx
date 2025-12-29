import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

useEffect(() => {
  const timer = setTimeout(() => {
    try {
      router.replace('/welcome');
    } catch (error) {
      console.log('Navigation error:', error);
    }
  }, 2000);

  return () => clearTimeout(timer);
}, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder - we'll replace with your logo later */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>Logo</Text>
        </View>

        <Text style={styles.title}>TomeTrack</Text>
        <Text style={styles.tagline}>Your Reading. Your Community.</Text>
      </View>

      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <ActivityIndicator size="small" color="#F7F4EF" style={styles.spinner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    color: '#F7F4EF',
    fontSize: 16,
    opacity: 0.6,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F7F4EF',
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#F7F4EF',
    opacity: 0.8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  loadingText: {
    color: '#F7F4EF',
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 8,
  },
  spinner: {
    marginTop: 4,
  },
});