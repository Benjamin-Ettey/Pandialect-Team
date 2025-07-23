import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ActivityIndicator,
  RefreshControl
} from 'react-native';

type UserProfileData = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  streak: number;
  totalXp: number;
  lessonsCompleted: number;
  level: string;
  learning?: Array<{
    language: string;
    flag: string;
    level: string;
    progress: number;
    lessonsCompleted: number;
    streak: number;
  }>;
};

const ProfileScreen = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);


  useEffect(() => {
    const loadUserData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem("userId");
          const storedToken = await AsyncStorage.getItem("accessToken");
          setUserId(storedUserId);
          setAccessToken(storedToken);
        } catch (error) {
          console.error("Failed to load user data:", error);
      }
    };
      loadUserData();
  }, []);
  

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/profile?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data: UserProfileData = await response.json();
      setUser(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserProfile();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permissions to change your avatar');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await updateAvatar(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const updateAvatar = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'avatar.jpg',
        type: 'image/jpeg'
      } as any);

      const response = await fetch('http://localhost:8080/api/user/avatar', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      });

      if (!response.ok) throw new Error('Avatar update failed');

      const { avatarUrl } = await response.json();
      setUser(prev => prev ? { ...prev, avatarUrl } : null);
    } catch (err) {
      Alert.alert('Error', 'Failed to update avatar');
      console.error('Avatar update error:', err);
    }
  };

  const removeAvatar = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
        }
      });

      if (!response.ok) throw new Error('Avatar removal failed');

      setUser(prev => prev ? { ...prev, avatarUrl: null } : null);
    } catch (err) {
      Alert.alert('Error', 'Failed to remove avatar');
      console.error('Avatar removal error:', err);
    }
    setModalVisible(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7f6edb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No profile data available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7f6edb']}
            tintColor="#7f6edb"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.8}>
            <View style={styles.avatarContainer}>
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={48} color="#7f6edb" />
                </View>
              )}
              <View style={styles.editBadge}>
                <Feather name="edit-2" size={14} color="#7f6edb" />
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.levelBadge}>
            <Ionicons name="ribbon" size={16} color="#fff" />
            <Text style={styles.levelText}>{user.level || 'Beginner'} Learner</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <FontAwesome5 name="fire" size={20} color="#ff9800" />
              </View>
              <Text style={styles.statValue}>{user.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(127, 110, 219, 0.1)' }]}>
                <MaterialCommunityIcons name="star-four-points" size={20} color="#7f6edb" />
              </View>
              <Text style={styles.statValue}>{user.totalXp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 178, 115, 0.1)' }]}>
                <MaterialCommunityIcons name="book-open-variant" size={20} color="#3bb273" />
              </View>
              <Text style={styles.statValue}>{user.lessonsCompleted}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
          </View>
        </View>

        {/* Learning Progress */}
        {user.learning && user.learning.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Languages</Text>
            {user.learning.map((lang, index) => (
              <TouchableOpacity
                key={index}
                style={styles.languageCard}
                onPress={() => {
                  setSelectedLanguage(lang);
                  setLanguageModalVisible(true);
                }}
              >
                <View style={styles.languageHeader}>
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={styles.languageName}>{lang.language}</Text>
                  <Text style={styles.languageLevel}>{lang.level}</Text>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${lang.progress}%`, backgroundColor: '#7f6edb' }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{lang.progress}%</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Word Bank Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Word Bank</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/(root)/(tabs)/WordBank/wordBank')}
          >
            <View style={styles.settingIcon}>
              <FontAwesome5 name="book" size={20} color="#7f6edb" />
            </View>
            <Text style={styles.settingText}>View Saved Words</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/(root)/(tabs)/SettingsContainer/accountSettings')}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="person-outline" size={20} color="#7f6edb" />
            </View>
            <Text style={styles.settingText}>Account Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/(root)/(tabs)/SettingsContainer/notifications')}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="notifications-outline" size={20} color="#7f6edb" />
            </View>
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/(root)/(tabs)/SettingsContainer/HelpAndSupport')}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="help-circle-outline" size={20} color="#7f6edb" />
            </View>
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Avatar Change Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Profile Photo</Text>

            <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
              <Ionicons name="image-outline" size={22} color="#7f6edb" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            {user.avatarUrl && (
              <TouchableOpacity
                style={[styles.modalOption, { borderBottomWidth: 0 }]}
                onPress={removeAvatar}
              >
                <Ionicons name="trash-outline" size={22} color="#e74c3c" />
                <Text style={[styles.modalOptionText, { color: '#e74c3c' }]}>Remove Current Photo</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Details Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.languageModalContainer}>
            {selectedLanguage && (
              <>
                <View style={styles.languageModalHeader}>
                  <Text style={styles.languageModalFlag}>{selectedLanguage.flag}</Text>
                  <Text style={styles.languageModalName}>{selectedLanguage.language}</Text>
                </View>

                <View style={styles.languageStatRow}>
                  <View style={styles.languageStatItem}>
                    <Text style={styles.languageStatValue}>{selectedLanguage.progress}%</Text>
                    <Text style={styles.languageStatLabel}>Progress</Text>
                  </View>

                  <View style={styles.languageStatItem}>
                    <Text style={styles.languageStatValue}>{selectedLanguage.lessonsCompleted}</Text>
                    <Text style={styles.languageStatLabel}>Lessons</Text>
                  </View>

                  <View style={styles.languageStatItem}>
                    <Text style={styles.languageStatValue}>{selectedLanguage.streak}</Text>
                    <Text style={styles.languageStatLabel}>Day Streak</Text>
                  </View>
                </View>

                <Text style={styles.languageLevelText}>
                  Current Level: <Text style={{ fontWeight: 'bold' }}>{selectedLanguage.level}</Text>
                </Text>

                <TouchableOpacity
                  style={styles.languageContinueButton}
                  onPress={() => {
                    setLanguageModalVisible(false);
                    router.push(`/learn/${selectedLanguage.language.toLowerCase()}`);
                  }}
                >
                  <Text style={styles.languageContinueButtonText}>Continue Learning</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.languageModalClose}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.languageModalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    marginVertical: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#7f6edb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#edeafd',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7f6edb',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7f6edb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  languageCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  languageLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f6edb',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 8,
    minWidth: 40,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(127, 110, 219, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  modalCancel: {
    padding: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f6edb',
  },
  languageModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    padding: 24,
  },
  languageModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  languageModalFlag: {
    fontSize: 36,
    marginRight: 16,
  },
  languageModalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  languageStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  languageStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  languageStatValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7f6edb',
    marginBottom: 4,
  },
  languageStatLabel: {
    fontSize: 14,
    color: '#777',
  },
  languageLevelText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
  },
  languageContinueButton: {
    backgroundColor: '#7f6edb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  languageContinueButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  languageModalClose: {
    padding: 12,
    alignItems: 'center',
  },
  languageModalCloseText: {
    color: '#7f6edb',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;