import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

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
  'Non-Fiction',
  'Philosophy',
  'Psychology',
  'True Crime',
  'Comedy',
];

export default function FavoriteGenresScreen() {
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Fiction', 'Mystery', 'Fantasy']);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSave = () => {
    // TODO: Save to API
    alert(`Saved ${selectedGenres.length} favorite genres!`);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.title}>Favorite Genres</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Select your favorite genres to get better book recommendations
        </Text>

        <Text style={styles.selectedCount}>
          {selectedGenres.length} genre{selectedGenres.length !== 1 ? 's' : ''} selected
        </Text>

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
  title: {
    fontSize: 20,
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
    padding: 20,
  },
  description: {
    color: '#F7F4EF',
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 24,
    lineHeight: 24,
  },
  selectedCount: {
    color: '#7BA591',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
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
});