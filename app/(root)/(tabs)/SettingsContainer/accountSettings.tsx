import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';


async function handleLogout() {
  try {
    // Clear user data from AsyncStorage
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');

    // Redirect to login page
    router.replace('/(root)/(tabs)/loginPage/login');
  } catch (error) {
    console.error('Failed to logout:', error);
    Alert.alert('Error', 'Failed to logout. Please try again.');
  }
}

const AccountSettings = () => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  // User data state
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    username: 'alexj',
    phone: '+1 (555) 123-4567',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    password: '********', // In a real app, you wouldn't store this
    language: 'English',
    country: 'United States'
  });

  // Modal states
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // Input states
  const [newName, setNewName] = useState(user.name);
  const [newEmail, setNewEmail] = useState(user.email);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newPhone, setNewPhone] = useState(user.phone);
  
  // Load user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate API call
        // const response = await fetch('/api/user');
        // const data = await response.json();
        const mockData = {
          name: 'Alex Johnson',
          email: 'alex.johnson@example.com',
          username: 'alexj',
          phone: '+1 (555) 123-4567',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          password: '********',
          language: 'English',
          country: 'United States'
        };
        setUser(mockData);
        setNewName(mockData.name);
        setNewEmail(mockData.email);
        setNewUsername(mockData.username);
        setNewPhone(mockData.phone);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  // Handle avatar change
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to change your profile picture');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      updateUserData('avatar', result.assets[0].uri);
    }
    setAvatarModalVisible(false);
  };

  // Remove avatar
  const removeAvatar = () => {
    updateUserData('avatar', null);
    setAvatarModalVisible(false);
  };

  // Update user data (simulates API call)
  const updateUserData = async (field, value) => {
    // Optimistic update
    const oldValue = user[field];
    setUser(prev => ({ ...prev, [field]: value }));

    try {
      // Simulate API call
      // await fetch('/api/user/update', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     field,
      //     value
      //   })
      // });

      console.log(`Updated ${field} to ${value}`);
    } catch (error) {
      console.error('Failed to update user data:', error);
      // Revert if API call fails
      setUser(prev => ({ ...prev, [field]: oldValue }));
      Alert.alert('Error', `Failed to update ${field}`);
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
          <Text style={styles.headerTitle}>Account Settings</Text>
        </View>

        {/* Account Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <AccountSettingItem
            icon={<Ionicons name="person-outline" size={20} color="#7f6edb" />}
            label="Name"
            value={user.name}
            onPress={() => {
              setNewName(user.name);
              setNameModalVisible(true);
            }}
          />

          <AccountSettingItem
            icon={<Ionicons name="mail-outline" size={20} color="#7f6edb" />}
            label="Email"
            value={user.email}
            onPress={() => {
              setNewEmail(user.email);
              setEmailModalVisible(true);
            }}
          />

          <AccountSettingItem
            icon={<Ionicons name="at-outline" size={20} color="#7f6edb" />}
            label="Username"
            value={user.username}
            onPress={() => {
              setNewUsername(user.username);
              setUsernameModalVisible(true);
            }}
          />

          <AccountSettingItem
            icon={<Ionicons name="phone-portrait-outline" size={20} color="#7f6edb" />}
            label="Phone Number"
            value={user.phone}
            onPress={() => {
              setNewPhone(user.phone);
              setPhoneModalVisible(true);
            }}
          />

        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <AccountSettingItem
            icon={<Ionicons name="language-outline" size={20} color="#7f6edb" />}
            label="Language"
            value={user.language}
            onPress={() => setLanguageModalVisible(true)}
          />

          <AccountSettingItem
            icon={<Ionicons name="earth-outline" size={20} color="#7f6edb" />}
            label="Country/Region"
            value={user.country}
            onPress={() => setCountryModalVisible(true)}
          />
        </View>

        
        {/* Danger Zone Section */}
        <View style={[styles.section, { borderColor: '#ff6b6b', borderWidth: 1 }]}>
          <Text style={[styles.sectionTitle, { color: '#ff6b6b' }]}>Danger Zone</Text>

          <TouchableOpacity
            style={styles.dangerItem}
            onPress={() => setLogoutModalVisible(true)}
          >
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
              <Ionicons name="log-out-outline" size={20} color="#ff6b6b" />
            </View>
            <Text style={[styles.settingText, { color: '#ff6b6b' }]}>Logout</Text>
            <Ionicons name="chevron-forward" size={20} color="#ff6b6b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerItem}
            onPress={() => setDeleteModalVisible(true)}
          >
            <View style={[styles.settingIcon, { backgroundColor: 'rgba(255, 107, 107, 0.1)' }]}>
              <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
            </View>
            <Text style={[styles.settingText, { color: '#ff6b6b' }]}>Delete Account</Text>
            <Ionicons name="chevron-forward" size={20} color="#ff6b6b" />
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Change Name Modal */}
      <EditModal
        visible={nameModalVisible}
        onClose={() => setNameModalVisible(false)}
        title="Change Name"
        value={newName}
        onChangeText={setNewName}
        onSave={() => {
          updateUserData('name', newName);
          setNameModalVisible(false);
        }}
        inputProps={{
          placeholder: "Enter your full name",
          autoCapitalize: 'words'
        }}
      />

      {/* Change Email Modal */}
      <EditModal
        visible={emailModalVisible}
        onClose={() => setEmailModalVisible(false)}
        title="Change Email"
        value={newEmail}
        onChangeText={setNewEmail}
        onSave={() => {
          updateUserData('email', newEmail);
          setEmailModalVisible(false);
        }}
        inputProps={{
          placeholder: "Enter your email address",
          keyboardType: 'email-address',
          autoCapitalize: 'none'
        }}
      />

      {/* Change Username Modal */}
      <EditModal
        visible={usernameModalVisible}
        onClose={() => setUsernameModalVisible(false)}
        title="Change Username"
        value={newUsername}
        onChangeText={setNewUsername}
        onSave={() => {
          updateUserData('username', newUsername);
          setUsernameModalVisible(false);
        }}
        inputProps={{
          placeholder: "Enter your username",
          autoCapitalize: 'none'
        }}
      />

      {/* Change Phone Modal */}
      <EditModal
        visible={phoneModalVisible}
        onClose={() => setPhoneModalVisible(false)}
        title="Change Phone Number"
        value={newPhone}
        onChangeText={setNewPhone}
        onSave={() => {
          updateUserData('phone', newPhone);
          setPhoneModalVisible(false);
        }}
        inputProps={{
          placeholder: "Enter your phone number",
          keyboardType: 'phone-pad'
        }}
      />

      {/* Change Avatar Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={avatarModalVisible}
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Profile Photo</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={22} color="#7f6edb" />
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>

            {user.avatar && (
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
              onPress={() => setAvatarModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Delete Account Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.deleteModalHeader}>
              <Ionicons name="warning" size={32} color="#ff6b6b" />
              <Text style={styles.deleteModalTitle}>Delete Account</Text>
            </View>

            <Text style={styles.deleteModalText}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteCancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.deleteCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={async () => {
                  try {
                    // Call your API endpoint
                    // await deleteAccountAPI();

                    // Clear any local data
                    // await AsyncStorage.clear();

                    // Redirect
                    setDeleteModalVisible(false);
                    router.replace('/');
                  } catch (error) {
                    Alert.alert('Error', 'Failed to delete account');
                  }
                }}
              >
                <Text style={styles.deleteConfirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.deleteModalHeader}>
              <Ionicons name="log-out-outline" size={32} color="#ff6b6b" />
              <Text style={styles.deleteModalTitle}>Logout</Text>
            </View>

            <Text style={styles.deleteModalText}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteCancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.deleteCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={() => {
                  setLogoutModalVisible(false);
                  handleLogout();
                }}
              >
                <Text style={styles.deleteConfirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Reusable account setting item component
const AccountSettingItem = ({ icon, label, value, onPress, secure = false }) => {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingValue} numberOfLines={1}>
          {secure ? '••••••••' : value}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

// Reusable edit modal component
const EditModal = ({ visible, onClose, title, value, onChangeText, onSave, inputProps }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChangeText}
              {...inputProps}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f6edb',
    marginBottom: 16,
  },
  avatarContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: '#edeafd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
    backgroundColor: '#edeafd',
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
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
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 13,
    color: '#777',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#7f6edb',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
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
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f6edb',
  },
  deleteModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginLeft: 8,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteCancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  deleteConfirmButton: {
    backgroundColor: '#ff6b6b',
    marginLeft: 8,
  },
  deleteCancelButtonText: {
    color: '#333',
  },
  deleteConfirmButtonText: {
    color: '#fff',
  },
});

export default AccountSettings;