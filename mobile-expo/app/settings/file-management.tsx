import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ReadingSettingsScreen() {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(18);
  const [lineSpacing, setLineSpacing] = useState('medium');
  const [theme, setTheme] = useState('dark');
  const [fontFamily, setFontFamily] = useState('serif');

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.title}>Default Reading Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Set your default preferences for reading. You can adjust these while reading.
        </Text>

        {/* Font Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Font Size</Text>
          <View style={styles.fontSizeControl}>
            <TouchableOpacity 
              style={styles.fontButton}
              onPress={() => setFontSize(Math.max(12, fontSize - 2))}
            >
              <Text style={styles.fontButtonText}>A-</Text>
            </TouchableOpacity>
            <View style={styles.fontSizeDisplay}>
              <Text style={styles.fontSizeText}>{fontSize}px</Text>
            </View>
            <TouchableOpacity 
              style={styles.fontButton}
              onPress={() => setFontSize(Math.min(32, fontSize + 2))}
            >
              <Text style={styles.fontButtonText}>A+</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.previewText, { fontSize }]}>
            Preview: The quick brown fox jumps over the lazy dog.
          </Text>
        </View>

        {/* Line Spacing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Line Spacing</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={[styles.option, lineSpacing === 'tight' && styles.optionActive]}
              onPress={() => setLineSpacing('tight')}
            >
              <Ionicons name="reorder-two-outline" size={24} color="#F7F4EF" />
              <Text style={styles.optionText}>Tight</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.option, lineSpacing === 'medium' && styles.optionActive]}
              onPress={() => setLineSpacing('medium')}
            >
              <Ionicons name="reorder-three-outline" size={24} color="#F7F4EF" />
              <Text style={styles.optionText}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.option, lineSpacing === 'relaxed' && styles.optionActive]}
              onPress={() => setLineSpacing('relaxed')}
            >
              <Ionicons name="reorder-four-outline" size={24} color="#F7F4EF" />
              <Text style={styles.optionText}>Relaxed</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Theme</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={[styles.themeOption, styles.themeDark, theme === 'dark' && styles.themeActive]}
              onPress={() => setTheme('dark')}
            >
              <Text style={styles.themeText}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.themeOption, styles.themeSepia, theme === 'sepia' && styles.themeActive]}
              onPress={() => setTheme('sepia')}
            >
              <Text style={[styles.themeText, styles.themeTextDark]}>Sepia</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.themeOption, styles.themeLight, theme === 'light' && styles.themeActive]}
              onPress={() => setTheme('light')}
            >
              <Text style={[styles.themeText, styles.themeTextDark]}>Light</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Font Family */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Font Style</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={[styles.option, fontFamily === 'serif' && styles.optionActive]}
              onPress={() => setFontFamily('serif')}
            >
              <Text style={styles.optionText}>Serif</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.option, fontFamily === 'sans-serif' && styles.optionActive]}
              onPress={() => setFontFamily('sans-serif')}
            >
              <Text style={[styles.optionText, { fontFamily: 'sans-serif' }]}>Sans-Serif</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.option, fontFamily === 'monospace' && styles.optionActive]}
              onPress={() => setFontFamily('monospace')}
            >
              <Text style={[styles.optionText, { fontFamily: 'monospace' }]}>Mono</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    color: '#F7F4EF',
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 16,
  },
  fontSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  fontButton: {
    width: 48,
    height: 48,
    backgroundColor: '#4A5568',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontButtonText: {
    color: '#F7F4EF',
    fontSize: 18,
    fontWeight: '600',
  },
  fontSizeDisplay: {
    flex: 1,
    backgroundColor: '#4A5568',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  fontSizeText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewText: {
    color: '#F7F4EF',
    opacity: 0.8,
    lineHeight: 28,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  optionActive: {
    backgroundColor: '#7BA591',
  },
  optionText: {
    color: '#F7F4EF',
    fontSize: 14,
    fontWeight: '600',
  },
  themeOption: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeDark: {
    backgroundColor: '#2C3E50',
  },
  themeSepia: {
    backgroundColor: '#F4ECD8',
  },
  themeLight: {
    backgroundColor: '#F7F4EF',
  },
  themeActive: {
    borderColor: '#7BA591',
  },
  themeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F7F4EF',
  },
  themeTextDark: {
    color: '#2C3E50',
  },
  saveButton: {
    backgroundColor: '#7BA591',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
});