import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const COLORS = {
  primary: '#00D4D4',
  background: '#0c0c0c',
  surface: '#1a1a1a',
  card: '#242424',
  text: '#FFFFFF',
  textSecondary: '#888888',
};

const YOUTUBE_CHANNEL_ID = 'UCGKqUGpw1M6kFMKpkfkpCBQ';
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@highfieldscommunitychurch3628';

export default function SermonsScreen() {
  const [showWebView, setShowWebView] = useState(false);

  const openYouTubeChannel = () => {
    Linking.openURL(YOUTUBE_CHANNEL_URL);
  };

  const openYouTubeApp = () => {
    // Try to open YouTube app first, fall back to browser
    const youtubeAppUrl = `youtube://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;
    const youtubeWebUrl = YOUTUBE_CHANNEL_URL;
    
    Linking.canOpenURL(youtubeAppUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(youtubeAppUrl);
        } else {
          return Linking.openURL(youtubeWebUrl);
        }
      })
      .catch(() => {
        Linking.openURL(youtubeWebUrl);
      });
  };

  if (showWebView && Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.webViewHeader}>
          <TouchableOpacity onPress={() => setShowWebView(false)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <WebView
          source={{ uri: `https://www.youtube.com/embed/videoseries?list=UU${YOUTUBE_CHANNEL_ID.substring(2)}` }}
          style={styles.webView}
          allowsFullscreenVideo
          javaScriptEnabled
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sermons</Text>
          <Text style={styles.headerSubtitle}>Watch and grow in faith</Text>
        </View>

        {/* YouTube Channel Card */}
        <View style={styles.channelCard}>
          <View style={styles.channelIconContainer}>
            <Ionicons name="logo-youtube" size={48} color="#FF0000" />
          </View>
          <Text style={styles.channelName}>Highfields Community Church</Text>
          <Text style={styles.channelDescription}>
            Watch our latest sermons, worship sessions, and special events on our YouTube channel.
          </Text>
          
          <TouchableOpacity style={styles.watchButton} onPress={openYouTubeApp}>
            <Ionicons name="play-circle" size={24} color={COLORS.background} />
            <Text style={styles.watchButtonText}>Watch on YouTube</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Access Section */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        
        <TouchableOpacity style={styles.linkCard} onPress={openYouTubeChannel}>
          <View style={styles.linkIconContainer}>
            <Ionicons name="videocam" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>All Videos</Text>
            <Text style={styles.linkSubtitle}>Browse all our sermon recordings</Text>
          </View>
          <Ionicons name="open-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkCard} 
          onPress={() => Linking.openURL(`${YOUTUBE_CHANNEL_URL}/live`)}
        >
          <View style={[styles.linkIconContainer, { backgroundColor: '#FF000022' }]}>
            <Ionicons name="radio" size={24} color="#FF0000" />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>Live Stream</Text>
            <Text style={styles.linkSubtitle}>Watch our services live on Sundays</Text>
          </View>
          <Ionicons name="open-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkCard} 
          onPress={() => Linking.openURL(`${YOUTUBE_CHANNEL_URL}/playlists`)}
        >
          <View style={[styles.linkIconContainer, { backgroundColor: '#7B68EE22' }]}>
            <Ionicons name="list" size={24} color="#7B68EE" />
          </View>
          <View style={styles.linkContent}>
            <Text style={styles.linkTitle}>Sermon Series</Text>
            <Text style={styles.linkSubtitle}>Watch complete sermon series</Text>
          </View>
          <Ionicons name="open-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Subscribe Section */}
        <View style={styles.subscribeCard}>
          <Ionicons name="notifications" size={32} color={COLORS.primary} />
          <Text style={styles.subscribeTitle}>Never Miss a Sermon</Text>
          <Text style={styles.subscribeText}>
            Subscribe to our YouTube channel and turn on notifications to get updates when new sermons are uploaded.
          </Text>
          <TouchableOpacity 
            style={styles.subscribeButton} 
            onPress={() => Linking.openURL(`${YOUTUBE_CHANNEL_URL}?sub_confirmation=1`)}
          >
            <Ionicons name="logo-youtube" size={20} color="#FFFFFF" />
            <Text style={styles.subscribeButtonText}>Subscribe</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Our sermons are uploaded to YouTube after each Sunday service.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  webViewHeader: {
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 8,
  },
  webView: {
    flex: 1,
  },
  channelCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  channelIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF000011',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  channelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  channelDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  watchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  linkIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  linkSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  subscribeCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  subscribeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  subscribeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  subscribeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primary + '11',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 12,
    lineHeight: 18,
  },
});
