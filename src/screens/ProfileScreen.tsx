import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleFeedback = () => {
    if (feedback.trim()) {
      Alert.alert('Thank You!', 'Your feedback has been submitted successfully.');
      setFeedback('');
      setShowFeedback(false);
    } else {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
    }
  };

  const renderProfileSection = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Profile</Text>
      
      <View style={styles.profileInfo}>
        <View style={styles.avatar}>
          <Text style={[styles.avatarText, { color: theme.colors.surface }]}>
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user?.displayName || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Settings</Text>
      
      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Dark Mode</Text>
        <Switch
          value={theme.dark}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.surface}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Notifications</Text>
        <Switch
          value={true}
          onValueChange={() => {}}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.surface}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Auto-refresh</Text>
        <Switch
          value={true}
          onValueChange={() => {}}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.surface}
        />
      </View>
    </View>
  );

  const renderAppInfoSection = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>App Information</Text>
      
      <View style={styles.infoItem}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Version</Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>1.0.0</Text>
      </View>

      <View style={styles.infoItem}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Build</Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>2024.01.01</Text>
      </View>

      <View style={styles.infoItem}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Platform</Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>React Native</Text>
      </View>
    </View>
  );

  const renderSupportSection = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support</Text>
      
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => Alert.alert('Help', 'Help content will be displayed here.')}
      >
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Help & FAQ</Text>
        <Text style={[styles.menuItemArrow, { color: theme.colors.textSecondary }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setShowFeedback(true)}
      >
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Send Feedback</Text>
        <Text style={[styles.menuItemArrow, { color: theme.colors.textSecondary }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => Alert.alert('About', 'SmartHome Automation App\n\nControl your smart home devices with ease.\n\nDeveloped with React Native and Expo.')}
      >
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>About</Text>
        <Text style={[styles.menuItemArrow, { color: theme.colors.textSecondary }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content will be displayed here.')}
      >
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Privacy Policy</Text>
        <Text style={[styles.menuItemArrow, { color: theme.colors.textSecondary }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => Alert.alert('Terms of Service', 'Terms of service content will be displayed here.')}
      >
        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Terms of Service</Text>
        <Text style={[styles.menuItemArrow, { color: theme.colors.textSecondary }]}>›</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFeedbackModal = () => {
    if (!showFeedback) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Send Feedback</Text>
          
          <TextInput
            style={[styles.feedbackInput, { backgroundColor: theme.colors.background, color: theme.colors.text, borderColor: theme.colors.border }]}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Tell us what you think..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.border }]}
              onPress={() => setShowFeedback(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleFeedback}
            >
              <Text style={[styles.modalButtonText, { color: theme.colors.surface }]}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileSection()}
        {renderSettingsSection()}
        {renderAppInfoSection()}
        {renderSupportSection()}

        <TouchableOpacity
          style={[styles.logoutButton, styles.logoutButtonEnhanced, { backgroundColor: theme.colors.primary }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutButtonText, styles.logoutButtonTextEnhanced, { color: theme.colors.surface }]}>⎋ Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderFeedbackModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingLabel: {
    fontSize: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuItemText: {
    fontSize: 16,
  },
  menuItemArrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  logoutButtonEnhanced: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderColor: '#ffcccc',
    borderWidth: 2,
    elevation: 8,
    shadowColor: '#ff0000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButtonTextEnhanced: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
