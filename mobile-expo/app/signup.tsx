<<<<<<< HEAD
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.174:3000/api'; // Update with your IP

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
=======
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function SignUpScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      alert('Please fill in all fields');
>>>>>>> d200ccc00fcbe9a4d6256c522c41c780b1d487cc
      return;
    }

    try {
<<<<<<< HEAD
      setLoading(true);
      console.log('Registering:', username, email);

      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
        displayName: displayName || username,
      });

      console.log('Registration successful:', response.data);

      // Save token
      await AsyncStorage.setItem('@tometrack_token', response.data.token);
      await AsyncStorage.setItem('@tometrack_user', JSON.stringify(response.data.user));

      // Navigate to main app
      router.replace('/(tabs)/home');

    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
=======
      // Generate username from email (before @)
      const username = email.split('@')[0].toLowerCase();

      const response = await axios.post('http://192.168.101.22:3000/api/auth/register', {
        username: username,
        email: email,
        password: password,
        display_name: displayName
      });

      alert('Account created! Please log in.');
      router.replace('/onboarding-genres');
      
    } catch (error: any) {
      alert('Sign up failed: ' + (error.response?.data?.error || 'Please try again'));
>>>>>>> d200ccc00fcbe9a4d6256c522c41c780b1d487cc
    }
  };

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Display Name (optional)"
        placeholderTextColor="#999"
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#F7F4EF" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
=======
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

        <Text style={styles.title}>Create Your Account</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            placeholderTextColor="#999"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />
          <Text style={styles.hint}>This name is how other readers will find you.</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
>>>>>>> d200ccc00fcbe9a4d6256c522c41c780b1d487cc
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#2C3E50',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#4A5568',
    color: '#F7F4EF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7BA591',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
=======
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
    width: 80,
    height: 80,
    borderRadius: 40,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  label: {
    color: '#F7F4EF',
    fontSize: 16,
    marginBottom: -8,
  },
  input: {
    backgroundColor: '#4A5568',
    color: '#F7F4EF',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  hint: {
    color: '#F7F4EF',
    fontSize: 14,
    opacity: 0.6,
    marginTop: -8,
  },
  button: {
    backgroundColor: '#7BA591',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
>>>>>>> d200ccc00fcbe9a4d6256c522c41c780b1d487cc
  },
  buttonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
<<<<<<< HEAD
  linkText: {
    color: '#7BA591',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
=======
>>>>>>> d200ccc00fcbe9a4d6256c522c41c780b1d487cc
});