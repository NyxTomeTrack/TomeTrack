import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>Logo</Text>
        </View>

        <Text style={styles.title}>Welcome to TomeTrack</Text>
        
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Track Your Reading</Text>
          <Text style={styles.subtitle}>Connect With Readers</Text>
          <Text style={styles.subtitle}>Discover Your Next Favourite Book</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.secondaryButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
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
    marginBottom: 60,
  },
  logoText: {
    color: '#F7F4EF',
    fontSize: 16,
    opacity: 0.6,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 32,
    textAlign: 'center',
  },
  subtitleContainer: {
    alignItems: 'center',
    gap: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#F7F4EF',
    opacity: 0.8,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#7BA591',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#7BA591',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
});