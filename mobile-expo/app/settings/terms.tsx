import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.title}>Terms of Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: December 18, 2024</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using TomeTrack, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
        </Text>

        <Text style={styles.sectionTitle}>2. Description of Service</Text>
        <Text style={styles.paragraph}>
          TomeTrack is a social reading platform that allows users to track their reading, connect with other readers, and manage their personal book collections. We do not host or distribute book files. Users are responsible for their own content.
        </Text>

        <Text style={styles.sectionTitle}>3. User Accounts</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
        </Text>

        <Text style={styles.sectionTitle}>4. User Content</Text>
        <Text style={styles.paragraph}>
          You retain all rights to the content you upload to TomeTrack. By uploading content, you grant TomeTrack a license to use, display, and distribute your content solely for the purpose of operating the service.
        </Text>

        <Text style={styles.sectionTitle}>5. File Storage</Text>
        <Text style={styles.paragraph}>
          TomeTrack does not host book files on our servers. Files are stored on your device or connected cloud storage services (Google Drive, Dropbox, iCloud). You are responsible for maintaining legal ownership or rights to all files you access through TomeTrack.
        </Text>

        <Text style={styles.sectionTitle}>6. Copyright and Intellectual Property</Text>
        <Text style={styles.paragraph}>
          Users must respect copyright laws. Do not upload, share, or distribute copyrighted material without proper authorization. TomeTrack respects intellectual property rights and expects users to do the same.
        </Text>

        <Text style={styles.sectionTitle}>7. Prohibited Conduct</Text>
        <Text style={styles.paragraph}>
          You agree not to use TomeTrack to:
          {'\n'}• Violate any laws or regulations
          {'\n'}• Infringe on intellectual property rights
          {'\n'}• Harass, abuse, or harm other users
          {'\n'}• Distribute malware or harmful code
          {'\n'}• Attempt to gain unauthorized access to the service
        </Text>

        <Text style={styles.sectionTitle}>8. Termination</Text>
        <Text style={styles.paragraph}>
          TomeTrack reserves the right to terminate or suspend your account at any time for violations of these terms or for any other reason at our sole discretion.
        </Text>

        <Text style={styles.sectionTitle}>9. Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          TomeTrack is provided "as is" without warranties of any kind, either express or implied. We do not guarantee uninterrupted or error-free service.
        </Text>

        <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          TomeTrack shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
        </Text>

        <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these terms at any time. Continued use of TomeTrack after changes constitutes acceptance of the modified terms.
        </Text>

        <Text style={styles.sectionTitle}>12. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have questions about these Terms of Service, please contact us at:
          {'\n'}Email: legal@tometrack.co.za
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
    marginBottom: 24,
    fontStyle: 'italic',
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