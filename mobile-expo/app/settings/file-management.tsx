import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function FileManagementScreen() {
  const router = useRouter();
  const [connectedServices, setConnectedServices] = useState({
    googleDrive: false,
    dropbox: false,
    oneDrive: false,
  });

  const handleConnectService = (service: string) => {
    // TODO: Implement OAuth connection
    if (service === 'Google Drive') {
      setConnectedServices({ ...connectedServices, googleDrive: !connectedServices.googleDrive });
    } else if (service === 'Dropbox') {
      setConnectedServices({ ...connectedServices, dropbox: !connectedServices.dropbox });
    } else if (service === 'OneDrive') {
      setConnectedServices({ ...connectedServices, oneDrive: !connectedServices.oneDrive });
    }
  };

  const handleBrowseDevice = () => {
    // TODO: Open native file picker for bulk selection
    // For now, just navigate back (would open file picker in production)
  };

  const handleManageFiles = () => {
    // TODO: Navigate to file library screen
    // For now, just do nothing (would open file management screen in production)
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <Text style={styles.title}>File Management</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Description */}
        <Text style={styles.description}>
          Upload your personal ebook files and connect them to books in TomeTrack. Your files stay on your device or cloud storage - we never host your books.
        </Text>

        {/* Device Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Storage</Text>
          
          <TouchableOpacity style={styles.uploadCard} onPress={handleBrowseDevice}>
            <View style={styles.uploadCardLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="phone-portrait-outline" size={32} color="#7BA591" />
              </View>
              <View style={styles.uploadInfo}>
                <Text style={styles.uploadTitle}>Browse Device</Text>
                <Text style={styles.uploadSubtext}>Select multiple files from your phone</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#F7F4EF" opacity={0.5} />
          </TouchableOpacity>

          <View style={styles.supportedFormats}>
            <Text style={styles.supportedTitle}>Supported formats:</Text>
            <Text style={styles.supportedText}>EPUB, PDF, MOBI, AZW, TXT</Text>
          </View>
        </View>

        {/* Cloud Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cloud Storage</Text>
          <Text style={styles.sectionDescription}>
            Connect your cloud storage to access your ebook library anywhere
          </Text>

          {/* Google Drive */}
          <TouchableOpacity 
            style={[styles.cloudCard, connectedServices.googleDrive && styles.cloudCardConnected]}
            onPress={() => handleConnectService('Google Drive')}
          >
            <View style={styles.cloudCardLeft}>
              <Ionicons name="logo-google" size={32} color="#F7F4EF" />
              <View style={styles.cloudInfo}>
                <Text style={styles.cloudTitle}>Google Drive</Text>
                <Text style={styles.cloudStatus}>
                  {connectedServices.googleDrive ? 'Connected' : 'Not connected'}
                </Text>
              </View>
            </View>
            {connectedServices.googleDrive ? (
              <Text style={styles.disconnectText}>Disconnect</Text>
            ) : (
              <Text style={styles.connectText}>Connect</Text>
            )}
          </TouchableOpacity>

          {/* Dropbox */}
          <TouchableOpacity 
            style={[styles.cloudCard, connectedServices.dropbox && styles.cloudCardConnected]}
            onPress={() => handleConnectService('Dropbox')}
          >
            <View style={styles.cloudCardLeft}>
              <Ionicons name="cloud-outline" size={32} color="#F7F4EF" />
              <View style={styles.cloudInfo}>
                <Text style={styles.cloudTitle}>Dropbox</Text>
                <Text style={styles.cloudStatus}>
                  {connectedServices.dropbox ? 'Connected' : 'Not connected'}
                </Text>
              </View>
            </View>
            {connectedServices.dropbox ? (
              <Text style={styles.disconnectText}>Disconnect</Text>
            ) : (
              <Text style={styles.connectText}>Connect</Text>
            )}
          </TouchableOpacity>

          {/* OneDrive */}
          <TouchableOpacity 
            style={[styles.cloudCard, connectedServices.oneDrive && styles.cloudCardConnected]}
            onPress={() => handleConnectService('OneDrive')}
          >
            <View style={styles.cloudCardLeft}>
              <Ionicons name="cloud-outline" size={32} color="#F7F4EF" />
              <View style={styles.cloudInfo}>
                <Text style={styles.cloudTitle}>OneDrive</Text>
                <Text style={styles.cloudStatus}>
                  {connectedServices.oneDrive ? 'Connected' : 'Not connected'}
                </Text>
              </View>
            </View>
            {connectedServices.oneDrive ? (
              <Text style={styles.disconnectText}>Disconnect</Text>
            ) : (
              <Text style={styles.connectText}>Connect</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Manage Files */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Files</Text>
          
          <TouchableOpacity style={styles.manageCard} onPress={handleManageFiles}>
            <View style={styles.manageCardLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="folder-open-outline" size={32} color="#7BA591" />
              </View>
              <View style={styles.manageInfo}>
                <Text style={styles.manageTitle}>Manage Uploaded Files</Text>
                <Text style={styles.manageSubtext}>View and organize your ebook library</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#F7F4EF" opacity={0.5} />
          </TouchableOpacity>

          <View style={styles.storageInfo}>
            <Ionicons name="information-circle-outline" size={20} color="#7BA591" />
            <Text style={styles.storageText}>
              Files are linked to books in your library but remain stored on your device or cloud storage
            </Text>
          </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    color: '#F7F4EF',
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F7F4EF',
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#F7F4EF',
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  uploadCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2C3E50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadInfo: {
    flex: 1,
  },
  uploadTitle: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadSubtext: {
    color: '#F7F4EF',
    fontSize: 13,
    opacity: 0.7,
  },
  supportedFormats: {
    backgroundColor: '#4A5568',
    padding: 12,
    borderRadius: 8,
  },
  supportedTitle: {
    color: '#F7F4EF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  supportedText: {
    color: '#7BA591',
    fontSize: 13,
  },
  cloudCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cloudCardConnected: {
    borderColor: '#7BA591',
  },
  cloudCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  cloudInfo: {
    flex: 1,
  },
  cloudTitle: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cloudStatus: {
    color: '#F7F4EF',
    fontSize: 13,
    opacity: 0.7,
  },
  connectText: {
    color: '#7BA591',
    fontSize: 14,
    fontWeight: '600',
  },
  disconnectText: {
    color: '#F7F4EF',
    fontSize: 14,
    opacity: 0.7,
  },
  manageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  manageCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  manageInfo: {
    flex: 1,
  },
  manageTitle: {
    color: '#F7F4EF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  manageSubtext: {
    color: '#F7F4EF',
    fontSize: 13,
    opacity: 0.7,
  },
  storageInfo: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#4A5568',
    padding: 12,
    borderRadius: 8,
  },
  storageText: {
    flex: 1,
    color: '#F7F4EF',
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 18,
  },
});