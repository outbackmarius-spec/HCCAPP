import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const COLORS = {
  primary: '#00D4D4',
  primaryDark: '#00A3A3',
  secondary: '#FF6B6B',
  accent: '#FFD93D',
  purple: '#7B68EE',
  green: '#4CAF50',
  orange: '#FF9500',
  pink: '#FF6B9D',
  background: '#0a0a0a',
  surface: '#141414',
  card: '#1e1e1e',
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
};

export default function HomeScreen() {
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedDay, setSelectedDay] = useState('SUN');
  
  const [checkinName, setCheckinName] = useState('');
  const [checkinPhone, setCheckinPhone] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  
  const [prayerName, setPrayerName] = useState('');
  const [prayerRequest, setPrayerRequest] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [questionName, setQuestionName] = useState('');
  const [questionEmail, setQuestionEmail] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionAnonymous, setQuestionAnonymous] = useState(false);

  const [connectName, setConnectName] = useState('');
  const [connectEmail, setConnectEmail] = useState('');
  const [connectPhone, setConnectPhone] = useState('');
  const [connectInterest, setConnectInterest] = useState('');

  const handleCheckin = async () => {
    if (!checkinName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/checkins`, {
        name: checkinName,
        phone: checkinPhone || null,
        is_first_time: isFirstTime,
      });
      setCheckedIn(true);
      setShowCheckinModal(false);
      setCheckinName('');
      setCheckinPhone('');
      setIsFirstTime(false);
      Alert.alert('Welcome!', 'You have successfully checked in. God bless you!');
    } catch (error) {
      Alert.alert('Error', 'Failed to check in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrayerRequest = async () => {
    if (!prayerRequest.trim()) {
      Alert.alert('Error', 'Please enter your prayer request');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/prayer-requests`, {
        name: isAnonymous ? null : prayerName,
        request: prayerRequest,
        is_anonymous: isAnonymous,
      });
      setShowPrayerModal(false);
      setPrayerName('');
      setPrayerRequest('');
      setIsAnonymous(false);
      Alert.alert('Thank You', 'Your prayer request has been submitted. We are praying for you!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit prayer request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Error', 'Please enter your question');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/questions`, {
        name: questionAnonymous ? null : questionName,
        email: questionAnonymous ? null : questionEmail,
        question: questionText,
        is_anonymous: questionAnonymous,
      });
      setShowQuestionModal(false);
      setQuestionName('');
      setQuestionEmail('');
      setQuestionText('');
      setQuestionAnonymous(false);
      Alert.alert('Thank You', 'Your question has been submitted. Someone will reach out to you soon!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!connectName.trim() || !connectEmail.trim() || !connectPhone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/life-groups/connect`, {
        name: connectName,
        email: connectEmail,
        phone: connectPhone,
        interest: connectInterest || 'Life Group',
      });
      setShowConnectModal(false);
      setConnectName('');
      setConnectEmail('');
      setConnectPhone('');
      setConnectInterest('');
      Alert.alert('Thank You!', 'We received your request to connect! Someone from our team will reach out to you soon.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const DAY_COLORS: { [key: string]: string[] } = {
    'SUN': ['#FF6B6B', '#FF8E8E'],
    'MON': ['#4ECDC4', '#45B7AA'],
    'TUE': ['#7B68EE', '#9683EC'],
    'WED': ['#FFD93D', '#FFE566'],
    'THU': ['#FF9500', '#FFB347'],
    'FRI': ['#FF6B9D', '#FF8EB3'],
    'SAT': ['#6C5CE7', '#8B7CF0'],
  };

  const EVENTS: { [key: string]: { name: string; time: string; icon: string }[] } = {
    'SUN': [{ name: 'Sunday Service', time: '9:00 AM', icon: 'people' }],
    'MON': [
      { name: "Men's Coffee at Kerb Cafe", time: '8:00 AM', icon: 'cafe' },
      { name: 'HUB Singers Practice', time: '5:30 PM', icon: 'musical-notes' },
    ],
    'TUE': [{ name: 'Young Adults Life Group', time: '6:30 PM', icon: 'people-circle' }],
    'WED': [
      { name: 'Prayer Meeting', time: '5:30 PM', icon: 'hand-left' },
      { name: 'Hope Harbour Recovery Group', time: '6:30 PM', icon: 'heart' },
    ],
    'THU': [
      { name: "Men's Life Group", time: '8:30 AM', icon: 'book' },
      { name: 'Ladies Craft Group', time: '10:30 AM', icon: 'color-palette' },
    ],
    'FRI': [
      { name: 'Ladies Life Group', time: '9:00 AM', icon: 'book' },
      { name: 'Youth Group', time: '6:30 PM - 8:00 PM', icon: 'happy' },
    ],
    'SAT': [],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>HCC</Text>
            <Text style={styles.logoSubtext}>#RISE26</Text>
          </View>
          <Text style={styles.churchName}>Highfields Community Church</Text>
          <Text style={styles.tagline}>Welcome Home</Text>
        </View>

        {/* Check-in Card */}
        <TouchableOpacity
          style={[styles.checkinCard, checkedIn && styles.checkedInCard]}
          onPress={() => !checkedIn && setShowCheckinModal(true)}
          disabled={checkedIn}
        >
          <LinearGradient
            colors={checkedIn ? [COLORS.green, '#45a049'] : [COLORS.primary, COLORS.primaryDark]}
            style={styles.checkinGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.checkinIcon}>
              <Ionicons
                name={checkedIn ? 'checkmark-circle' : 'location'}
                size={36}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.checkinContent}>
              <Text style={styles.checkinTitle}>
                {checkedIn ? "You're Checked In!" : 'Tap to Check In'}
              </Text>
              <Text style={styles.checkinSubtitle}>
                {checkedIn ? "Welcome! We're glad you're here." : "Let us know you're here today"}
              </Text>
            </View>
            {!checkedIn && <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />}
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: COLORS.purple }]} />
          <Text style={styles.sectionTitle}>How Can We Help?</Text>
        </View>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => setShowPrayerModal(true)}>
            <LinearGradient colors={['#7B68EE', '#9683EC']} style={styles.actionGradient}>
              <Ionicons name="hand-left" size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.actionTitle}>Prayer</Text>
            <Text style={styles.actionSubtitle}>Request</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => setShowQuestionModal(true)}>
            <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.actionGradient}>
              <Ionicons name="help-circle" size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.actionTitle}>Questions</Text>
            <Text style={styles.actionSubtitle}>Ask us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => setShowConnectModal(true)}>
            <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.actionGradient}>
              <Ionicons name="people" size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.actionTitle}>Connect</Text>
            <Text style={styles.actionSubtitle}>Join a group</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => Linking.openURL('https://tithe.ly/give_new/www/#/tithely/give-one-time/1303414')}
          >
            <LinearGradient colors={['#FFD93D', '#FFE566']} style={styles.actionGradient}>
              <Ionicons name="gift" size={28} color="#000000" />
            </LinearGradient>
            <Text style={styles.actionTitle}>Give</Text>
            <Text style={styles.actionSubtitle}>Tithe.ly</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionDot, { backgroundColor: COLORS.orange }]} />
          <Text style={styles.sectionTitle}>Weekly at HCC</Text>
        </View>

        <View style={styles.weeklyCard}>
          {/* Day Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabsScroll}>
            <View style={styles.dayTabsContainer}>
              {DAYS.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(day)}
                >
                  {selectedDay === day ? (
                    <LinearGradient
                      colors={DAY_COLORS[day]}
                      style={styles.dayTabActive}
                    >
                      <Text style={styles.dayTabTextActive}>{day}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.dayTab}>
                      <Text style={styles.dayTabText}>{day}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Events */}
          <View style={styles.eventsContainer}>
            {EVENTS[selectedDay].length > 0 ? (
              EVENTS[selectedDay].map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <LinearGradient
                    colors={DAY_COLORS[selectedDay]}
                    style={styles.eventIconContainer}
                  >
                    <Ionicons name={event.icon as any} size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventName}>{event.name}</Text>
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noEventsContainer}>
                <Ionicons name="sunny" size={40} color={COLORS.accent} />
                <Text style={styles.noEventsText}>No scheduled events</Text>
                <Text style={styles.noEventsSubtext}>Enjoy your rest day!</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Check-in Modal */}
      <Modal visible={showCheckinModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Check In</Text>
              <TouchableOpacity onPress={() => setShowCheckinModal(false)}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Your Name *</Text>
              <TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor={COLORS.textSecondary} value={checkinName} onChangeText={setCheckinName} />
              <Text style={styles.inputLabel}>Phone (optional)</Text>
              <TextInput style={styles.input} placeholder="Enter your phone number" placeholderTextColor={COLORS.textSecondary} value={checkinPhone} onChangeText={setCheckinPhone} keyboardType="phone-pad" />
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setIsFirstTime(!isFirstTime)}>
                <View style={[styles.checkbox, isFirstTime && styles.checkboxChecked]}>
                  {isFirstTime && <Ionicons name="checkmark" size={16} color="#000" />}
                </View>
                <Text style={styles.checkboxLabel}>This is my first time visiting</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleCheckin} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.submitButtonText}>Check In</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Prayer Request Modal */}
      <Modal visible={showPrayerModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#7B68EE', '#9683EC']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Prayer Request</Text>
              <TouchableOpacity onPress={() => setShowPrayerModal(false)}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.modalBody}>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setIsAnonymous(!isAnonymous)}>
                <View style={[styles.checkbox, isAnonymous && styles.checkboxChecked]}>
                  {isAnonymous && <Ionicons name="checkmark" size={16} color="#000" />}
                </View>
                <Text style={styles.checkboxLabel}>Submit anonymously</Text>
              </TouchableOpacity>
              {!isAnonymous && (
                <>
                  <Text style={styles.inputLabel}>Your Name</Text>
                  <TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor={COLORS.textSecondary} value={prayerName} onChangeText={setPrayerName} />
                </>
              )}
              <Text style={styles.inputLabel}>Prayer Request *</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="Share your prayer request..." placeholderTextColor={COLORS.textSecondary} value={prayerRequest} onChangeText={setPrayerRequest} multiline numberOfLines={4} textAlignVertical="top" />
              <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#7B68EE' }]} onPress={handlePrayerRequest} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.submitButtonText, { color: '#FFF' }]}>Submit Request</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Question Modal */}
      <Modal visible={showQuestionModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ask a Question</Text>
              <TouchableOpacity onPress={() => setShowQuestionModal(false)}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.modalBody}>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setQuestionAnonymous(!questionAnonymous)}>
                <View style={[styles.checkbox, questionAnonymous && styles.checkboxChecked]}>
                  {questionAnonymous && <Ionicons name="checkmark" size={16} color="#000" />}
                </View>
                <Text style={styles.checkboxLabel}>Submit anonymously</Text>
              </TouchableOpacity>
              {!questionAnonymous && (
                <>
                  <Text style={styles.inputLabel}>Your Name</Text>
                  <TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor={COLORS.textSecondary} value={questionName} onChangeText={setQuestionName} />
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor={COLORS.textSecondary} value={questionEmail} onChangeText={setQuestionEmail} keyboardType="email-address" autoCapitalize="none" />
                </>
              )}
              <Text style={styles.inputLabel}>Your Question *</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="What would you like to know?" placeholderTextColor={COLORS.textSecondary} value={questionText} onChangeText={setQuestionText} multiline numberOfLines={4} textAlignVertical="top" />
              <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#FF6B6B' }]} onPress={handleQuestion} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.submitButtonText, { color: '#FFF' }]}>Submit Question</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Connect Modal */}
      <Modal visible={showConnectModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#4CAF50', '#66BB6A']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Connect Now</Text>
              <TouchableOpacity onPress={() => setShowConnectModal(false)}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.modalBody}>
              <Text style={styles.connectIntro}>We'd love to help you find your place in our community!</Text>
              <Text style={styles.inputLabel}>Your Name *</Text>
              <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor={COLORS.textSecondary} value={connectName} onChangeText={setConnectName} />
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor={COLORS.textSecondary} value={connectEmail} onChangeText={setConnectEmail} keyboardType="email-address" autoCapitalize="none" />
              <Text style={styles.inputLabel}>Phone *</Text>
              <TextInput style={styles.input} placeholder="Enter your phone number" placeholderTextColor={COLORS.textSecondary} value={connectPhone} onChangeText={setConnectPhone} keyboardType="phone-pad" />
              <Text style={styles.inputLabel}>I'm interested in...</Text>
              <TextInput style={styles.input} placeholder="e.g., Joining a Life Group, Youth Group" placeholderTextColor={COLORS.textSecondary} value={connectInterest} onChangeText={setConnectInterest} />
              <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#4CAF50' }]} onPress={handleConnect} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.submitButtonText, { color: '#FFF' }]}>Connect Me</Text>}
              </TouchableOpacity>
            </View>
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
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  logoSubtext: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  churchName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 4,
  },
  checkinCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkedInCard: {
    shadowColor: COLORS.green,
  },
  checkinGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  checkinIcon: {
    marginRight: 16,
  },
  checkinContent: {
    flex: 1,
  },
  checkinTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  checkinSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 28,
    marginBottom: 16,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  actionCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  actionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  weeklyCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
  },
  dayTabsScroll: {
    marginBottom: 16,
  },
  dayTabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  dayTabActive: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dayTabTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  eventsContainer: {
    minHeight: 80,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
    marginLeft: 12,
  },
  eventName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  eventTime: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 2,
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  noEventsText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  noEventsSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalBody: {
    padding: 20,
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  connectIntro: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
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
    color: '#000000',
  },
});
