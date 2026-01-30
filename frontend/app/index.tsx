import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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
  error: '#f44336',
};

export default function HomeScreen() {
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [selectedDay, setSelectedDay] = useState('SUN');
  
  // Check-in form state
  const [checkinName, setCheckinName] = useState('');
  const [checkinPhone, setCheckinPhone] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  
  // Prayer request form state
  const [prayerName, setPrayerName] = useState('');
  const [prayerRequest, setPrayerRequest] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Question form state
  const [questionName, setQuestionName] = useState('');
  const [questionEmail, setQuestionEmail] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionAnonymous, setQuestionAnonymous] = useState(false);

  // Connect form state
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
      console.error('Check-in error:', error);
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
      console.error('Prayer request error:', error);
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
      console.error('Question error:', error);
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
      console.error('Connect error:', error);
      Alert.alert('Error', 'Failed to submit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>HCC</Text>
              <Text style={styles.logoSubtext}>#RISE26</Text>
            </View>
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
          <View style={styles.checkinIcon}>
            <Ionicons
              name={checkedIn ? 'checkmark-circle' : 'location'}
              size={40}
              color={checkedIn ? COLORS.success : COLORS.primary}
            />
          </View>
          <View style={styles.checkinContent}>
            <Text style={styles.checkinTitle}>
              {checkedIn ? 'You\'re Checked In!' : 'Tap to Check In'}
            </Text>
            <Text style={styles.checkinSubtitle}>
              {checkedIn
                ? 'Welcome! We\'re glad you\'re here.'
                : 'Let us know you\'re here today'}
            </Text>
          </View>
          {!checkedIn && (
            <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
          )}
        </TouchableOpacity>

        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to Church!</Text>
          <Text style={styles.welcomeText}>
            We're so glad you're here. Whether you're visiting for the first time or
            you've been here for years, you're part of our family.
          </Text>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>How Can We Help?</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowPrayerModal(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#7B68EE22' }]}>
              <Ionicons name="hand-left" size={28} color="#7B68EE" />
            </View>
            <Text style={styles.actionTitle}>Prayer Request</Text>
            <Text style={styles.actionSubtitle}>We'll pray for you</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowQuestionModal(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FF6B6B22' }]}>
              <Ionicons name="help-circle" size={28} color="#FF6B6B" />
            </View>
            <Text style={styles.actionTitle}>Questions?</Text>
            <Text style={styles.actionSubtitle}>We're here to help</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowConnectModal(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#4CAF5022' }]}>
              <Ionicons name="people" size={28} color="#4CAF50" />
            </View>
            <Text style={styles.actionTitle}>Connect Now</Text>
            <Text style={styles.actionSubtitle}>Join a Life Group</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => Linking.openURL('https://tithe.ly/give_new/www/#/tithely/give-one-time/1303414')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFD70022' }]}>
              <Ionicons name="gift" size={28} color="#FFD700" />
            </View>
            <Text style={styles.actionTitle}>Give</Text>
            <Text style={styles.actionSubtitle}>Support our mission</Text>
          </TouchableOpacity>
        </View>

        {/* This Week */}
        <View style={styles.thisWeekCard}>
          <Text style={styles.thisWeekTitle}>Weekly at HCC</Text>
          
          {/* Day Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayTabsContainer}
          >
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayTab, selectedDay === day && styles.dayTabActive]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.dayTabText, selectedDay === day && styles.dayTabTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Events for selected day */}
          <View style={styles.dayEventsContainer}>
            {selectedDay === 'SUN' && (
              <View style={styles.dayEventItem}>
                <Ionicons name="people" size={20} color={COLORS.primary} />
                <View style={styles.dayEventInfo}>
                  <Text style={styles.dayEventName}>Sunday Service</Text>
                  <Text style={styles.dayEventTime}>9:00 AM</Text>
                </View>
              </View>
            )}

            {selectedDay === 'MON' && (
              <>
                <View style={styles.dayEventItem}>
                  <Ionicons name="cafe" size={20} color={COLORS.primary} />
                  <View style={styles.dayEventInfo}>
                    <Text style={styles.dayEventName}>Men's Coffee at Kerb Cafe</Text>
                    <Text style={styles.dayEventTime}>8:00 AM</Text>
                  </View>
                </View>
                <View style={styles.dayEventItem}>
                  <Ionicons name="musical-notes" size={20} color={COLORS.primary} />
                  <View style={styles.dayEventInfo}>
                    <Text style={styles.dayEventName}>HUB Singers Practice</Text>
                    <Text style={styles.dayEventTime}>5:30 PM</Text>
                  </View>
                </View>
              </>
            )}

            {selectedDay === 'TUE' && (
              <View style={styles.dayEventItem}>
                <Ionicons name="people-circle" size={20} color={COLORS.primary} />
                <View style={styles.dayEventInfo}>
                  <Text style={styles.dayEventName}>Young Adults Life Group</Text>
                  <Text style={styles.dayEventTime}>6:30 PM</Text>
                </View>
              </View>
            )}

            {selectedDay === 'WED' && (
              <>
                <View style={styles.dayEventItem}>
                  <Ionicons name="hand-left" size={20} color={COLORS.primary} />
                  <View style={styles.dayEventInfo}>
                    <Text style={styles.dayEventName}>Prayer Meeting</Text>
                    <Text style={styles.dayEventTime}>5:30 PM</Text>
                  </View>
                </View>
                <View style={styles.dayEventItem}>
                  <Ionicons name="heart" size={20} color={COLORS.primary} />
                  <View style={styles.dayEventInfo}>
                    <Text style={styles.dayEventName}>Hope Harbour Recovery Group</Text>
                    <Text style={styles.dayEventTime}>6:30 PM</Text>
                  </View>
                </View>
              </>
            )}

            {selectedDay === 'THU' && (
              <>
                <View style={styles.dayEventItem}>
                  <Ionicons name="book" size={20} color={COLORS.primary} />
                  <View style={styles.dayEventInfo}>
                    <Text style={styles.dayEventName}>Men's Life Group</Text>
                    <Text style={styles.dayEventTime}>8:30 AM</Text>
                  </View>
                </View>
                <View style={styles.dayEventItem}>
                  <Ionicons name="color-palette" size={20} color={COLORS.primary} />
                  <View style={styles.dayEventInfo}>
                    <Text style={styles.dayEventName}>Ladies Craft Group</Text>
                    <Text style={styles.dayEventTime}>10:30 AM</Text>
                  </View>
                </View>
              </>
            )}

            {selectedDay === 'FRI' && (
              <>
                <View style={styles.dayEventItem}>
                  <Ionicons name="book" size={20} color={COLORS.primary} />
                  <View style={styles.dayEventInfo}>
                    <Text style={styles.dayEventName}>Ladies Life Group</Text>
                    <Text style={styles.dayEventTime}>9:00 AM</Text>
                  </View>
                </View>
                <View style={styles.dayEventItem}>
                  <Ionicons name="happy" size={20} color={COLORS.primary} />
                  <View style={styles.dayEventInfo}>
                    <Text style={styles.dayEventName}>Youth Group</Text>
                    <Text style={styles.dayEventTime}>6:30 PM - 8:00 PM</Text>
                  </View>
                </View>
              </>
            )}

            {selectedDay === 'SAT' && (
              <View style={styles.noEventsContainer}>
                <Ionicons name="calendar-outline" size={32} color={COLORS.textSecondary} />
                <Text style={styles.noEventsText}>No scheduled events</Text>
                <Text style={styles.noEventsSubtext}>Enjoy your rest day!</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Check-in Modal */}
      <Modal visible={showCheckinModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Check In</Text>
              <TouchableOpacity onPress={() => setShowCheckinModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Your Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textSecondary}
              value={checkinName}
              onChangeText={setCheckinName}
            />

            <Text style={styles.inputLabel}>Phone (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.textSecondary}
              value={checkinPhone}
              onChangeText={setCheckinPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsFirstTime(!isFirstTime)}
            >
              <View style={[styles.checkbox, isFirstTime && styles.checkboxChecked]}>
                {isFirstTime && <Ionicons name="checkmark" size={16} color={COLORS.background} />}
              </View>
              <Text style={styles.checkboxLabel}>This is my first time visiting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCheckin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>Check In</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Prayer Request Modal */}
      <Modal visible={showPrayerModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Prayer Request</Text>
              <TouchableOpacity onPress={() => setShowPrayerModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsAnonymous(!isAnonymous)}
            >
              <View style={[styles.checkbox, isAnonymous && styles.checkboxChecked]}>
                {isAnonymous && <Ionicons name="checkmark" size={16} color={COLORS.background} />}
              </View>
              <Text style={styles.checkboxLabel}>Submit anonymously</Text>
            </TouchableOpacity>

            {!isAnonymous && (
              <>
                <Text style={styles.inputLabel}>Your Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.textSecondary}
                  value={prayerName}
                  onChangeText={setPrayerName}
                />
              </>
            )}

            <Text style={styles.inputLabel}>Prayer Request *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Share your prayer request..."
              placeholderTextColor={COLORS.textSecondary}
              value={prayerRequest}
              onChangeText={setPrayerRequest}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handlePrayerRequest}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Question Modal */}
      <Modal visible={showQuestionModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ask a Question</Text>
              <TouchableOpacity onPress={() => setShowQuestionModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setQuestionAnonymous(!questionAnonymous)}
            >
              <View style={[styles.checkbox, questionAnonymous && styles.checkboxChecked]}>
                {questionAnonymous && <Ionicons name="checkmark" size={16} color={COLORS.background} />}
              </View>
              <Text style={styles.checkboxLabel}>Submit anonymously</Text>
            </TouchableOpacity>

            {!questionAnonymous && (
              <>
                <Text style={styles.inputLabel}>Your Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.textSecondary}
                  value={questionName}
                  onChangeText={setQuestionName}
                />

                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.textSecondary}
                  value={questionEmail}
                  onChangeText={setQuestionEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </>
            )}

            <Text style={styles.inputLabel}>Your Question *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What would you like to know?"
              placeholderTextColor={COLORS.textSecondary}
              value={questionText}
              onChangeText={setQuestionText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleQuestion}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>Submit Question</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Connect Now Modal */}
      <Modal visible={showConnectModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Connect Now</Text>
              <TouchableOpacity onPress={() => setShowConnectModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.connectIntro}>
              We'd love to help you find your place in our community! Fill out the form below and someone will reach out to help you get connected.
            </Text>

            <Text style={styles.inputLabel}>Your Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.textSecondary}
              value={connectName}
              onChangeText={setConnectName}
            />

            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textSecondary}
              value={connectEmail}
              onChangeText={setConnectEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.textSecondary}
              value={connectPhone}
              onChangeText={setConnectPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>I'm interested in...</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Joining a Life Group, Youth Group, etc."
              placeholderTextColor={COLORS.textSecondary}
              value={connectInterest}
              onChangeText={setConnectInterest}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text style={styles.submitButtonText}>Connect Me</Text>
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
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  logoContainer: {
    marginBottom: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  checkedInCard: {
    borderColor: COLORS.success,
    backgroundColor: '#4CAF5011',
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
    color: COLORS.text,
  },
  checkinSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  welcomeCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  thisWeekCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
  },
  thisWeekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  dayTabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dayTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.card,
  },
  dayTabActive: {
    backgroundColor: COLORS.primary,
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dayTabTextActive: {
    color: COLORS.background,
  },
  dayEventsContainer: {
    minHeight: 80,
  },
  dayEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  dayEventInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dayEventName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayEventTime: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 2,
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  noEventsText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  noEventsSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventDate: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary + '22',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventDay: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  eventDateNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  eventTime: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
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
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
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
  textArea: {
    height: 120,
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
    color: COLORS.background,
  },
});
