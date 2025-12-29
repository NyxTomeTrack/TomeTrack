import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const GENRES = [
  'Fiction',
  'Mystery',
  'Fantasy',
  'Sci-Fi',
  'History',
  'Biography',
  'Poetry',
  'Thriller',
  'Memoir',
  'Self-Help',
  'Romance',
  'Classics',
  'Horror',
  'Adventure',
  'Young Adult',
];

export default function OnboardingGenresScreen() {
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleContinue = () => {
    if (selectedGenres.length === 0) {
      alert('Please select at least one genre');
      return;
    }
    // TODO: Save genres to user profile
    router.push('/onboarding-community');
  };

  const handleSkip = () => {
    router.push('/onboarding-community');
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#5C9EAD" />
        <Text style={styles.backText}>Profile</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>Logo</Text>
        </View>

        <Text style={styles.title}>What Do You Like Reading?</Text>

        <View style={styles.genresContainer}>
          {GENRES.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.genreButton,
                selectedGenres.includes(genre) && styles.genreButtonSelected
              ]}
              onPress={() => toggleGenre(genre)}
            >
              <View style={styles.genreContent}>
                <View style={[
                  styles.checkbox,
                  selectedGenres.includes(genre) && styles.checkboxSelected
                ]}>
                  {selectedGenres.includes(genre) && (
                    <Ionicons name="checkmark" size={16} color="#F7F4EF" />
                  )}
                </View>
                <Text style={[
                  styles.genreText,
                  selectedGenres.includes(genre) && styles.genreTextSelected
                ]}>
                  {genre}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now...</Text>
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 0,
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
  genresContainer: {
    gap: 12,
  },
  genreButton: {
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genreButtonSelected: {
    borderColor: '#7BA591',
    backgroundColor: '#3D5A5A',
  },
  genreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F7F4EF',
    opacity: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#7BA591',
    borderColor: '#7BA591',
    opacity: 1,
  },
  genreText: {
    color: '#F7F4EF',
    fontSize: 16,
    opacity: 0.8,
  },
  genreTextSelected: {
    opacity: 1,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  continueButton: {
    backgroundColor: '#7BA591',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    padding: 8,
  },
  skipText: {
    color: '#5C9EAD',
    fontSize: 14,
  },
});