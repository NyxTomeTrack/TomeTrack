import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: December 18, 2024</Text>

        <Text style={styles.intro}>
          At TomeTrack, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us:
          {'\n'}• Account information (email, username, display name)
          {'\n'}• Profile information (bio, preferences)
          {'\n'}• Reading activity (books read, progress, reviews)
          {'\n'}• Social interactions (follows, comments, discussions)
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your information to:
          {'\n'}• Provide and maintain our service
          {'\n'}• Personalize your experience
          {'\n'}• Send you notifications (if enabled)
          {'\n'}• Improve our service and develop new features
          {'\n'}• Communicate with you about updates and support
        </Text>

        <Text style={styles.sectionTitle}>3. Information Sharing</Text>
        <Text style={styles.paragraph}>
          We do not sell your personal information. We may share your information:
          {'\n'}• With other users based on your privacy settings
          {'\n'}• With service providers who assist us (cloud storage, analytics)
          {'\n'}• When required by law or to protect our rights
          {'\n'}• With your consent
        </Text>

        <Text style={styles.sectionTitle}>4. Your Book Files</Text>
        <Text style={styles.paragraph}>
          TomeTrack does not host your book files on our servers. Files remain on your device or connected cloud storage (Google Drive, Dropbox, iCloud). We only store references to file locations, never the actual content.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement security measures to protect your information:
          {'\n'}• Encrypted data transmission (HTTPS)
          {'\n'}• Secure password storage (hashed and salted)
          {'\n'}• Regular security audits
          {'\n'}• Limited employee access to user data
        </Text>

        <Text style={styles.sectionTitle}>6. Your Privacy Controls</Text>
        <Text style={styles.paragraph}>
          You can control your privacy through:
          {'\n'}• Privacy settings (public/private profile)
          {'\n'}• Notification preferences
          {'\n'}• Account deletion (contact support)
          {'\n'}• Data export requests
        </Text>

        <Text style={styles.sectionTitle}>7. Cookies and Tracking</Text>
        <Text style={styles.paragraph}>
          We use cookies and similar technologies to:
          {'\n'}• Keep you logged in
          {'\n'}• Remember your preferences
          {'\n'}• Analyze usage patterns
          {'\n'}• Improve performance
        </Text>

        <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          TomeTrack is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected such information, please contact us immediately.
        </Text>

        <Text style={styles.sectionTitle}>9. International Users</Text>
        <Text style={styles.paragraph}>
          TomeTrack is operated from South Africa. By using our service, you consent to the transfer of your information to South Africa and its processing in accordance with this Privacy Policy.
        </Text>

        <Text style={styles.sectionTitle}>10. Changes to Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification.
        </Text>

        <Text style={styles.sectionTitle}>11. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:
          {'\n'}• Access your personal data
          {'\n'}• Correct inaccurate data
          {'\n'}• Request deletion of your data
          {'\n'}• Object to data processing
          {'\n'}• Export your data
        </Text>

        <Text style={styles.sectionTitle}>12. Contact Us</Text>
        <Text style={styles.paragraph}>
          For privacy questions or to exercise your rights:
          {'\n'}Email: privacy@tometrack.co.za
          {'\n'}Address: TomeTrack, Johannesburg, South Africa
        </Text>

        <View style={styles.spacer} />
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
  lastUpdated: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  intro: {
    color: '#F7F4EF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    color: '#F7F4EF',
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  spacer: {
    height: 40,
  },
});