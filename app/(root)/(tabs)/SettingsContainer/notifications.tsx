import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  useWindowDimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

const NotificationSettings = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  // Initial state for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    appNotifications: true,
    sound: true,
    vibration: true,
    emailNotifications: true,
    newsletter: false,
    pushNotifications: true,
    lessonReminders: true,
    streakReminders: true,
    achievementAlerts: true,
    friendActivity: true,
    specialOffers: false
  });

  // Load settings from backend (simulated)
  useEffect(() => {
    // In a real app, you would fetch this from your backend
    const fetchNotificationSettings = async () => {
      try {
        // Simulate API call
        // const response = await fetch('/api/notification-settings');
        // const data = await response.json();
        const mockData = {
          appNotifications: true,
          sound: true,
          vibration: true,
          emailNotifications: true,
          newsletter: false,
          pushNotifications: true,
          lessonReminders: true,
          streakReminders: true,
          achievementAlerts: true,
          friendActivity: true,
          specialOffers: false
        };
        setNotificationSettings(mockData);
      } catch (error) {
        console.error('Failed to fetch notification settings:', error);
      }
    };

    fetchNotificationSettings();
  }, []);

  // Handle toggle change
  const handleToggleChange = async (setting) => {
    const newValue = !notificationSettings[setting];

    // Optimistic UI update
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: newValue
    }));

    try {
      // In a real app, you would send this to your backend
      // await fetch('/api/notification-settings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     setting,
      //     value: newValue
      //   })
      // });

      console.log(`Updated ${setting} to ${newValue}`);
    } catch (error) {
      console.error('Failed to update notification setting:', error);
      // Revert if API call fails
      setNotificationSettings(prev => ({
        ...prev,
        [setting]: !newValue
      }));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notification Settings</Text>
        </View>

        {/* General Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={20} color="#7f6edb" />
            <Text style={styles.sectionTitle}>General Notifications</Text>
          </View>

          <NotificationToggle
            icon={<Ionicons name="notifications-outline" size={20} color="#7f6edb" />}
            label="App Notifications"
            description="Enable all notifications from this app"
            value={notificationSettings.appNotifications}
            onValueChange={() => handleToggleChange('appNotifications')}
          />

          <NotificationToggle
            icon={<Ionicons name="volume-high-outline" size={20} color="#7f6edb" />}
            label="Sound"
            description="Play sound for notifications"
            value={notificationSettings.sound && notificationSettings.appNotifications}
            onValueChange={() => handleToggleChange('sound')}
            disabled={!notificationSettings.appNotifications}
          />

          <NotificationToggle
            icon={<MaterialCommunityIcons name="vibrate" size={20} color="#7f6edb" />}
            label="Vibration"
            description="Vibrate device for notifications"
            value={notificationSettings.vibration && notificationSettings.appNotifications}
            onValueChange={() => handleToggleChange('vibration')}
            disabled={!notificationSettings.appNotifications}
          />
        </View>

        {/* Email Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="mail-outline" size={20} color="#7f6edb" />
            <Text style={styles.sectionTitle}>Email Notifications</Text>
          </View>

          <NotificationToggle
            icon={<Feather name="mail" size={20} color="#7f6edb" />}
            label="Email Notifications"
            description="Receive notifications via email"
            value={notificationSettings.emailNotifications}
            onValueChange={() => handleToggleChange('emailNotifications')}
          />

          <NotificationToggle
            icon={<Ionicons name="newspaper-outline" size={20} color="#7f6edb" />}
            label="Newsletter"
            description="Receive weekly updates and tips"
            value={notificationSettings.newsletter}
            onValueChange={() => handleToggleChange('newsletter')}
          />
        </View>

        {/* Learning Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="book-outline" size={20} color="#7f6edb" />
            <Text style={styles.sectionTitle}>Learning Notifications</Text>
          </View>

          <NotificationToggle
            icon={<MaterialCommunityIcons name="bell-ring-outline" size={20} color="#7f6edb" />}
            label="Push Notifications"
            description="Get instant notifications on your device"
            value={notificationSettings.pushNotifications && notificationSettings.appNotifications}
            onValueChange={() => handleToggleChange('pushNotifications')}
            disabled={!notificationSettings.appNotifications}
          />

          <NotificationToggle
            icon={<Ionicons name="alarm-outline" size={20} color="#7f6edb" />}
            label="Lesson Reminders"
            description="Reminders to complete your daily lessons"
            value={notificationSettings.lessonReminders && notificationSettings.appNotifications}
            onValueChange={() => handleToggleChange('lessonReminders')}
            disabled={!notificationSettings.appNotifications}
          />

          <NotificationToggle
            icon={<FontAwesome5 name="fire" size={18} color="#7f6edb" />}
            label="Streak Reminders"
            description="Notifications to maintain your learning streak"
            value={notificationSettings.streakReminders && notificationSettings.appNotifications}
            onValueChange={() => handleToggleChange('streakReminders')}
            disabled={!notificationSettings.appNotifications}
          />
        </View>

        {/* Activity Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={20} color="#7f6edb" />
            <Text style={styles.sectionTitle}>Activity Notifications</Text>
          </View>

          <NotificationToggle
            icon={<Ionicons name="trophy-outline" size={20} color="#7f6edb" />}
            label="Achievement Alerts"
            description="Notify when you earn achievements"
            value={notificationSettings.achievementAlerts && notificationSettings.appNotifications}
            onValueChange={() => handleToggleChange('achievementAlerts')}
            disabled={!notificationSettings.appNotifications}
          />

          <NotificationToggle
            icon={<Ionicons name="person-add-outline" size={20} color="#7f6edb" />}
            label="Friend Activity"
            description="Updates about your friends' progress"
            value={notificationSettings.friendActivity && notificationSettings.appNotifications}
            onValueChange={() => handleToggleChange('friendActivity')}
            disabled={!notificationSettings.appNotifications}
          />

          <NotificationToggle
            icon={<Ionicons name="pricetag-outline" size={20} color="#7f6edb" />}
            label="Special Offers"
            description="Promotions and special discounts"
            value={notificationSettings.specialOffers}
            onValueChange={() => handleToggleChange('specialOffers')}
          />
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

// Reusable notification toggle component
const NotificationToggle = ({ icon, label, description, value, onValueChange, disabled = false }) => {
  return (
    <View style={[styles.notificationItem, disabled && styles.disabledItem]}>
      <View style={styles.notificationIcon}>{icon}</View>
      <View style={styles.notificationTextContainer}>
        <Text style={[styles.notificationLabel, disabled && styles.disabledText]}>{label}</Text>
        <Text style={[styles.notificationDescription, disabled && styles.disabledText]}>
          {description}
        </Text>
      </View>
      <Switch
        trackColor={{ false: '#f0f0f0', true: '#7f6edb' }}
        thumbColor="#fff"
        ios_backgroundColor="#f0f0f0"
        onValueChange={onValueChange}
        value={value}
        disabled={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7f6edb',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#7f6edb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f6edb',
    marginLeft: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  disabledItem: {
    opacity: 0.6,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(127, 110, 219, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 13,
    color: '#777',
  },
  disabledText: {
    color: '#aaa',
  },
});

export default NotificationSettings;