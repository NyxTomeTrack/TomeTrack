import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HelpScreen() {
  const router = useRouter();

  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
    <View style={styles.faqItem}>
      <Text style={styles.question}>{question}</Text>
      <Text style={styles.answer}>{answer}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get In Touch</Text>

          <TouchableOpacity 
            style={styles.contactCard}
            onPress={() => openEmail('support@tometrack.co.za')}
          >
            <Ionicons name="mail-outline" size={32} color="#7BA591" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactSubtitle}>support@tometrack.co.za</Text>
              <Text style={styles.contactNote}>Response within 24-48 hours</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F7F4EF" opacity={0.5} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactCard}
            onPress={() => openEmail('feedback@tometrack.co.za')}
          >
            <Ionicons name="chatbubble-outline" size={32} color="#7BA591" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Send Feedback</Text>
              <Text style={styles.contactSubtitle}>feedback@tometrack.co.za</Text>
              <Text style={styles.contactNote}>We love hearing from you!</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F7F4EF" opacity={0.5} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactCard}
            onPress={() => openEmail('bug@tometrack.co.za')}
          >
            <Ionicons name="bug-outline" size={32} color="#7BA591" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Report a Bug</Text>
              <Text style={styles.contactSubtitle}>bug@tometrack.co.za</Text>
              <Text style={styles.contactNote}>Help us improve TomeTrack</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F7F4EF" opacity={0.5} />
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          <FAQItem
            question="How do I upload a book?"
            answer="Tap on any book detail page and select 'Start Reading'. You'll be prompted to upload from your device or connect to Google Drive, Dropbox, or iCloud."
          />

          <FAQItem
            question="Does TomeTrack store my books?"
            answer="No! TomeTrack never hosts your book files. Your files stay on your device or connected cloud storage. We only store references to where your files are located."
          />

          <FAQItem
            question="What file formats are supported?"
            answer="TomeTrack supports EPUB, PDF, MOBI, and TXT formats. More formats may be added in the future based on user feedback."
          />

          <FAQItem
            question="Can I access my books on multiple devices?"
            answer="Yes! If you connect cloud storage (Google Drive, Dropbox, iCloud), your books will be accessible on any device where you're logged in."
          />

          <FAQItem
            question="How do I change my reading progress?"
            answer="Your progress is automatically tracked as you read. You can also manually update it from your Library by tapping on a book."
          />

          <FAQItem
            question="Is my reading data private?"
            answer="You control your privacy settings. You can choose to make your profile public or private, and control who sees your reading activity."
          />

          <FAQItem
            question="How do I follow other readers?"
            answer="Visit any user's profile and tap the 'Follow' button. You'll see their reading activity in your feed."
          />

          <FAQItem
            question="Can I delete my account?"
            answer="Yes. Go to Settings > Privacy > Delete Account. This action is permanent and cannot be undone."
          />

          <FAQItem
            question="I forgot my password. What do I do?"
            answer="On the login screen, tap 'Forgot Password' and follow the instructions sent to your email."
          />

          <FAQItem
            question="How do I report inappropriate content?"
            answer="Tap the three dots on any content and select 'Report'. We review all reports and take action according to our Community Guidelines."
          />
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="book-outline" size={24} color="#F7F4EF" />
            <Text style={styles.resourceText}>User Guide (Coming Soon)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="videocam-outline" size={24} color="#F7F4EF" />
            <Text style={styles.resourceText}>Video Tutorials (Coming Soon)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="people-outline" size={24} color="#F7F4EF" />
            <Text style={styles.resourceText}>Community Forum (Coming Soon)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Still need help? We're here for you!
            {'\n'}Email us at support@tometrack.co.za
          </Text>
        </View>

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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactSubtitle: {
    color: '#7BA591',
    fontSize: 14,
    marginBottom: 4,
  },
  contactNote: {
    color: '#F7F4EF',
    opacity: 0.6,
    fontSize: 12,
  },
  faqItem: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  question: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  answer: {
    color: '#F7F4EF',
    opacity: 0.8,
    fontSize: 14,
    lineHeight: 22,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  resourceText: {
    color: '#F7F4EF',
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#4A5568',
    padding: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  footerText: {
    color: '#F7F4EF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  spacer: {
    height: 40,
  },
});