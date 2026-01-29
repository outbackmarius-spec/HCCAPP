import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const COLORS = {
  primary: '#00D4D4',
  background: '#0c0c0c',
  surface: '#1a1a1a',
  card: '#242424',
  text: '#FFFFFF',
  textSecondary: '#888888',
};

interface Sermon {
  id: string;
  title: string;
  description: string;
  speaker: string;
  youtube_url: string;
  thumbnail_url: string;
  date: string;
  series?: string;
}

export default function SermonsScreen() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sermons`);
      setSermons(response.data);
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  const openSermon = (url: string) => {
    Linking.openURL(url);
  };

  const series = [...new Set(sermons.map(s => s.series).filter(Boolean))];

  const filteredSermons = selectedSeries
    ? sermons.filter(s => s.series === selectedSeries)
    : sermons;

  const renderSermon = ({ item }: { item: Sermon }) => (
    <TouchableOpacity
      style={styles.sermonCard}
      onPress={() => openSermon(item.youtube_url)}
    >
      <View style={styles.thumbnailContainer}>
        <View style={styles.thumbnailPlaceholder}>
          <Ionicons name="play-circle" size={48} color={COLORS.primary} />
        </View>
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={32} color={COLORS.text} />
        </View>
      </View>
      <View style={styles.sermonInfo}>
        {item.series && (
          <Text style={styles.seriesBadge}>{item.series}</Text>
        )}
        <Text style={styles.sermonTitle}>{item.title}</Text>
        <Text style={styles.sermonSpeaker}>{item.speaker}</Text>
        <Text style={styles.sermonDate}>
          {format(new Date(item.date), 'MMMM d, yyyy')}
        </Text>
        <Text style={styles.sermonDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading sermons...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Sermons</Text>
        <Text style={styles.headerSubtitle}>Watch and grow in faith</Text>
      </View>

      {/* Series Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', ...series]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                (item === 'All' ? !selectedSeries : selectedSeries === item) &&
                  styles.filterChipActive,
              ]}
              onPress={() => setSelectedSeries(item === 'All' ? null : item)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  (item === 'All' ? !selectedSeries : selectedSeries === item) &&
                    styles.filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <FlatList
        data={filteredSermons}
        renderItem={renderSermon}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam-off" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No sermons found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
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
  filterContainer: {
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.background,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  sermonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    height: 180,
    backgroundColor: COLORS.card,
    position: 'relative',
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sermonInfo: {
    padding: 16,
  },
  seriesBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sermonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  sermonSpeaker: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
  },
  sermonDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  sermonDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
});
