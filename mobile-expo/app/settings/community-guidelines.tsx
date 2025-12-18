import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CommunityGuidelinesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.title}>Community Guidelines</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.intro}>
          TomeTrack is a community of readers who share a love of books. These guidelines help us maintain a welcoming, respectful, and enriching environment for everyone.
        </Text>

        <Text style={styles.sectionTitle}>Be Respectful</Text>
        <Text style={styles.paragraph}>
          Treat others with kindness and respect. We welcome diverse perspectives and opinions, but personal attacks, harassment, and hate speech have no place in our community.
          {'\n\n'}• Disagree with ideas, not people
          {'\n'}• Avoid personal insults or derogatory language
          {'\n'}• Respect different reading tastes and preferences
          {'\n'}• Remember there's a real person behind every profile
        </Text>

        <Text style={styles.sectionTitle}>Keep It Constructive</Text>
        <Text style={styles.paragraph}>
          When discussing books or leaving reviews:
          {'\n\n'}• Share thoughtful opinions, not just ratings
          {'\n'}• Explain what worked or didn't work for you
          {'\n'}• Avoid spoilers without warnings
          {'\n'}• Recognize that tastes differ
          {'\n'}• Focus on the book, not attacking the author or other readers
        </Text>

        <Text style={styles.sectionTitle}>Respect Copyright</Text>
        <Text style={styles.paragraph}>
          TomeTrack is built on respect for authors and their work:
          {'\n\n'}• Only upload books you legally own
          {'\n'}• Do not share or distribute copyrighted content
          {'\n'}• Support authors by purchasing their work
          {'\n'}• Report copyright violations if you see them
        </Text>

        <Text style={styles.sectionTitle}>No Spam or Self-Promotion</Text>
        <Text style={styles.paragraph}>
          Keep TomeTrack focused on reading and community:
          {'\n\n'}• Don't spam discussions with promotional content
          {'\n'}• Authors can share their work in designated spaces
          {'\n'}• No excessive self-promotion or advertising
          {'\n'}• No bot accounts or automated posting
        </Text>

        <Text style={styles.sectionTitle}>Protect Privacy</Text>
        <Text style={styles.paragraph}>
          Respect the privacy of yourself and others:
          {'\n\n'}• Don't share personal information (addresses, phone numbers)
          {'\n'}• Don't dox or share others' private information
          {'\n'}• Respect privacy settings and boundaries
          {'\n'}• Report privacy violations
        </Text>

        <Text style={styles.sectionTitle}>Keep Content Appropriate</Text>
        <Text style={styles.paragraph}>
          TomeTrack welcomes readers of all ages:
          {'\n\n'}• Mark mature content appropriately
          {'\n'}• No sexually explicit content outside book discussions
          {'\n'}• No graphic violence or disturbing imagery
          {'\n'}• Use content warnings when discussing sensitive topics
        </Text>

        <Text style={styles.sectionTitle}>Foster Inclusive Discussions</Text>
        <Text style={styles.paragraph}>
          Make TomeTrack welcoming for everyone:
          {'\n\n'}• Welcome new members warmly
          {'\n'}• Encourage diverse voices and perspectives
          {'\n'}• Challenge discrimination when you see it
          {'\n'}• Create space for different reading experiences
        </Text>

        <Text style={styles.sectionTitle}>Report Problems</Text>
        <Text style={styles.paragraph}>
          Help us maintain a healthy community:
          {'\n\n'}• Report harassment, hate speech, or abuse
          {'\n'}• Flag copyright violations
          {'\n'}• Alert us to spam or bot accounts
          {'\n'}• Contact support for serious issues
        </Text>

        <Text style={styles.sectionTitle}>Consequences</Text>
        <Text style={styles.paragraph}>
          Violations of these guidelines may result in:
          {'\n\n'}• Warning messages
          {'\n'}• Temporary suspension
          {'\n'}• Permanent account termination
          {'\n'}• Reporting to authorities (for illegal activity)
        </Text>

        <Text style={styles.sectionTitle}>Remember</Text>
        <Text style={styles.highlight}>
          We're here because we love books. Let's create a community that celebrates reading, supports each other's literary journeys, and makes TomeTrack a place we all want to be.
        </Text>

        <Text style={styles.closing}>
          Questions about these guidelines? Contact us at:
          {'\n'}community@tometrack.co.za
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
  intro: {
    color: '#F7F4EF',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
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
  highlight: {
    color: '#7BA591',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    marginVertical: 24,
    padding: 16,
    backgroundColor: '#3A4558',
    borderRadius: 8,
  },
  closing: {
    color: '#F7F4EF',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 24,
    textAlign: 'center',
  },
  spacer: {
    height: 40,
  },
});