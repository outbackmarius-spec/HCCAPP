import React, { useState } from 'react';
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

const MINISTRY_AREAS = [
  'Worship Team',
  'Kids Ministry',
  'Youth Ministry',
  'Welcome Team',
  'Tech/Media',
  'Hospitality',
  'Outreach',
  'Prayer Team',
  'Administration',
  'Other',
];

const DONATION_AMOUNTS = [25, 50, 100, 250, 500];

export default function ConnectScreen() {
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Volunteer form state
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>([]);
  const [volunteerAvailability, setVolunteerAvailability] = useState('');
  const [volunteerNotes, setVolunteerNotes] = useState('');

  // Donate form state
  const [donateName, setDonateName] = useState('');
  const [donateEmail, setDonateEmail] = useState('');
  const [donateAmount, setDonateAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [donateMessage, setDonateMessage] = useState('');

  const toggleMinistry = (ministry: string) => {
    if (selectedMinistries.includes(ministry)) {
      setSelectedMinistries(selectedMinistries.filter((m) => m !== ministry));
    } else {
      setSelectedMinistries([...selectedMinistries, ministry]);
    }
  };

  const handleVolunteerSubmit = async () => {
    if (!volunteerName.trim() || !volunteerEmail.trim() || !volunteerPhone.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (selectedMinistries.length === 0) {
      Alert.alert('Error', 'Please select at least one ministry area');
      return;
    }
    if (!volunteerAvailability.trim()) {
      Alert.alert('Error', 'Please enter your availability');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/volunteers`, {
        name: volunteerName,
        email: volunteerEmail,
        phone: volunteerPhone,
        ministry_areas: selectedMinistries,
        availability: volunteerAvailability,
        notes: volunteerNotes || null,
      });

      setShowVolunteerModal(false);
      resetVolunteerForm();
      Alert.alert(
        'Thank You!',
        'Your volunteer application has been submitted. Our team will contact you soon!'
      );
    } catch (error) {
      console.error('Volunteer submit error:', error);
      Alert.alert('Error', 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDonateSubmit = async () => {
    const amount = customAmount ? parseFloat(customAmount) : parseFloat(donateAmount);
    
    if (!donateName.trim() || !donateEmail.trim()) {
      Alert.alert('Error', 'Please enter your name and email');
      return;
    }
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please select or enter a donation amount');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/donations`, {
        name: donateName,
        email: donateEmail,
        amount: amount,
        donation_type: donationType,
        message: donateMessage || null,
      });

      setShowDonateModal(false);
      resetDonateForm();
      Alert.alert(
        'Thank You!',
        'Your donation intent has been recorded. Our team will reach out with payment instructions. God bless you!'
      );
    } catch (error) {
      console.error('Donate submit error:', error);
      Alert.alert('Error', 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetVolunteerForm = () => {
    setVolunteerName('');
    setVolunteerEmail('');
    setVolunteerPhone('');
    setSelectedMinistries([]);
    setVolunteerAvailability('');
    setVolunteerNotes('');
  };

  const resetDonateForm = () => {
    setDonateName('');
    setDonateEmail('');
    setDonateAmount('');
    setCustomAmount('');
    setDonationType('one-time');
    setDonateMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Connect</Text>
          <Text style={styles.headerSubtitle}>Get involved and make an impact</Text>
        </View>

        {/* Volunteer Card */}
        <TouchableOpacity
          style={styles.connectCard}
          onPress={() => setShowVolunteerModal(true)}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#FF6B6B22' }]}>
            <Ionicons name="hand-right" size={32} color="#FF6B6B" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Volunteer</Text>
            <Text style={styles.cardDescription}>
              Use your gifts to serve others and make a difference in our community.
            </Text>
            <View style={styles.cardTags}>
              <Text style={styles.cardTag}>Worship</Text>
              <Text style={styles.cardTag}>Kids</Text>
              <Text style={styles.cardTag}>Tech</Text>
              <Text style={styles.cardTag}>+More</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Donate Card */}
        <TouchableOpacity
          style={styles.connectCard}
          onPress={() => setShowDonateModal(true)}
        >
          <View style={[styles.cardIcon, { backgroundColor: '#4CAF5022' }]}>
            <Ionicons name="gift" size={32} color="#4CAF50" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Give</Text>
            <Text style={styles.cardDescription}>
              Support our mission and help us spread the message of hope and love.
            </Text>
            <View style={styles.cardTags}>
              <Text style={styles.cardTag}>One-time</Text>
              <Text style={styles.cardTag}>Recurring</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Contact Info */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <View style={styles.contactItem}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>55 Highfields Rd, Highfields, QLD 4352</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>(555) 123-4567</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>info@highfieldschurch.org</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="time" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>Sunday Services: 9 AM & 11 AM</Text>
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-youtube" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="globe" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Volunteer Modal */}
      <Modal visible={showVolunteerModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Volunteer Sign Up</Text>
              <TouchableOpacity onPress={() => setShowVolunteerModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Your Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.textSecondary}
                value={volunteerName}
                onChangeText={setVolunteerName}
              />

              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textSecondary}
                value={volunteerEmail}
                onChangeText={setVolunteerEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Phone *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.textSecondary}
                value={volunteerPhone}
                onChangeText={setVolunteerPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Ministry Areas *</Text>
              <View style={styles.ministryGrid}>
                {MINISTRY_AREAS.map((ministry) => (
                  <TouchableOpacity
                    key={ministry}
                    style={[
                      styles.ministryChip,
                      selectedMinistries.includes(ministry) && styles.ministryChipSelected,
                    ]}
                    onPress={() => toggleMinistry(ministry)}
                  >
                    <Text
                      style={[
                        styles.ministryChipText,
                        selectedMinistries.includes(ministry) && styles.ministryChipTextSelected,
                      ]}
                    >
                      {ministry}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Availability *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Sundays, Wednesday evenings"
                placeholderTextColor={COLORS.textSecondary}
                value={volunteerAvailability}
                onChangeText={setVolunteerAvailability}
              />

              <Text style={styles.inputLabel}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any skills or experience you'd like to share?"
                placeholderTextColor={COLORS.textSecondary}
                value={volunteerNotes}
                onChangeText={setVolunteerNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleVolunteerSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={COLORS.background} />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Application</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Donate Modal */}
      <Modal visible={showDonateModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Make a Gift</Text>
              <TouchableOpacity onPress={() => setShowDonateModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Your Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.textSecondary}
                value={donateName}
                onChangeText={setDonateName}
              />

              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textSecondary}
                value={donateEmail}
                onChangeText={setDonateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Donation Type</Text>
              <View style={styles.donationTypeRow}>
                <TouchableOpacity
                  style={[
                    styles.donationTypeButton,
                    donationType === 'one-time' && styles.donationTypeButtonActive,
                  ]}
                  onPress={() => setDonationType('one-time')}
                >
                  <Text
                    style={[
                      styles.donationTypeText,
                      donationType === 'one-time' && styles.donationTypeTextActive,
                    ]}
                  >
                    One-time
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.donationTypeButton,
                    donationType === 'recurring' && styles.donationTypeButtonActive,
                  ]}
                  onPress={() => setDonationType('recurring')}
                >
                  <Text
                    style={[
                      styles.donationTypeText,
                      donationType === 'recurring' && styles.donationTypeTextActive,
                    ]}
                  >
                    Recurring
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Select Amount</Text>
              <View style={styles.amountGrid}>
                {DONATION_AMOUNTS.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.amountButton,
                      donateAmount === amount.toString() && styles.amountButtonActive,
                    ]}
                    onPress={() => {
                      setDonateAmount(amount.toString());
                      setCustomAmount('');
                    }}
                  >
                    <Text
                      style={[
                        styles.amountButtonText,
                        donateAmount === amount.toString() && styles.amountButtonTextActive,
                      ]}
                    >
                      ${amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Or Enter Custom Amount</Text>
              <View style={styles.customAmountContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.customAmountInput}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.textSecondary}
                  value={customAmount}
                  onChangeText={(text) => {
                    setCustomAmount(text);
                    setDonateAmount('');
                  }}
                  keyboardType="decimal-pad"
                />
              </View>

              <Text style={styles.inputLabel}>Message (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special notes or dedications?"
                placeholderTextColor={COLORS.textSecondary}
                value={donateMessage}
                onChangeText={setDonateMessage}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <View style={styles.donateNote}>
                <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                <Text style={styles.donateNoteText}>
                  After submitting, our team will contact you with payment options.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleDonateSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={COLORS.background} />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Donation Intent</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
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
  connectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardTag: {
    fontSize: 11,
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '22',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  contactCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
  socialSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 20,
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
    height: 100,
    textAlignVertical: 'top',
  },
  ministryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  ministryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ministryChipSelected: {
    backgroundColor: COLORS.primary + '22',
    borderColor: COLORS.primary,
  },
  ministryChipText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  ministryChipTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  donationTypeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  donationTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
  },
  donationTypeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  donationTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  donationTypeTextActive: {
    color: COLORS.background,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  amountButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.card,
  },
  amountButtonActive: {
    backgroundColor: COLORS.primary,
  },
  amountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  amountButtonTextActive: {
    color: COLORS.background,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingLeft: 16,
  },
  customAmountInput: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    color: COLORS.text,
  },
  donateNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '11',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  donateNoteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 8,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
});
