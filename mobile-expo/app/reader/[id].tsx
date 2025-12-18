import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function ReaderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  // Mock book content
  const bookContent = `Chapter 1: The Beginning

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`;

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
            <Ionicons name="settings-outline" size={28} color="#F7F4EF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Book Header */}
      <View style={styles.header}>
        <Text style={styles.bookTitle}>Title of Book</Text>
        <Text style={styles.chapterTitle}>Chapter 1</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.text}>{bookContent}</Text>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.pageNumber}>123</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>
        <Text style={styles.pageTotal}>1000</Text>
      </View>

      {/* Floating Settings Button */}
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => setShowSettings(true)}
      >
        <Ionicons name="settings" size={24} color="#F7F4EF" />
      </TouchableOpacity>

      {/* Settings Modal */}
      {showSettings && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reading Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close" size={24} color="#F7F4EF" />
              </TouchableOpacity>
            </View>

            {/* Font Size */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Font Size</Text>
              <View style={styles.fontSizeBar}>
                <TouchableOpacity style={styles.fontButton}>
                  <Text style={styles.fontButtonText}>A-</Text>
                </TouchableOpacity>
                <View style={styles.fontSlider}>
                  <View style={styles.fontSliderTrack} />
                </View>
                <TouchableOpacity style={styles.fontButton}>
                  <Text style={styles.fontButtonText}>A+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Line Spacing */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Line Spacing</Text>
              <View style={styles.spacingOptions}>
                <TouchableOpacity style={styles.spacingOption}>
                  <Ionicons name="reorder-two-outline" size={24} color="#F7F4EF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.spacingOption}>
                  <Ionicons name="reorder-three-outline" size={24} color="#F7F4EF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.spacingOption, styles.spacingOptionActive]}>
                  <Ionicons name="reorder-four-outline" size={24} color="#F7F4EF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Theme */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Theme Change</Text>
              <View style={styles.themeOptions}>
                <TouchableOpacity style={[styles.themeOption, styles.themeDark, styles.themeActive]}>
                  <Text style={styles.themeText}>Dark</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.themeOption, styles.themeSepia]}>
                  <Text style={[styles.themeText, styles.themeTextDark]}>Sepia</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.themeOption, styles.themeLight]}>
                  <Text style={[styles.themeText, styles.themeTextDark]}>Light</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Font Change */}
            <View style={styles.settingSection}>
              <Text style={styles.settingLabel}>Font Change</Text>
              <View style={styles.fontOptions}>
                <TouchableOpacity style={[styles.fontOption, styles.fontOptionActive]}>
                  <Text style={styles.fontOptionText}>Serif</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fontOption}>
                  <Text style={[styles.fontOptionText, { fontFamily: 'sans-serif' }]}>Sans-Serif</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fontOption}>
                  <Text style={[styles.fontOptionText, { fontFamily: 'monospace' }]}>Mono</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Done Button */}
            <TouchableOpacity style={styles.doneButton} onPress={() => setShowSettings(false)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    backgroundColor: '#2C3E50',
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
  header: {
    padding: 20,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F7F4EF',
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 14,
    color: '#F7F4EF',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 18,
    lineHeight: 32,
    color: '#F7F4EF',
    fontFamily: 'serif',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#4A5568',
  },
  pageNumber: {
    color: '#F7F4EF',
    fontSize: 14,
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#4A5568',
    borderRadius: 2,
  },
  progressBar: {
    width: '12.3%',
    height: '100%',
    backgroundColor: '#7BA591',
    borderRadius: 2,
  },
  pageTotal: {
    color: '#F7F4EF',
    fontSize: 14,
  },
  settingsButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7BA591',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C3E50',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
  },
  settingSection: {
    marginBottom: 24,
  },
  settingLabel: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  fontSizeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fontButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4A5568',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
  fontSlider: {
    flex: 1,
    height: 4,
    backgroundColor: '#4A5568',
    borderRadius: 2,
    justifyContent: 'center',
  },
  fontSliderTrack: {
    width: '60%',
    height: '100%',
    backgroundColor: '#7BA591',
    borderRadius: 2,
  },
  spacingOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  spacingOption: {
    flex: 1,
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  spacingOptionActive: {
    backgroundColor: '#7BA591',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 12,
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
  fontOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  fontOption: {
    flex: 1,
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  fontOptionActive: {
    backgroundColor: '#7BA591',
  },
  fontOptionText: {
    color: '#F7F4EF',
    fontSize: 14,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#7BA591',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  doneButtonText: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
  },
});