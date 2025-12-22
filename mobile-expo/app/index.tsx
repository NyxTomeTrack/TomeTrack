import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { isLoggedIn, setupAxiosInterceptors } from '../services/auth';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Setup axios to include token in requests
    setupAxiosInterceptors();

    // Check if user is logged in
    const loggedIn = await isLoggedIn();
    
    if (loggedIn) {
      // User is logged in, go to home
      router.replace('/(tabs)/home');
    } else {
      // User not logged in, go to splash
      router.replace('/splash');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#7BA591" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },
});