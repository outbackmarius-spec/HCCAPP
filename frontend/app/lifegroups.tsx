import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const COLORS = {
  primary: '#00D4D4',
  background: '#0c0c0c',
  surface: '#1a1a1a',
  card: '#242424',
  text: '#FFFFFF',
  textSecondary: '#888888',
  success: '#4CAF50',
};

interface LifeGroup {
  id: string;
  name: string;
  description: string;
  leader: string;
  schedule: string;
  location: string;
  max_members: number;
  current_members: number;
}

interface Ministry {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const MINISTRIES: Ministry[] = [
  {
    id: '1',
    name: 'Meals Ministry',
    description: 'Providing meals to those in need within our community. We prepare and deliver meals to families going through difficult times.',
    imageUrl: 'https://customer-assets.emergentagent.com/job_church-checkin-7/artifacts/d1hia1rh_Meals%20Ministry.avif',
  },
  {
    id: '2',
    name: 'HUB Singers',
    description: 'Our choir ministry bringing worship through song. Join us as we lift our voices together in praise and worship.',
    imageUrl: 'https://customer-assets.emergentagent.com/job_church-checkin-7/artifacts/botpde0d_Hub%20Singers.avif',
  },
  {
    id: '3',
    name: 'Music Team',
    description: 'Leading worship through music and song. If you play an instrument or love to sing, this is your place to serve.',
    imageUrl: 'https://customer-assets.emergentagent.com/job_church-checkin-7/artifacts/cuyuhqys_Music%20Team.avif',
  },
  {
    id: '4',
    name: 'Hospitality Team',
    description: 'Creating a welcoming environment for all who visit. From greeting at the door to serving coffee, we make everyone feel at home.',
    imageUrl: 'https://customer-assets.emergentagent.com/job_church-checkin-7/artifacts/d32bzahf_Hospitality%20Team.avif',
  },
];

export default function ResourcesScreen() {
  const [groups, setGroups] = useState<LifeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<LifeGroup | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'ministries' | 'lifegroups'>('ministries');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/life-groups`);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching life groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const openSignup = (group: LifeGroup) => {
    setSelectedGroup(group);
    setShowSignupModal(true);
  };

  const handleSignup = async () => {
    if (!signupName.trim() || !signupEmail.trim() || !signupPhone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!selectedGroup) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/life-groups/signup`, {
        group_id: selectedGroup.id,
        name: signupName,
        email: signupEmail,
        phone: signupPhone,
      });

      setShowSignupModal(false);
      setSignupName('');
      setSignupEmail('');
      setSignupPhone('');
      setSelectedGroup(null);

      Alert.alert(
        'Welcome!',
        `You've signed up for ${selectedGroup.name}. The group leader will contact you soon!`
      );

      fetchGroups();
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Failed to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGroupIcon = (name: string) => {
    if (name.toLowerCase().includes('women')) return 'woman';
    if (name.toLowerCase().includes('men')) return 'man';
    if (name.toLowerCase().includes('young')) return 'people';
    if (name.toLowerCase().includes('marriage') || name.toLowerCase().includes('family')) return 'heart';
    return 'book';
  };

  const renderMinistry = (ministry: Ministry) => (
    <View key={ministry.id} style={styles.ministryCard}>
      <Image
        source={{ uri: ministry.imageUrl }}
        style={styles.ministryImage}
        resizeMode="cover"
      />
      <View style={styles.ministryContent}>
        <Text style={styles.ministryName}>{ministry.name}</Text>
        <Text style={styles.ministryDescription}>{ministry.description}</Text>
      </View>
    </View>
  );

  const renderGroup = (item: LifeGroup) => {
    const spotsLeft = item.max_members - item.current_members;
    const isFull = spotsLeft <= 0;

    return (
      <View key={item.id} style={styles.groupCard}>
        <View style={styles.groupHeader}>
          <View style={styles.groupIconContainer}>
            <Ionicons name={getGroupIcon(item.name) as any} size={28} color={COLORS.primary} />
          </View>
          <View style={styles.groupHeaderInfo}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupLeader}>Led by {item.leader}</Text>
          </View>
        </View>

        <Text style={styles.groupDescription}>{item.description}</Text>

        <View style={styles.groupDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{item.schedule}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              {item.current_members}/{item.max_members} members
            </Text>
          </View>
        </View>

        <View style={styles.groupFooter}>
          <View style={[styles.spotsBadge, isFull && styles.spotsBadgeFull]}>
            <Text style={[styles.spotsText, isFull && styles.spotsTextFull]}>
              {isFull ? 'Group Full' : `${spotsLeft} spots left`}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.joinButton, isFull && styles.joinButtonDisabled]}
            onPress={() => openSignup(item)}
            disabled={isFull}
          >
            <Text style={[styles.joinButtonText, isFull && styles.joinButtonTextDisabled]}>
              {isFull ? 'Waitlist' : 'Join Group'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading Resources...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resources</Text>
        <Text style={styles.headerSubtitle}>Ministries & Life Groups</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ministries' && styles.tabActive]}
          onPress={() => setActiveTab('ministries')}
        >
          <Ionicons 
            name="heart" 
            size={20} 
            color={activeTab === 'ministries' ? COLORS.background : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'ministries' && styles.tabTextActive]}>
            Ministries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lifegroups' && styles.tabActive]}
          onPress={() => setActiveTab('lifegroups')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'lifegroups' ? COLORS.background : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'lifegroups' && styles.tabTextActive]}>
            Life Groups
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'ministries' ? (
          <>
            <Text style={styles.sectionIntro}>
              Discover ways to serve and get involved in our church community.
            </Text>
            {MINISTRIES.map(renderMinistry)}
          </>
        ) : (
          <>
            <Text style={styles.sectionIntro}>
              Join a Life Group and grow together in faith and community.
            </Text>
            {groups.map(renderGroup)}
          </>
        )}
      </ScrollView>

      {/* Signup Modal */}
      <Modal visible={showSignupModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Join Life Group</Text>
              <TouchableOpacity onPress={() => setShowSignupModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {selectedGroup && (
              <View style={styles.selectedGroupInfo}>
                <Text style={styles.selectedGroupName}>{selectedGroup.name}</Text>
                <Text style={styles.selectedGroupSchedule}>{selectedGroup.schedule}</Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Your Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.textSecondary}
              value={signupName}
              onChangeText={setSignupName}
            />

            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textSecondary}
              value={signupEmail}
              onChangeText={setSignupEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.textSecondary}
              value={signupPhone}
              onChangeText={setSignupPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSignup}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  sectionIntro: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  // Ministry Styles
  ministryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  ministryImage: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.card,
  },
  ministryContent: {
    padding: 16,
  },
  ministryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  ministryDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  // Life Group Styles
  groupCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  groupHeaderInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  groupLeader: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 2,
  },
  groupDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  groupDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotsBadge: {
    backgroundColor: COLORS.success + '22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  spotsBadgeFull: {
    backgroundColor: '#f4433622',
  },
  spotsText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.success,
  },
  spotsTextFull: {
    color: '#f44336',
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  joinButtonDisabled: {
    backgroundColor: COLORS.card,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  joinButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  selectedGroupInfo: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  selectedGroupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  selectedGroupSchedule: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
});
