import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import PagerView from 'react-native-pager-view';
import * as FileSystem from 'expo-file-system/legacy';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.101.22:3000/api';
const { width, height } = Dimensions.get('window');

export default function ReaderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const pagerRef = useRef<PagerView>(null);
  const webViewRef = useRef<WebView>(null);
  const [book, setBook] = useState<any>(null);
  const [libraryEntry, setLibraryEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isEpubText, setIsEpubText] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId && id) {
      loadBookAndFile();
    }
  }, [userId, id]);

  const getUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('@tometrack_user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.id);
      }
    } catch (error) {
      console.error('Get user ID error:', error);
    }
  };

  const loadBookAndFile = async () => {
    try {
      setLoading(true);

      const bookResponse = await axios.get(`${API_URL}/books/${id}`);
      setBook(bookResponse.data);

      if (userId) {
        const libraryResponse = await axios.get(`${API_URL}/library/${userId}`);
        const userBook = libraryResponse.data.library.find((item: any) => item.book_id === id);
        setLibraryEntry(userBook);

        if (userBook && userBook.file_path) {
          await loadFile(userBook.file_path, userBook.file_format, bookResponse.data);
          
          if (userBook.status !== 'reading' && userBook.library_id) {
            try {
              await axios.put(`${API_URL}/library/update/${userBook.library_id}`, {
                status: 'reading'
              });
            } catch (error) {
              console.error('Update status error:', error);
            }
          }
        } else {
          Alert.alert('No File', 'Please upload an ebook file first', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        }
      }
    } catch (error: any) {
      console.error('Load book error:', error);
      Alert.alert('Error', 'Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  const splitIntoPages = (text: string) => {
    const charsPerLine = Math.floor((width - 48) / 11);
    const linesPerPage = Math.floor((height - 200) / 32);
    const charsPerPage = charsPerLine * linesPerPage;

    const pageArray: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      let endIndex = startIndex + charsPerPage;
      
      if (endIndex < text.length) {
        const nextSpace = text.indexOf(' ', endIndex);
        const prevSpace = text.lastIndexOf(' ', endIndex);
        
        if (prevSpace > startIndex) {
          endIndex = prevSpace;
        }
      }

      pageArray.push(text.substring(startIndex, endIndex).trim());
      startIndex = endIndex;
    }

    return pageArray;
  };

  const loadFile = async (filePath: string, fileFormat: string, bookData: any) => {
    try {
      console.log('Loading file:', filePath, 'Format:', fileFormat);

      if (fileFormat === 'txt') {
        const content = await FileSystem.readAsStringAsync(filePath);
        const pageArray = splitIntoPages(content);
        setPages(pageArray);
        setTotalPages(pageArray.length);
        setIsEpubText(true);
      } else if (fileFormat === 'pdf') {
        setHtmlContent(filePath);
      } else if (fileFormat === 'epub') {
        try {
          const JSZip = require('jszip');
          
          const base64 = await FileSystem.readAsStringAsync(filePath, {
            encoding: 'base64',
          });

          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const zip = new JSZip();
          const epub = await zip.loadAsync(bytes);

          let content = '';
          const files = Object.keys(epub.files);
          
          for (const filename of files) {
            if (filename.includes('.xhtml') || filename.includes('.html')) {
              const file = epub.files[filename];
              if (file && !file.dir) {
                const text = await file.async('text');
                const strippedText = text
                  .replace(/<style[^>]*>.*?<\/style>/gs, '')
                  .replace(/<script[^>]*>.*?<\/script>/gs, '')
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();
                content += strippedText + '\n\n';
              }
            }
          }

          if (content.length > 0) {
            const pageArray = splitIntoPages(content);
            setPages(pageArray);
            setTotalPages(pageArray.length);
            setIsEpubText(true);
          } else {
            throw new Error('No readable content found');
          }
          
        } catch (error) {
          console.error('EPUB parsing error:', error);
          setIsEpubText(false);
          const epubHTML = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  background: #2C3E50;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  padding: 24px;
                  line-height: 1.6;
                  color: #F7F4EF;
                }
                .book-title {
                  font-size: 24px;
                  font-weight: 600;
                  margin-bottom: 8px;
                  color: #F7F4EF;
                }
                .book-author {
                  font-size: 16px;
                  font-style: italic;
                  color: #7BA591;
                  margin-bottom: 32px;
                }
                .message {
                  background: #7BA591;
                  color: #F7F4EF;
                  padding: 20px;
                  border-radius: 12px;
                  margin-bottom: 24px;
                }
                .message h3 {
                  margin-bottom: 8px;
                  font-size: 18px;
                  font-weight: 600;
                }
                .message p {
                  margin: 0;
                  font-size: 15px;
                  opacity: 0.95;
                }
                .section-title {
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 16px;
                  margin-top: 24px;
                  color: #F7F4EF;
                }
                p {
                  margin-bottom: 16px;
                  font-size: 15px;
                  opacity: 0.9;
                }
                ul {
                  margin: 16px 0;
                  padding-left: 0;
                  list-style: none;
                }
                li {
                  margin: 12px 0;
                  padding-left: 24px;
                  position: relative;
                  font-size: 15px;
                }
                li:before {
                  content: "•";
                  position: absolute;
                  left: 8px;
                  color: #7BA591;
                  font-weight: bold;
                }
                .instructions {
                  background: #4A5568;
                  color: #F7F4EF;
                  padding: 20px;
                  border-radius: 12px;
                  margin-top: 24px;
                }
                .instructions p {
                  margin: 0;
                  font-size: 14px;
                }
                .instructions p:first-child {
                  font-weight: 600;
                  margin-bottom: 8px;
                }
              </style>
            </head>
            <body>
              <div class="book-title">${bookData?.title || 'Book'}</div>
              <div class="book-author">by ${bookData?.author || 'Unknown Author'}</div>
              
              <div class="message">
                <h3>✓ EPUB File Loaded</h3>
                <p>Your EPUB file has been successfully uploaded and is stored in your library.</p>
              </div>
              
              <div class="section-title">About EPUB Reading</div>
              
              <p>EPUB files contain complex formatting, images, and interactive elements that require specialized rendering engines.</p>
              
              <p>For the best reading experience with full formatting, navigation, and features, we recommend:</p>
              
              <ul>
                <li>Google Play Books</li>
                <li>Apple Books (iOS)</li>
                <li>Moon+ Reader</li>
                <li>FBReader</li>
              </ul>
              
              <div class="instructions">
                <p>Your file is safely stored in TomeTrack</p>
                <p>You can track your reading progress, add reviews, and manage your library here. Export or share your EPUB file to dedicated reader apps for the full reading experience.</p>
              </div>
            </body>
            </html>
          `;
          
          setHtmlContent(epubHTML);
        }
      } else if (fileFormat === 'mobi') {
        setHtmlContent(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                padding: 24px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #F7F4EF;
                background: #2C3E50;
                margin: 0;
              }
              h1 {
                color: #F7F4EF;
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 8px;
              }
              .author {
                font-style: italic;
                color: #7BA591;
                margin-bottom: 32px;
                font-size: 16px;
              }
              p {
                margin: 16px 0;
                font-size: 15px;
                opacity: 0.9;
              }
              .info-box {
                background: #7BA591;
                padding: 20px;
                border-radius: 12px;
                margin: 24px 0;
              }
              .success {
                color: #F7F4EF;
                font-weight: 600;
                font-size: 18px;
                margin-bottom: 8px;
              }
              .info-box p {
                color: #F7F4EF;
                opacity: 0.95;
                margin: 0;
              }
              .section-title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 16px;
                margin-top: 24px;
                color: #F7F4EF;
              }
              ul {
                margin: 16px 0;
                padding-left: 0;
                list-style: none;
              }
              li {
                margin: 12px 0;
                padding-left: 24px;
                position: relative;
                font-size: 15px;
              }
              li:before {
                content: "•";
                position: absolute;
                left: 8px;
                color: #7BA591;
                font-weight: bold;
              }
              .instructions {
                background: #4A5568;
                padding: 20px;
                border-radius: 12px;
                margin-top: 24px;
              }
              .instructions p {
                margin: 0;
                font-size: 14px;
              }
              .instructions p:first-child {
                font-weight: 600;
                margin-bottom: 8px;
              }
            </style>
          </head>
          <body>
            <h1>${bookData?.title || 'Book'}</h1>
            <p class="author">by ${bookData?.author || 'Unknown Author'}</p>
            
            <div class="info-box">
              <p class="success">✓ File successfully uploaded</p>
              <p><b>Format:</b> MOBI</p>
            </div>
            
            <div class="section-title">About MOBI Reading</div>
            
            <p>MOBI files are Amazon's proprietary format and require specialized readers.</p>
            
            <p>For the best reading experience with MOBI files, we recommend:</p>
            <ul>
              <li>Kindle app</li>
              <li>Calibre (desktop)</li>
              <li>Convert to EPUB using Calibre</li>
            </ul>
            
            <div class="instructions">
              <p>Your file is safely stored in TomeTrack</p>
              <p>You can track your reading progress and manage your library here.</p>
            </div>
          </body>
          </html>
        `);
      }

    } catch (error: any) {
      console.error('Load file error:', error);
      Alert.alert('Error', 'Failed to load file content');
    }
  };

  const renderPDFReader = () => {
    return (
      <WebView
        source={{ uri: htmlContent }}
        style={styles.webView}
        onError={(error) => {
          console.error('WebView error:', error);
          Alert.alert('Error', 'Failed to load PDF');
        }}
      />
    );
  };

  const renderWebReader = () => {
    return (
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webView}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7BA591" />
          <Text style={styles.loadingText}>Loading book...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#F7F4EF" />
        </TouchableOpacity>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {book?.title || 'Reading'}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {book?.author || ''}
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push(`/book/${id}`)} style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="#F7F4EF" />
        </TouchableOpacity>
      </View>

      <View style={styles.readerContainer}>
        {(libraryEntry?.file_format === 'txt' || (libraryEntry?.file_format === 'epub' && isEpubText)) && (
          <PagerView
            ref={pagerRef}
            style={styles.pagerView}
            initialPage={0}
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          >
            {pages.map((pageContent, index) => (
              <View key={index} style={styles.page}>
                <Text style={styles.pageText}>{pageContent}</Text>
                <Text style={styles.pageNumber}>
                  {index + 1} / {totalPages}
                </Text>
              </View>
            ))}
          </PagerView>
        )}
        
        {libraryEntry?.file_format === 'pdf' && renderPDFReader()}
        {((libraryEntry?.file_format === 'epub' && !isEpubText) || libraryEntry?.file_format === 'mobi') && renderWebReader()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#F7F4EF',
    fontSize: 16,
    marginTop: 16,
    opacity: 0.7,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#2C3E50',
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
  },
  backButton: {
    marginRight: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F7F4EF',
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 13,
    color: '#7BA591',
  },
  infoButton: {
    marginLeft: 12,
  },
  readerContainer: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    backgroundColor: '#2C3E50',
    padding: 24,
    justifyContent: 'flex-start',
  },
  pageText: {
    fontSize: 18,
    lineHeight: 32,
    color: '#F7F4EF',
    fontFamily: 'System',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    color: '#7BA591',
    fontSize: 12,
    fontWeight: '600',
  },
  webView: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
});