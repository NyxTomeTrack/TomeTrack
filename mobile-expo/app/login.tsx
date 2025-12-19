import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setError('');

    try {
      const response = await axios.post('http://192.168.101.22:3000/api/auth/login', {
        username: username,
        password: password
      });

      // Login successful - go directly to home (skip onboarding)
      router.replace('/(tabs)/home');
      
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#5C9EAD" />
        <Text style={styles.backText}>Welcome</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>Logo</Text>
        </View>

        <Text style={styles.title}>TomeTrack</Text>
        <Text style={styles.subtitle}>Your Reading, Your Community</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username/Email"
            placeholderTextColor="#999"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError('');
            }}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            secureTextEntry
            autoCapitalize="none"
          />

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#E57373" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    gap: 8,
  },
  backText: {
    color: '#5C9EAD',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A5568',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  logoText: {
    color: '#F7F4EF',
    fontSize: 14,
    opacity: 0.6,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F7F4EF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#F7F4EF',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#4A5568',
    color: '#F7F4EF',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4A2424',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E57373',
  },
  errorText: {
    color: '#E57373',
    fontSize: 14,
    flex: 1,
  },
  button: {
    backgroundColor: '#7BA591',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
});