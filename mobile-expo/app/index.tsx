import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Small delay to ensure navigation is ready
    const timer = setTimeout(() => {
      router.replace('/splash');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <View style={{ flex: 1, backgroundColor: '#2C3E50' }} />;
}